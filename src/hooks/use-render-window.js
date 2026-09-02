import { useState, useMemo } from "react";

/**
 * Windows an already-fetched array for rendering only — used for Tasks
 * (and the student task tabs), where the full list has to be fetched
 * regardless because locking and manual reordering both need the complete
 * graph. This just limits how much of that list gets rendered at once.
 */
export function useRenderWindow(items, pageSize = 10) {
    const [visibleCount, setVisibleCount] = useState(pageSize);
    const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);
    const hasMore = visibleCount < items.length;
    const loadMore = () => setVisibleCount((c) => c + pageSize);
    return { visibleItems, hasMore, loadMore };
}