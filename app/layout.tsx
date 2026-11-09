import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/MotionProvider";
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
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · Automation agency`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} · Automation agency`,
    description: site.description,
    siteName: site.name,
    type: "website",
    url: site.url,
  },
  twitter: { card: "summary_large_image", title: `${site.name} · Automation agency`, description: site.description },
  robots: { index: true, follow: true },
  verification: {
    ...(site.googleVerification ? { google: site.googleVerification } : {}),
    ...(site.bingVerification ? { other: { "msvalidate.01": site.bingVerification } } : {}),
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
        {/* Marketing chrome lives in app/(site)/layout.tsx; the client portal has its own. */}
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
