"use client";

import { useRef } from "react";
import { useRubberScroll } from "@/hooks/useRubberScroll";
import { useRubberPress } from "@/hooks/useRubberPress";

interface Props {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper for the app's main scrollable container.
 * - useRubberScroll: elastic bounce when dragging past scroll boundaries
 * - useRubberPress:  springy press feedback on all buttons/interactive elements
 */
export default function AppShell({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useRubberScroll(ref);
  useRubberPress();

  return (
    <div
      ref={ref}
      className={`app-container${className ? ` ${className}` : ""}`}
    >
      {children}
    </div>
  );
}
