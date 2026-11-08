import { NextResponse, type NextRequest } from "next/server";
import { getDb, getFilesBucket } from "@/lib/portal/env";
import { getSessionUser } from "@/lib/portal/auth";
import { isUuid } from "@/lib/portal/validate";

/**
 * Downloads a deliverable. The caller must be signed in and be staff or a member of the
 * file's organization. Uploaded files stream back from R2 as an attachment; link deliverables
 * redirect to their https URL.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  if (!db) return NextResponse.redirect(new URL("/login", request.url));
  const user = await getSessionUser();
  if (!user) return NextResponse.redirect(new URL("/login", request.url));
  if (!isUuid(id)) return new NextResponse("Not found", { status: 404 });

  const file = await db
    .prepare(
      `SELECT f.name, f.r2_key, f.external_url, f.content_type
         FROM files f
        WHERE f.id = ?
          AND (? = 1 OR EXISTS (SELECT 1 FROM memberships m WHERE m.org_id = f.org_id AND m.user_id = ?))`,
    )
    .bind(id, user.isStaff ? 1 : 0, user.id)
    .first<{ name: string; r2_key: string | null; external_url: string | null; content_type: string | null }>();
  if (!file) return new NextResponse("Not found", { status: 404 });

  if (file.external_url) {
    if (!file.external_url.startsWith("https://")) return new NextResponse("Not found", { status: 404 });
    return NextResponse.redirect(file.external_url);
  }

  const bucket = await getFilesBucket();
  if (!bucket || !file.r2_key) return new NextResponse("File storage is not available", { status: 404 });
  const object = await bucket.get(file.r2_key);
  if (!object) return new NextResponse("File unavailable", { status: 404 });

  const ascii = file.name.replace(/[^\x20-\x7e]+/g, "_").replace(/["\\]/g, "_");
  return new NextResponse(object.body as unknown as ReadableStream, {
    headers: {
      "Content-Type": file.content_type || "application/octet-stream",
      "Content-Length": String(object.size),
      "Content-Disposition": `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(file.name)}`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
