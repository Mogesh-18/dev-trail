import { Button } from "@/components/ui/button";

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