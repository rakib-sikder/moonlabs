import type { Metadata } from "next";
import "./portal.css";

// Base for every portal route (/login, /auth/*, /dashboard/*). Deliberately plain: no
// starfield, smooth scroll or cursor effects from the marketing layout. The signed-in shell
// (top bar + sidebar) lives in dashboard/layout.tsx so /login stays a simple centred card.
export const metadata: Metadata = {
  title: { default: "Client portal", template: "%s · Moonlabs portal" },
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <div className="pt-root">{children}</div>;
}
