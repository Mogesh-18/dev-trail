import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

/**
 * Plain TanStack Query setup — no global mutation-triggered
 * invalidation. The earlier version invalidated every active query
 * after any mutation succeeded anywhere in the app, which is what was
 * causing pages to reload/reshow loading state when navigating around
 * shortly after saving something unrelated. That behavior is removed
 * entirely now, per explicit request.
 *
 * refetchOnWindowFocus and refetchOnReconnect are both off, so
 * switching browser tabs or the OS briefly dropping network never
 * triggers a refetch either — the only things that refresh a query now
 * are: its own mutation's explicit onSuccess invalidation (each
 * mutation hook, e.g. useCreateTask, already does this individually),
 * a manual refetch() call, or actually revisiting the page after its
 * staleTime has elapsed.
 *
 * If a specific save still doesn't show up without a manual refresh,
 * that means that one mutation hook's own onSuccess isn't invalidating
 * the right query key — tell me which page/action and I'll fix that
 * one hook precisely, rather than reaching for a global rule again.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export function QueryProvider({ children }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60_000,
                        refetchOnWindowFocus: false,
                        refetchOnReconnect: false,
                    },
                },
            })
    );

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}