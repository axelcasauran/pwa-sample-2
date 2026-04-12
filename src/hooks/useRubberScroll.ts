import { RefObject, useEffect } from "react";

/**
 * Adds a rubber-band / elastic scroll effect to a scrollable container.
 * When the user pulls past the top or bottom boundary, the container
 * follows with a dampened translation and then springs back on release.
 * Works on Android, desktop, and augments iOS (which has native bounce).
 */
export function useRubberScroll(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let startY = 0;
    let translate = 0;
    // Damping factor — 0.35 feels close to iOS (35% of drag distance)
    const RESISTANCE = 0.35;
    // Spring-back easing — matches iOS elastic curve
    const SPRING_EASING = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      // Remove transition so the element tracks finger instantly
      el.style.transition = "none";
    };

    const onTouchMove = (e: TouchEvent) => {
      const dy = e.touches[0].clientY - startY;
      const atTop = el.scrollTop <= 0;
      // Small -1 tolerance for sub-pixel rounding
      const atBottom = el.scrollTop >= el.scrollHeight - el.clientHeight - 1;

      if ((atTop && dy > 0) || (atBottom && dy < 0)) {
        translate = dy * RESISTANCE;
        el.style.transform = `translateY(${translate}px)`;
      }
    };

    const onTouchEnd = () => {
      if (translate !== 0) {
        el.style.transition = `transform 0.45s ${SPRING_EASING}`;
        el.style.transform = "translateY(0)";
        translate = 0;
      }
      startY = 0;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [ref]);
}
