import { Button } from "@/components/ui/button";

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-16 text-center">
            {Icon && <Icon className="h-8 w-8 text-muted-foreground" />}
            <p className="font-medium">{title}</p>
            {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
            {actionLabel && onAction && (
                <Button size="sm" className="mt-2" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}