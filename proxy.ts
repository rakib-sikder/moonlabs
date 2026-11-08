import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Client portal only: keeps the Supabase session fresh and sends signed-out visitors from
// /dashboard to /login. Marketing routes never hit this (see matcher). Without Supabase env
// vars it is a pass-through.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/login"],
};
