import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import Image from "next/image";
import SiteNav from "@/components/SiteNav";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bobby Bets - Fantasy Football League Standings",
  description: "Track your fantasy football league standings and compete with friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${oswald.variable} antialiased bg-white text-gray-900`}
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        <header className="border-b border-gray-200 bg-white sticky top-0 z-50 backdrop-blur-sm bg-opacity-95 shadow-sm">
          <div className="container mx-auto max-w-6xl px-8 py-4 flex items-center gap-4">
            <Image src="/logo_BG.png" alt="Bobby Bets" width={50} height={50} className="rounded-lg" />
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-purple-500 to-green-500 bg-clip-text text-transparent" style={{ fontFamily: "var(--font-oswald)" }}>
                BobbyBets
              </h1>
              <p className="text-sm text-gray-600 italic mt-1">
                Your highly legitimate source for all PPL, Segunda and Vanarama news.
              </p>
            </div>
          </div>
          <SiteNav />
        </header>
        {children}
      </body>
      <Analytics />
    </html>
  );
}
