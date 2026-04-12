import { useEffect } from "react";

// Selectors that should receive the rubber press effect
const INTERACTIVE =
  ".btn, .nav-card, .back-btn, .record-delete, .record-edit, .modal-backdrop > .modal-content button";

/**
 * Attaches a rubber-band press effect to all interactive elements via event
 * delegation on the document.
 *
 * - touchstart : scales the element down (press)
 * - touchend   : springs back to 1 with a slight overshoot (elastic release)
 *
 * The cubic-bezier(0.34, 1.56, 0.64, 1) spring curve overshoots scale 1.0,
 * producing the rubbery bounce feel. Works on Android and desktop; iOS has
 * native bounce already so it complements without conflicting.
 */
export function useRubberPress() {
  useEffect(() => {
    let activeEl: HTMLElement | null = null;

    const onStart = (e: TouchEvent) => {
      const target = (e.target as Element).closest(INTERACTIVE) as HTMLElement | null;
      if (!target) return;
      activeEl = target;
      // Snap down instantly — press feels immediate
      target.style.transition = "transform 0.08s ease";
      target.style.transform = "scale(0.93)";
    };

    const onEnd = () => {
      if (!activeEl) return;
      const el = activeEl;
      activeEl = null;
      // Spring back with overshoot — the y1=1.56 control point exceeds 1.0
      // which makes the element briefly "bounce" past its natural size
      el.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
      el.style.transform = "scale(1)";
    };

    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchend", onEnd, { passive: true });
    document.addEventListener("touchcancel", onEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchend", onEnd);
      document.removeEventListener("touchcancel", onEnd);
    };
  }, []);
}
