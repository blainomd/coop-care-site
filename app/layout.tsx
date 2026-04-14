import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "co-op.care | The app that comes with a caregiver.",
  description:
    "Worker-owned home care cooperative in Boulder, CO. $59/month membership. Physician-supervised AI. HSA/FSA eligible via LMN. Caregivers who stay because they own it.",
  metadataBase: new URL("https://co-op.care"),
  openGraph: {
    title: "co-op.care | The app that comes with a caregiver.",
    description:
      "Talk to Sage. Get assessed. Get your LMN. Meet your caregiver. $59/month. HSA/FSA eligible. Worker-owned cooperative — Boulder, CO.",
    siteName: "co-op.care",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#4A7C59" />
      </head>
      <body className="min-h-full flex flex-col font-[var(--font-inter)]">
        {children}
        <Analytics />
        <Script id="sw-register" strategy="afterInteractive">{`
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js');
          }
        `}</Script>
        <Script src="https://harnesshealth.ai/footer.js?v=8" data-brand="co-op.care" data-theme="light" strategy="lazyOnload" />
      </body>
    </html>
  );
}
