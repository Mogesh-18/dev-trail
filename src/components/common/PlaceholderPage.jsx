export function PlaceholderPage({ title, description }) {
    return (
        <div className="space-y-2">
            <h1 className="text-2xl font-semibold">{title}</h1>
            {description && <p className="text-muted-foreground">{description}</p>}
        </div>
    );
}