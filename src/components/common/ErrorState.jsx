import { CompassIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Inline section error. Icon badge now floats gently instead of
 * sitting static, and the retry button gets shadow + press feedback
 * matching the rest of the interactive surfaces.
 *
 * @param {Object} props
 * @param {string} [props.title="Lost the trail"]
 * @param {string} [props.description]
 * @param {() => void} [props.onRetry]
 * @returns {JSX.Element}
 */
export function ErrorState({ title = "Lost the trail", description, onRetry }) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center duration-slow animate-in fade-in zoom-in-95">
            <span className="flex h-12 w-12 animate-float items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <CompassIcon className="h-6 w-6" />
            </span>
            <p className="font-medium">{title}</p>
            {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
            {onRetry && (
                <Button
                    size="sm"
                    variant="outline"
                    className="mt-1 shadow-[var(--shadow-sm)] transition-all duration-fast ease-spring hover:shadow-[var(--shadow-md)] active:scale-95"
                    onClick={onRetry}
                >
                    Try again
                </Button>
            )}
        </div>
    );
}