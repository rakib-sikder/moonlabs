// Who is signed in, for the marketing site's nav (its pages are static, so they ask here).
// Calling getSessionUser() from a route handler also refreshes the session cookie.
import { getSessionUser } from "@/lib/portal/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  const body = user ? { user: { name: user.name, email: user.email, isStaff: user.isStaff } } : { user: null };
  return Response.json(body, { headers: { "Cache-Control": "private, no-store" } });
}
