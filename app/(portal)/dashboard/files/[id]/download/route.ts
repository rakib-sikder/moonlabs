import { NextResponse, type NextRequest } from "next/server";
import { DELIVERABLES_BUCKET, isPortalConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/portal/validate";

/**
 * Signs a 5-minute download URL for a deliverable and redirects to it. Both the `files`
 * row and the storage object are protected by RLS, so this only works for members of the
 * file's organization.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isPortalConfigured()) return NextResponse.redirect(new URL("/login", request.url));
  if (!isUuid(id)) return new NextResponse("Not found", { status: 404 });

  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) return NextResponse.redirect(new URL("/login", request.url));

  const { data: file } = await supabase.from("files").select("name, storage_path").eq("id", id).maybeSingle();
  if (!file) return new NextResponse("Not found", { status: 404 });

  const { data, error } = await supabase.storage
    .from(DELIVERABLES_BUCKET)
    .createSignedUrl(file.storage_path as string, 300, { download: file.name as string });
  if (error || !data?.signedUrl) return new NextResponse("File unavailable", { status: 404 });

  return NextResponse.redirect(data.signedUrl);
}
