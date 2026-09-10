import { useState } from "react";
import { Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadMoreButton } from "@/components/common/LoadMoreButton";
import { EmptyState } from "@/components/common/EmptyState";
import { TrailLoader } from "@/components/common/TrailLoader";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useReports, useAddReport, useDeleteReport } from "@/features/reports/hooks/useReports";
import { formatRelativeTime } from "@/utils/format-date";
import { canManageOwned } from "@/utils/can-manage-owned";

/**
 * Task report log — append-only entries lift on hover like every other
 * card list, loading uses the branded TrailLoader.
 *
 * @param {Object} props
 * @param {string} props.taskId
 * @param {'student'|'admin'} [props.mode='student']
 * @returns {JSX.Element}
 */
export function ReportsSection({ taskId, mode = "student" }) {
    const { user, role } = useAuth();
    const { items: reports, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useReports(taskId);
    const addReport = useAddReport(taskId);
    const deleteReport = useDeleteReport(taskId);

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        if (!body.trim()) return;
        addReport.mutate(
            { title: title.trim(), body: body.trim() },
            { onSuccess: () => { setTitle(""); setBody(""); } }
        );
    }

    return (
        <div className="space-y-3">
            {isLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrailLoader size="sm" />
                    Loading reports…
                </div>
            )}

            {!isLoading && reports.length === 0 && (
                <EmptyState
                    icon={FileText}
                    title="No reports yet"
                    description={mode === "student" ? "Add a report below to log your progress on this task." : "The student hasn't added any reports for this task yet."}
                />
            )}

            {reports.length > 0 && (
                <ul className="space-y-2">
                    {reports.map((report, i) => (
                        <li
                            key={report.id}
                            style={{ animationDelay: `${i * 40}ms` }}
                            className="rounded-md border border-border/60 bg-card p-3 text-sm shadow-[var(--shadow-sm)] transition-all duration-base ease-trail duration-base animate-in fade-in slide-in-from-bottom-1 fill-mode-both hover:shadow-[var(--shadow-md)]"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    {report.title && <p className="font-medium">{report.title}</p>}
                                    <p className="whitespace-pre-wrap text-muted-foreground">{report.body}</p>
                                </div>
                                {canManageOwned(report.studentId, { role, userId: user?.id }) && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
                                        onClick={() => deleteReport.mutate(report.id)}
                                        aria-label="Delete report"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                )}
                            </div>
                            <p className="mt-1 font-mono text-xs text-muted-foreground">{formatRelativeTime(report.createdAt)}</p>
                        </li>
                    ))}
                </ul>
            )}

            <LoadMoreButton onClick={fetchNextPage} isLoading={isFetchingNextPage} hasMore={!!hasNextPage} />

            {mode === "student" && (
                <form onSubmit={handleSubmit} className="space-y-2 rounded-md border border-border/60 bg-card p-3">
                    <Input placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <Textarea rows={3} placeholder="What did you work on?" value={body} onChange={(e) => setBody(e.target.value)} />
                    <Button type="submit" size="sm" disabled={addReport.isPending}>
                        {addReport.isPending ? "Adding…" : "Add report"}
                    </Button>
                </form>
            )}
        </div>
    );
}