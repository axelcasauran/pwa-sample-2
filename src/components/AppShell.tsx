"use client";

import { useRef } from "react";
import { useRubberScroll } from "@/hooks/useRubberScroll";

interface Props {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper for the app's main scrollable container.
 * Applies the rubber-band scroll effect via useRubberScroll.
 */
export default function AppShell({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useRubberScroll(ref);

  return (
    <div
      ref={ref}
      className={`app-container${className ? ` ${className}` : ""}`}
    >
      {children}
    </div>
  );
}
