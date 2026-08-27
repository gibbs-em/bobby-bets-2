"use client";

import { useEffect, useState } from "react";

interface WpplBannerProps {
  active: boolean;
  onComplete?: () => void;
}

export default function WpplBanner({ active, onComplete }: WpplBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[10000] pointer-events-none p-4 md:p-8">
      <div className="bg-pink-500 text-white px-6 py-4 md:px-8 md:py-6 rounded-lg shadow-2xl animate-bounce-in text-center">
        <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-wider uppercase">
          THE WPPL WOZ ERE
        </h1>
      </div>
      <style jsx global>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0) rotate(-10deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) rotate(5deg);
            opacity: 1;
          }
          70% {
            transform: scale(0.95) rotate(-2deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
