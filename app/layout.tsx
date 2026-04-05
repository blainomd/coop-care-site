import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

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
      <body className="min-h-full flex flex-col">{children}<Analytics /></body>
    </html>
  );
}
