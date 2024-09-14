import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import Script from 'next/script'

function CloudflareAnalytics() {
  return (
    <Script
      defer
      src='https://static.cloudflareinsights.com/beacon.min.js'
      data-cf-beacon={`{"token": "4013e57b5e5745d0b0b0507ef5a98a33"}`}
      strategy="afterInteractive"
    />
  )
}
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ASCII Art Alchemist",
  description: "Transform your images into mesmerizing ASCII art with the ASCII Art Alchemist! Convert images or webcam input into stunning ASCII representations in real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <CloudflareAnalytics />
      </body>
    </html>
  );
}
