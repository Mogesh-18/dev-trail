import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function toDateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/**
 * Month calendar grid. Days with activity get a small dot cluster
 * (up to 3 dots, color-coded by activity type) instead of a plain
 * number, so patterns are visible before you even click a date.
 *
 * @param {Object} props
 * @param {Record<string, Array<{type: string}>>} props.entriesByDate - Keyed by "YYYY-MM-DD".
 * @param {(dateKey: string) => void} props.onSelectDate
 * @returns {JSX.Element}
 */
export function ProgressCalendar({ entriesByDate, onSelectDate }) {
    const [viewDate, setViewDate] = useState(() => {
        const d = new Date();
        d.setDate(1);
        return d;
    });

    const today = new Date();

    const weeks = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstOfMonth = new Date(year, month, 1);
        const startOffset = firstOfMonth.getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const cells = [];
        for (let i = 0; i < startOffset; i++) cells.push(null);
        for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
        while (cells.length % 7 !== 0) cells.push(null);

        const rows = [];
        for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
        return rows;
    }, [viewDate]);

    function goToMonth(delta) {
        setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
    }

    const monthLabel = viewDate.toLocaleDateString(undefined, { month: "long", year: "numeric" });

    return (
        <div className="rounded-lg border border-border/60 bg-card p-4 shadow-[var(--shadow-sm)]">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="font-mono text-sm font-semibold tracking-tight">{monthLabel}</h2>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => goToMonth(-1)} aria-label="Previous month">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => goToMonth(1)} aria-label="Next month">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
                {WEEKDAY_LABELS.map((label, i) => (
                    <div key={i} className="py-1">{label}</div>
                ))}
            </div>

            <div className="mt-1 grid grid-cols-7 gap-1">
                {weeks.flat().map((date, i) => {
                    if (!date) return <div key={i} className="aspect-square" />;

                    const key = toDateKey(date);
                    const entries = entriesByDate[key] ?? [];
                    const isToday = isSameDay(date, today);

                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => onSelectDate(key)}
                            className={cn(
                                "flex aspect-square flex-col items-center justify-center gap-1 rounded-lg text-sm transition-all duration-fast ease-spring hover:bg-muted",
                                isToday && "ring-2 ring-primary/50",
                                entries.length > 0 && "bg-primary/5 font-medium hover:bg-primary/10"
                            )}
                        >
                            <span>{date.getDate()}</span>
                            {entries.length > 0 && (
                                <span className="flex gap-0.5">
                                    {entries.slice(0, 3).map((e, idx) => (
                                        <span
                                            key={idx}
                                            className={cn(
                                                "h-1.5 w-1.5 rounded-full",
                                                e.type?.includes("COMPLETED") ? "bg-status-completed" : "bg-status-progress"
                                            )}
                                        />
                                    ))}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}