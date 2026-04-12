"use client";

import { useState, useEffect } from "react";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 800);
    const t2 = setTimeout(() => setVisible(false), 1200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`splash-screen${fading ? " splash-fade-out" : ""}`}>
      <div className="splash-logo">
        PWA<span>.test</span>
      </div>
      <div className="splash-ring" />
    </div>
  );
}
