import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Shared TanStack Query client instance with default options.
 * Queries stay fresh for 30s and retry once on failure.
 * 
 * @type {QueryClient}
 */
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            retry: 1,
        },
    },
});

/**
 * React provider for TanStack Query that configures a shared `QueryClient`.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components that will have query client access.
 * @returns {React.ReactNode} The provider's children.
 */
export function QueryProvider({ children }) {
    return <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>;
}