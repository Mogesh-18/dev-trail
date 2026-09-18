import { QueryClient, QueryClientProvider, MutationCache } from "@tanstack/react-query";
import { useState } from "react";

/**
 * Global rule: after ANY mutation succeeds anywhere in the app,
 * invalidate every active query. This replaces the safety net that
 * RealtimeProvider used to provide (it invalidated on every DB change,
 * which silently covered gaps in individual mutations' own
 * invalidation). Without it, a form that succeeds but doesn't
 * invalidate the exact cache key its list page reads from will show
 * stale data until a manual refresh — which is the bug being reported.
 *
 * This is intentionally broad rather than per-key: fixing this per
 * hook would mean auditing every mutation file individually, several
 * of which (useAssignments.js, useProgress.js) haven't been shared.
 * The cost is a slightly heavier refetch burst right after a save;
 * on an app this size, that's a good trade for correctness.
 *
 * If you'd rather revert to precise per-key invalidation later, remove
 * the `mutationCache` option below and audit each mutation hook's own
 * `onSuccess` to invalidate the exact query key its consumer list uses.
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
                        staleTime: 30_000,
                        refetchOnWindowFocus: false,
                    },
                },
                mutationCache: new MutationCache({
                    onSuccess: (_data, _variables, _context, mutation) => {
                        // Skip invalidation storms for mutations that opt out
                        // (e.g. rapid-fire things like presence, if any remain).
                        if (mutation.options.meta?.skipGlobalInvalidate) return;
                        queryClient.invalidateQueries();
                    },
                }),
            })
    );

    return <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>;
}