import { useState, useEffect } from "react";

/**
 * Hook that stores a draggable order in localStorage, with a fallback to a default order.
 * Guards against stale saved orders by filtering missing/extra keys.
 * 
 * @param {string} storageKey - Key for localStorage.
 * @param {string[]} defaultOrder - Default list of keys.
 * @returns {{ order: string[], moveToIndex: (key: string, index: number) => void }}
 */
export function usePersistedOrder(storageKey, defaultOrder) {
    const [order, setOrder] = useState(() => {
        try {
            const stored = window.localStorage.getItem(storageKey);
            if (!stored) return defaultOrder;
            const parsed = JSON.parse(stored);
            // Guard against a stale saved order missing/adding keys since last visit.
            const valid = parsed.filter((k) => defaultOrder.includes(k));
            const missing = defaultOrder.filter((k) => !valid.includes(k));
            return [...valid, ...missing];
        } catch {
            return defaultOrder;
        }
    });

    useEffect(() => {
        window.localStorage.setItem(storageKey, JSON.stringify(order));
    }, [storageKey, order]);

    function moveToIndex(key, index) {
        setOrder((current) => {
            const withoutKey = current.filter((k) => k !== key);
            withoutKey.splice(index, 0, key);
            return withoutKey;
        });
    }

    return { order, moveToIndex };
}