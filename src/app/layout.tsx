import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import SiteNav from "@/components/SiteNav";
import LogoWithEasterEgg from "@/components/LogoWithEasterEgg";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

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
  title: "Bobby Bets",
  description:
    "Your unofficial source for all PPL, Segunda and Vanarama news.",
  icons: {
    icon: "/logo_noBG.png",
  },
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
            <LogoWithEasterEgg />
          </div>
          <SiteNav />
        </header>
        {children}
      </body>
      <Analytics />
    </html>
  );
}
