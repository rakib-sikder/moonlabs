import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/MotionProvider";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { BackgroundFX } from "@/components/fx/BackgroundFX";
import { CometCursor } from "@/components/fx/CometCursor";
import { SmoothScroll } from "@/components/fx/SmoothScroll";
import { site } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Automation agency`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — Automation agency`,
    description: site.description,
    siteName: site.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>
        <MotionProvider>
          <BackgroundFX />
          <SmoothScroll />
          <CometCursor />
          <ScrollProgress />
          <Nav />
          <main className="relative text-foreground">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
