"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Confetti from "./Confetti";
import WpplBanner from "./WpplBanner";

export default function LogoWithEasterEgg() {
  const [clickCount, setClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  const handleLogoClick = useCallback(() => {
    setClickCount((prev) => {
      const newCount = prev + 1;
      
      if (newCount >= 3) {
        setShowEasterEgg(true);
        setShowBanner(true);
        return 0;
      }
      
      // Reset count after 1 second if not triple clicked
      setTimeout(() => {
        setClickCount(0);
      }, 1000);
      
      return newCount;
    });
  }, []);

  const handleConfettiComplete = useCallback(() => {
    setShowEasterEgg(false);
  }, []);

  const handleBannerComplete = useCallback(() => {
    setShowBanner(false);
  }, []);

  return (
    <>
      <Link href="/" onClick={handleLogoClick}>
        <Image
          src="/logo_BG.png"
          alt="Bobby Bets"
          width={50}
          height={50}
          className="rounded-lg"
        />
        <div>
          <h1
            className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-green-500 bg-clip-text text-transparent"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            BobbyBets
          </h1>
          <p className="text-sm text-gray-600 italic mt-1">
            Your highly legitimate source for all PPL, Segunda and
            Vanarama news.
          </p>
        </div>
      </Link>
      <Confetti active={showEasterEgg} onComplete={handleConfettiComplete} />
      <WpplBanner active={showBanner} onComplete={handleBannerComplete} />
    </>
  );
}
