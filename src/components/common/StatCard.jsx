
/**
 * A simple card for displaying a statistic (label, value, optional hint).
 * 
 * @param {Object} props
 * @param {string} props.label - Statistic label.
 * @param {string | number} props.value - Statistic value.
 * @param {string} [props.hint] - Additional context (e.g., change percentage).
 * @returns {JSX.Element}
 */
export function StatCard({ label, value, hint }) {
    return (
        <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-semibold">{value}</p>
            {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
    );
}