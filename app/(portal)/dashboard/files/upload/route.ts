import { NextResponse, type NextRequest } from "next/server";
import { getDb, getFilesBucket } from "@/lib/portal/env";
import { getSessionUser } from "@/lib/portal/auth";
import { isUuid } from "@/lib/portal/validate";

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

function fail(message: string, status: number) {
  return NextResponse.json({ ok: false, message }, { status });
}

/** Same-origin check for mutating route handlers (Server Actions do this themselves). */
function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/**
 * Uploads one deliverable to R2. The browser sends the raw file as the body, with
 * ?org_id=&name=&project_id= in the query string. Only org admins and staff may upload;
 * the body is streamed straight to the bucket with a fixed length (max 50 MB).
 */
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return fail("Cross-site request blocked.", 403);
  const db = await getDb();
  const bucket = await getFilesBucket();
  if (!db || !bucket) return fail("File uploads are not enabled. Share a link instead.", 404);
  const user = await getSessionUser();
  if (!user) return fail("Sign in again.", 401);

  const q = request.nextUrl.searchParams;
  const orgId = q.get("org_id");
  const projectId = q.get("project_id") || null;
  const name = (q.get("name") ?? "").trim().slice(0, 255);
  if (!isUuid(orgId) || (projectId && !isUuid(projectId))) return fail("Invalid organization or project.", 400);
  if (!name) return fail("File name is required.", 400);

  // Staff, or admin member of this org.
  if (!user.isStaff) {
    const m = await db.prepare("SELECT role FROM memberships WHERE org_id = ? AND user_id = ?").bind(orgId, user.id).first<{ role: string }>();
    if (m?.role !== "admin") return fail("You are not an admin of this organization.", 403);
  }
  if (projectId) {
    const p = await db.prepare("SELECT 1 AS ok FROM projects WHERE id = ? AND org_id = ?").bind(projectId, orgId).first();
    if (!p) return fail("That project was not found in this organization.", 400);
  }

  const length = Number(request.headers.get("content-length"));
  if (!Number.isInteger(length) || length <= 0) return fail("Choose a non-empty file.", 411);
  if (length > MAX_UPLOAD_BYTES) return fail("Files must be 50 MB or smaller.", 413);
  if (!request.body) return fail("Choose a file first.", 400);

  const contentType = (request.headers.get("content-type") || "application/octet-stream").slice(0, 200);
  const key = `${orgId}/${crypto.randomUUID()}`;

  try {
    if (typeof FixedLengthStream === "function") {
      // Streams to R2 without buffering; errors if the body is longer or shorter than declared.
      const { readable, writable } = new FixedLengthStream(length);
      const pipe = request.body.pipeTo(writable);
      await Promise.all([bucket.put(key, readable, { httpMetadata: { contentType } }), pipe]);
    } else {
      // Local `next dev` (Node) has no FixedLengthStream.
      const bytes = await request.arrayBuffer();
      if (bytes.byteLength > MAX_UPLOAD_BYTES) return fail("Files must be 50 MB or smaller.", 413);
      await bucket.put(key, bytes, { httpMetadata: { contentType } });
    }
  } catch (error) {
    console.error("[portal] upload failed", error instanceof Error ? error.message : error);
    await bucket.delete(key).catch(() => undefined);
    return fail("Upload failed. Try again.", 500);
  }

  try {
    await db
      .prepare(
        "INSERT INTO files (id, org_id, project_id, name, r2_key, size_bytes, content_type, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      )
      .bind(crypto.randomUUID(), orgId, projectId, name, key, length, contentType, user.id)
      .run();
  } catch (error) {
    // Do not leave an orphaned object behind.
    await bucket.delete(key).catch(() => undefined);
    console.error("[portal] file record failed", error instanceof Error ? error.message : error);
    return fail("Could not save the file record.", 500);
  }

  return NextResponse.json({ ok: true, message: "File shared with the client." });
}
