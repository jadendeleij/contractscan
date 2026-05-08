"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    if (pathname === prevPathRef.current) return;
    prevPathRef.current = pathname;

    // Clear any running animation
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Start progress
    setProgress(0);
    setVisible(true);

    let current = 0;
    intervalRef.current = setInterval(() => {
      current += Math.random() * 15;
      if (current >= 90) {
        current = 90;
        clearInterval(intervalRef.current!);
      }
      setProgress(current);
    }, 80);

    // Complete quickly once route changed
    timerRef.current = setTimeout(() => {
      clearInterval(intervalRef.current!);
      setProgress(100);
      timerRef.current = setTimeout(() => setVisible(false), 300);
    }, 400);

    return () => {
      clearTimeout(timerRef.current!);
      clearInterval(intervalRef.current!);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 z-[9999] h-[3px] bg-blue-500 transition-all duration-200 ease-out"
      style={{
        width: `${progress}%`,
        opacity: progress === 100 ? 0 : 1,
        transition: progress === 100
          ? "width 150ms ease-out, opacity 300ms ease-out"
          : "width 200ms ease-out",
      }}
    />
  );
}
