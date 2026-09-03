import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function that merges class names using `clsx` and `tailwind-merge`.
 * Accepts any number of class names, conditional objects, or arrays.
 * 
 * @param {...any} inputs - Class names or conditional objects.
 * @returns {string} Merged and deduplicated class string.
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
