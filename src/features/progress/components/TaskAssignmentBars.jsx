
/**
 * Horizontal comparison bars for tasks vs. assignments completion —
 * a real visual instead of two more numbers in a stat card, giving
 * the progress page something to actually look at.
 *
 * @param {Object} props
 * @param {{completed: number, total: number}} props.tasks
 * @param {{completed: number, total: number}} props.assignments
 * @returns {JSX.Element}
 */
export function TaskAssignmentBars({ tasks, assignments }) {
    const rows = [
        { label: "Tasks", ...tasks, colorVar: "--primary" },
        { label: "Assignments", ...assignments, colorVar: "--secondary" },
    ];

    return (
        <div className="space-y-4 rounded-lg border border-border/60 bg-card p-4 shadow-[var(--shadow-sm)]">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Completion by type</h3>
            {rows.map((row) => {
                const percent = row.total > 0 ? Math.round((row.completed / row.total) * 100) : 0;
                return (
                    <div key={row.label} className="space-y-1.5">
                        <div className="flex items-baseline justify-between text-sm">
                            <span className="font-medium">{row.label}</span>
                            <span className="font-mono text-xs text-muted-foreground">{row.completed} / {row.total}</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full rounded-full transition-[width] duration-slow ease-trail"
                                style={{ width: `${percent}%`, backgroundColor: `hsl(var(${row.colorVar}))` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}