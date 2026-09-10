import { Button } from "@/components/ui/button";

/**
 * Empty list placeholder. Icon badge floats; action button matches
 * ErrorState's shadow/press treatment for consistency.
 *
 * @param {Object} props
 * @param {React.ComponentType} [props.icon]
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {string} [props.actionLabel]
 * @param {() => void} [props.onAction]
 * @returns {JSX.Element}
 */
export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center duration-base animate-in fade-in slide-in-from-bottom-1">
            <span className="flex h-12 w-12 animate-float items-center justify-center rounded-full bg-primary/10 text-primary">
                {Icon ? <Icon className="h-5 w-5" /> : <span className="h-2 w-2 rounded-full bg-primary" />}
            </span>
            <p className="font-medium">{title}</p>
            {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
            {actionLabel && onAction && (
                <Button
                    size="sm"
                    className="mt-1 shadow-[var(--shadow-sm)] transition-all duration-fast ease-spring hover:shadow-[var(--shadow-md)] active:scale-95"
                    onClick={onAction}
                >
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}