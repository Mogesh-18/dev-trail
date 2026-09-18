import { useMemo, useState } from "react";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { useAssignments } from "@/features/assignments/hooks/useAssignments";
import { useActivity } from "@/features/progress/hooks/useProgress";
import { ProgressCalendar } from "@/features/progress/components/ProgressCalendar";
import { DayProgressDialog } from "@/features/progress/components/DayProgressDialog";

function toDateKey(isoString) {
    const d = new Date(isoString);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Calendar view of progress: pick a date, see everything that
 * happened that day. Built on useActivity(1000) — the largest window
 * the one activity hook I've seen supports — rather than a true
 * date-range query, so extremely old history beyond that count won't
 * show up. Ask for activity.provider.js and I'll swap this for an
 * exact listByRange query.
 *
 * @returns {JSX.Element}
 */
export default function AdminCalendarPage() {
    const { data: tasks = [] } = useTasks();
    const { data: assignments = [] } = useAssignments();
    const { data: activity = [], isLoading } = useActivity(1000);

    const [selectedDate, setSelectedDate] = useState(null);

    const tasksById = useMemo(() => Object.fromEntries(tasks.map((t) => [t.id, t])), [tasks]);
    const assignmentsById = useMemo(() => Object.fromEntries(assignments.map((a) => [a.id, a])), [assignments]);

    const entriesByDate = useMemo(() => {
        const map = {};
        for (const entry of activity) {
            const key = toDateKey(entry.createdAt);
            (map[key] ??= []).push(entry);
        }
        return map;
    }, [activity]);

    return (
        <div className="space-y-6">
            <div className="duration-slow animate-in fade-in slide-in-from-bottom-1">
                <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
                <p className="text-muted-foreground">Pick a date to see what happened that day.</p>
            </div>

            {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
            ) : (
                <ProgressCalendar entriesByDate={entriesByDate} onSelectDate={setSelectedDate} />
            )}

            <DayProgressDialog
                open={!!selectedDate}
                onOpenChange={(open) => !open && setSelectedDate(null)}
                dateKey={selectedDate}
                entries={selectedDate ? entriesByDate[selectedDate] ?? [] : []}
                tasksById={tasksById}
                assignmentsById={assignmentsById}
            />
        </div>
    );
}