import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Impact Market — Inspire", template: "%s | Impact Market" },
  description: "Order from local Bahraini vendors — Impact Market, fast zone-based delivery.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1B2B4B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body className="relative">
        {/* Full-page watermark logo — visible on every page */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none fixed bottom-0 right-0 w-[560px] sm:w-[700px] md:w-[820px] opacity-[0.04] -rotate-12 translate-x-1/4 translate-y-1/4 z-0"
        />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
