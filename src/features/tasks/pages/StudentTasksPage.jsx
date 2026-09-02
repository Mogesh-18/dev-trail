import { ListTodo } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadMoreButton } from "@/components/common/LoadMoreButton";
import { StudentTaskCard } from "@/features/tasks/components/StudentTaskCard";
import { useTasks, useTaskDependencies } from "@/features/tasks/hooks/useTasks";
import { useProgress } from "@/features/progress/hooks/useProgress";
import { groupTasksByTab } from "@/features/tasks/utils/group-tasks-by-tab";
import { useRenderWindow } from "@/hooks/use-render-window";

const PAGE_SIZE = 10;

export default function StudentTasksPage() {
    const { data: tasks, isLoading: tasksLoading, isError: tasksError, refetch: refetchTasks } = useTasks();
    const { data: dependencies = [] } = useTaskDependencies();
    const { data: progress = [], isLoading: progressLoading, isError: progressError } = useProgress();

    const { inProgress, completed, upcoming } = groupTasksByTab(tasks ?? [], dependencies, progress);

    // Called unconditionally, before the loading/error returns below — Rules
    // of Hooks — so these run on empty arrays until data loads, which is
    // harmless since useRenderWindow just windows whatever it's given.
    const inProgressWindow = useRenderWindow(inProgress, PAGE_SIZE);
    const completedWindow = useRenderWindow(completed, PAGE_SIZE);
    const upcomingWindow = useRenderWindow(upcoming, PAGE_SIZE);

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
        return (
            <ErrorState description="Couldn't load your tasks. Check your connection and try again." onRetry={refetchTasks} />
        );
    }

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-semibold">Your tasks</h1>
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

                <TabsContent value="upcoming" className="space-y-2">
                    {upcoming.length === 0 ? (
                        <EmptyState icon={ListTodo} title="Nothing upcoming" description="You're all caught up." />
                    ) : (
                        <>
                            {upcomingWindow.visibleItems.map((task) => (
                                <StudentTaskCard key={task.id} task={task} index={upcoming.indexOf(task)} />
                            ))}
                            <LoadMoreButton onClick={upcomingWindow.loadMore} hasMore={upcomingWindow.hasMore} />
                        </>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}