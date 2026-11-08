import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { BackgroundFX } from "@/components/fx/BackgroundFX";
import { CometCursor } from "@/components/fx/CometCursor";
import { SmoothScroll } from "@/components/fx/SmoothScroll";

/** Marketing site chrome: animated background, smooth scroll, nav and footer. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BackgroundFX />
      <SmoothScroll />
      <CometCursor />
      <ScrollProgress />
      <Nav />
      <main className="relative text-foreground">{children}</main>
      <Footer />
    </>
  );
}
