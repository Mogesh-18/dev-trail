import { Button } from "@/components/ui/button";
import { TrailLoader } from "@/components/common/TrailLoader";

/**
 * Cursor-pagination "Load more" trigger. Swaps its label for the
 * branded TrailLoader while fetching instead of a generic disabled
 * state, so pagination feels like part of the same system as page
 * loads rather than a separate, plainer affordance.
 *
 * @param {Object} props
 * @param {() => void} props.onClick
 * @param {boolean} [props.isLoading]
 * @param {boolean} [props.hasMore=true]
 * @returns {JSX.Element|null}
 */
export function LoadMoreButton({ onClick, isLoading, hasMore = true }) {
    if (!hasMore) return null;

    return (
        <div className="flex justify-center py-4">
            <Button
                variant="outline"
                onClick={onClick}
                disabled={isLoading}
                className="gap-2 transition-all duration-fast ease-spring hover:shadow-[var(--shadow-md)] active:scale-95"
            >
                {isLoading && <TrailLoader size="sm" />}
                {isLoading ? "Loading…" : "Load more"}
            </Button>
        </div>
    );
}