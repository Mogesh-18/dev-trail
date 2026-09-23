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
 * Month calendar grid — cells shrunk again (h-7/h-8) and the whole
 * component capped at a fixed narrow width, since it now sits as one
 * column next to a quick-view panel rather than needing to fill the
 * page on its own.
 *
 * @param {Object} props
 * @param {Record<string, Array<{type: string}>>} props.entriesByDate
 * @param {string|null} props.selectedDate
 * @param {(dateKey: string) => void} props.onSelectDate
 * @returns {JSX.Element}
 */
export function ProgressCalendar({ entriesByDate, selectedDate, onSelectDate }) {
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
        <div className="w-full max-w-[280px] rounded-lg border border-border/60 bg-card p-3 shadow-[var(--shadow-sm)]">
            <div className="mb-2 flex items-center justify-between">
                <h2 className="font-mono text-xs font-semibold tracking-tight">{monthLabel}</h2>
                <div className="flex gap-0.5">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => goToMonth(-1)} aria-label="Previous month">
                        <ChevronLeft className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => goToMonth(1)} aria-label="Next month">
                        <ChevronRight className="h-3 w-3" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-0.5 text-center text-[9px] font-medium text-muted-foreground">
                {WEEKDAY_LABELS.map((label, i) => (
                    <div key={i} className="py-0.5">{label}</div>
                ))}
            </div>

            <div className="mt-0.5 grid grid-cols-7 gap-0.5">
                {weeks.flat().map((date, i) => {
                    if (!date) return <div key={i} className="h-7" />;

                    const key = toDateKey(date);
                    const entries = entriesByDate[key] ?? [];
                    const isToday = isSameDay(date, today);
                    const isSelected = key === selectedDate;

                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => onSelectDate(key)}
                            className={cn(
                                "flex h-7 flex-col items-center justify-center gap-0.5 rounded-md text-[11px] transition-all duration-fast ease-spring hover:bg-muted",
                                isToday && !isSelected && "ring-1 ring-primary/50",
                                entries.length > 0 && !isSelected && "bg-primary/5 font-medium hover:bg-primary/10",
                                isSelected && "bg-primary font-medium text-primary-foreground shadow-[var(--shadow-glow-primary)] hover:bg-primary"
                            )}
                        >
                            <span>{date.getDate()}</span>
                            {entries.length > 0 && (
                                <span className="flex gap-0.5">
                                    {entries.slice(0, 3).map((e, idx) => (
                                        <span
                                            key={idx}
                                            className={cn(
                                                "h-1 w-1 rounded-full",
                                                isSelected ? "bg-primary-foreground" : e.type?.includes("COMPLETED") ? "bg-status-completed" : "bg-status-progress"
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