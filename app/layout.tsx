import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "co-op.care | A web of humanity to thrive via caregiving and community action",
  description:
    "Worker-owned cooperative for aging care. $10/month yoga. $2.50 kombucha. $35/hr caregivers who stay. Community-owned. Boulder, CO.",
  metadataBase: new URL("https://co-op.care"),
  openGraph: {
    title: "co-op.care | Care everywhere.",
    description: "Nobody joins through home care. They join through back pain, cheap kombucha, or a lonely Tuesday. The care is already there when they need it.",
    siteName: "co-op.care",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#4A7C59" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
        <Script id="sw-register" strategy="afterInteractive">{`
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js');
          }
        `}</Script>
        <Script src="https://solvinghealth.com/footer.js" data-brand="co-op.care" data-theme="light" strategy="lazyOnload" />
      </body>
    </html>
  );
}
