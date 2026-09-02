import { useInfiniteQuery } from "@tanstack/react-query";

/**
 * Wraps TanStack Query's useInfiniteQuery for "Load more" lists backed by a
 * real server-side cursor. `fetchPage(cursor)` must return
 * { items, nextCursor }, where nextCursor is null once there's nothing left.
 */
export function useCursorPagination({ queryKey, fetchPage, enabled = true }) {
    const query = useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam }) => fetchPage(pageParam),
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled,
    });

    const items = query.data ? query.data.pages.flatMap((page) => page.items) : [];
    return { ...query, items };
}