import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * A reusable inline error display with an optional retry button.
 * 
 * @param {Object} props
 * @param {string} [props.title="Couldn't load this"] - Error title.
 * @param {string} [props.description] - Error description.
 * @param {() => void} [props.onRetry] - Retry callback.
 * @returns {JSX.Element}
 */
export function ErrorState({ title = "Couldn't load this", description, onRetry }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-16 text-center">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <p className="font-medium">{title}</p>
            {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
            {onRetry && (
                <Button size="sm" variant="outline" className="mt-2" onClick={onRetry}>
                    Try again
                </Button>
            )}
        </div>
    );
}