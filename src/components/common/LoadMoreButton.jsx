import { Button } from "@/components/ui/button";

/**
 * A "Load more" button that appears only if more data is available.
 * 
 * @param {Object} props
 * @param {() => void} props.onClick - Handler to load more items.
 * @param {boolean} props.hasMore - Whether additional items exist.
 * @param {boolean} [props.isLoading=false] - Whether a load is in progress.
 * @returns {JSX.Element | null} Returns null if `hasMore` is false.
 */
export function LoadMoreButton({ onClick, hasMore, isLoading = false }) {
    if (!hasMore) return null;
    return (
        <div className="flex justify-center pt-2">
            <Button variant="outline" size="sm" onClick={onClick} disabled={isLoading}>
                {isLoading ? "Loading…" : "Load more"}
            </Button>
        </div>
    );
}