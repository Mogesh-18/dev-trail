import { useEffect, useRef, useState } from "react";

/**
 * Animates a number counting up to `value`. Non-numeric values (already
 * formatted strings like "72%" or "5 / 12") pass through untouched with
 * no animation — StatCard callers can supply either.
 *
 * @param {number|string} value
 * @param {number} [duration=700]
 * @returns {number|string}
 */
export function useCountUp(value, duration = 700) {
    const isNumeric = typeof value === "number";
    const [display, setDisplay] = useState(value);
    const fromRef = useRef(isNumeric ? value : 0);
    const frameRef = useRef(null);

    useEffect(() => {
        if (!isNumeric) {
            setDisplay(value);
            return undefined;
        }
        const from = fromRef.current;
        const delta = value - from;
        if (delta === 0) return undefined;

        const start = performance.now();
        const tick = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            setDisplay(Math.round(from + delta * eased));
            if (t < 1) {
                frameRef.current = requestAnimationFrame(tick);
            } else {
                fromRef.current = value;
            }
        };
        frameRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frameRef.current);
    }, [value, duration, isNumeric]);

    return display;
}