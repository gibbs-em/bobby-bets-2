import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
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
        className={`${oswald.variable} antialiased bg-[#0d2818] text-[#f0fdf4]`}
      >
        <header className="border-b border-[#374151] bg-[#1a2e1f] sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
          <div className="container mx-auto max-w-6xl px-8 py-4 flex items-center gap-4">
            <Image src="/rob.png" alt="Bobby Bets" width={50} height={50} className="rounded-lg" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#10b981] to-[#fbbf24] bg-clip-text text-transparent">
                Bobby Bets
              </h1>
              <p className="text-sm text-[#9ca3af] italic mt-1">
                Your highly legitimate source for all PPL, Segunda and Vanarama news.
              </p>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
