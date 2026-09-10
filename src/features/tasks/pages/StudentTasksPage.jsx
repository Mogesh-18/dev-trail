import { ListTodo, Lock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadMoreButton } from "@/components/common/LoadMoreButton";
import { StudentTaskCard } from "@/features/tasks/components/StudentTaskCard";
import { useTasks, useTaskDependencies } from "@/features/tasks/hooks/useTasks";
import { useProgress } from "@/features/progress/hooks/useProgress";
import { groupTasksByTab } from "@/features/tasks/utils/group-tasks-by-tab";
import { getBlockingReasons } from "@/features/tasks/utils/get-blocking-reasons";
import { useRenderWindow } from "@/hooks/use-render-window";

/**
 * Page size
 */
const PAGE_SIZE = 10;

/**
 * Student task list. Blocked-task rows get the same floating-lock
 * treatment as other "waiting" states in the app (StudentTaskDetailsPage's
 * locked banner) instead of a differently-styled dashed box.
 *
 * @returns {JSX.Element}
 */
export default function StudentTasksPage() {
    const { data: tasks, isLoading: tasksLoading, isError: tasksError, refetch: refetchTasks } = useTasks();
    const { data: dependencies = [] } = useTaskDependencies();
    const { data: progress = [], isLoading: progressLoading, isError: progressError } = useProgress();

    const { inProgress, completed, upcoming } = groupTasksByTab(tasks ?? [], dependencies, progress);
    const available = upcoming.filter((t) => t.derivedStatus === "available");
    const blocked = upcoming.filter((t) => t.derivedStatus === "locked");

    const inProgressWindow = useRenderWindow(inProgress, PAGE_SIZE);
    const completedWindow = useRenderWindow(completed, PAGE_SIZE);
    const availableWindow = useRenderWindow(available, PAGE_SIZE);
    const blockedWindow = useRenderWindow(blocked, PAGE_SIZE);

    const isLoading = tasksLoading || progressLoading;
    const isError = tasksError || progressError;

    if (isLoading) {
        return (
            <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                ))}
            </div>
        );
    }

    if (isError) {
        return <ErrorState description="Couldn't load your tasks. Check your connection and try again." onRetry={refetchTasks} />;
    }

    const progressByTaskId = Object.fromEntries(progress.map((p) => [p.taskId, p]));

    return (
        <div className="space-y-4">
            <div className="duration-slow animate-in fade-in slide-in-from-bottom-1">
                <h1 className="text-2xl font-semibold tracking-tight">Your tasks</h1>
                <p className="text-muted-foreground">Work through them in order.</p>
            </div>

            <Tabs defaultValue="in-progress">
                <TabsList>
                    <TabsTrigger value="in-progress">In Progress ({inProgress.length})</TabsTrigger>
                    <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="in-progress" className="space-y-2">
                    {inProgress.length === 0 ? (
                        <EmptyState icon={ListTodo} title="Nothing in progress" description="Start a task from Upcoming to see it here." />
                    ) : (
                        <>
                            {inProgressWindow.visibleItems.map((task) => (
                                <StudentTaskCard key={task.id} task={task} index={inProgress.indexOf(task)} />
                            ))}
                            <LoadMoreButton onClick={inProgressWindow.loadMore} hasMore={inProgressWindow.hasMore} />
                        </>
                    )}
                </TabsContent>

                <TabsContent value="completed" className="space-y-2">
                    {completed.length === 0 ? (
                        <EmptyState icon={ListTodo} title="No completed tasks yet" description="Finished tasks will show up here." />
                    ) : (
                        <>
                            {completedWindow.visibleItems.map((task) => (
                                <StudentTaskCard key={task.id} task={task} index={completed.indexOf(task)} />
                            ))}
                            <LoadMoreButton onClick={completedWindow.loadMore} hasMore={completedWindow.hasMore} />
                        </>
                    )}
                </TabsContent>

                <TabsContent value="upcoming" className="space-y-4">
                    {upcoming.length === 0 ? (
                        <EmptyState icon={ListTodo} title="Nothing upcoming" description="You're all caught up." />
                    ) : (
                        <>
                            {available.length > 0 && (
                                <div className="space-y-2">
                                    <h2 className="text-sm font-medium text-muted-foreground">Available now</h2>
                                    {availableWindow.visibleItems.map((task) => (
                                        <StudentTaskCard key={task.id} task={task} index={available.indexOf(task)} />
                                    ))}
                                    <LoadMoreButton onClick={availableWindow.loadMore} hasMore={availableWindow.hasMore} />
                                </div>
                            )}

                            {blocked.length > 0 && (
                                <div className="space-y-2">
                                    <h2 className="text-sm font-medium text-muted-foreground">Blocked — what's in the way</h2>
                                    {blockedWindow.visibleItems.map((task) => {
                                        const reasons = getBlockingReasons(task, dependencies, tasks ?? [], progressByTaskId);
                                        return (
                                            <div
                                                key={task.id}
                                                className="flex items-start gap-3 rounded-lg border border-status-locked/30 bg-status-locked/5 p-3 opacity-80 transition-opacity duration-base hover:opacity-100"
                                            >
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-status-locked/15 text-status-locked">
                                                    <Lock className="h-4 w-4" />
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium">{task.title}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Waiting on: {reasons.length > 0 ? reasons.join(", ") : "an earlier task"}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <LoadMoreButton onClick={blockedWindow.loadMore} hasMore={blockedWindow.hasMore} />
                                </div>
                            )}
                        </>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}