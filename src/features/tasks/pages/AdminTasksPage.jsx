import { useState } from "react";
import { Plus, ListTodo, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadMoreButton } from "@/components/common/LoadMoreButton";
import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog";
import { TaskFormDialog } from "@/features/tasks/components/TaskFormDialog";
import { TaskListItem } from "@/features/tasks/components/TaskListItem";
import { useRenderWindow } from "@/hooks/use-render-window";
import {
    useTasks, useTaskDependencies, useCreateTask, useUpdateTask, useDeleteTask, useReorderTasks,
} from "@/features/tasks/hooks/useTasks";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";

/**
 * Page size
 */
const PAGE_SIZE = 10;

/**
 * Admin list view for all tasks with create, edit, delete, reorder, and pagination.
 * 
 * @returns {JSX.Element}
 */
export default function AdminTasksPage() {
    const { data: tasks, isLoading, isError, refetch } = useTasks();
    const { data: dependencies = [] } = useTaskDependencies();
    const createTask = useCreateTask();
    const updateTask = useUpdateTask();
    const deleteTask = useDeleteTask();
    const reorderTasks = useReorderTasks();

    const [formOpen, setFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [prefillFrom, setPrefillFrom] = useState(null);
    const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
    const [deletingTask, setDeletingTask] = useState(null);
    const [prefillKind, setPrefillKind] = useState("duplicate");

    const orderedTasks = tasks ?? [];
    const { visibleItems, hasMore, loadMore } = useRenderWindow(orderedTasks, PAGE_SIZE);

    const lastCreatedTask = [...orderedTasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    function handleCreate() {
        setEditingTask(null);
        setPrefillFrom(null);
        setFormOpen(true);
    }

    function handleCopyLast() {
        if (!lastCreatedTask) return;
        setEditingTask(null);
        setPrefillFrom(lastCreatedTask);
        setPrefillKind("duplicate");
        setFormOpen(true);
    }

    function handlePickTemplate(template) {
        setEditingTask(null);
        setPrefillFrom(template);
        setPrefillKind("template");
        setFormOpen(true);
    }


    function handleEdit(task) {
        setEditingTask(task);
        setPrefillFrom(null);
        setFormOpen(true);
    }

    function handleSubmit(values) {
        const promise = editingTask
            ? updateTask.mutateAsync({ id: editingTask.id, input: values })
            : createTask.mutateAsync(values);
        promise.then(() => setFormOpen(false));
    }

    function handleMoveUp(task) {
        const index = orderedTasks.findIndex((t) => t.id === task.id);
        if (index <= 0) return;
        const next = [...orderedTasks];
        [next[index - 1], next[index]] = [next[index], next[index - 1]];
        reorderTasks.mutate(next.map((t) => t.id));
    }

    function handleMoveDown(task) {
        const index = orderedTasks.findIndex((t) => t.id === task.id);
        if (index === -1 || index >= orderedTasks.length - 1) return;
        const next = [...orderedTasks];
        [next[index + 1], next[index]] = [next[index], next[index + 1]];
        reorderTasks.mutate(next.map((t) => t.id));
    }

    function handleConfirmDelete() {
        if (!deletingTask) return;
        deleteTask.mutate(deletingTask.id, { onSuccess: () => setDeletingTask(null) });
    }

    useKeyboardShortcut({ key: "n" }, handleCreate);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h1 className="text-2xl font-semibold">Tasks</h1>
                    <p className="text-muted-foreground">The ordered learning path.</p>
                </div>
                <div className="flex gap-2">
                    {lastCreatedTask && (
                        <Button variant="outline" size="sm" className="gap-2" onClick={handleCopyLast}>
                            <Copy className="h-4 w-4" />
                            Copy last task
                        </Button>
                    )}
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => setTemplatePickerOpen(true)}>
                        <LayoutTemplate className="h-4 w-4" />
                        From template
                    </Button>
                    <Button onClick={handleCreate} size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        New task
                    </Button>
                </div>
            </div>

            {isLoading && (
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            )}

            {isError && (
                <ErrorState description="Couldn't load tasks. Check your connection and try again." onRetry={refetch} />
            )}

            {!isLoading && !isError && orderedTasks.length === 0 && (
                <EmptyState
                    icon={ListTodo}
                    title="No tasks yet"
                    description="Create the first task to start building the learning path."
                    actionLabel="Create task"
                    onAction={handleCreate}
                />
            )}

            {!isLoading && !isError && orderedTasks.length > 0 && (
                <div className="space-y-2">
                    {visibleItems.map((task) => {
                        const index = orderedTasks.findIndex((t) => t.id === task.id);
                        return (
                            <TaskListItem
                                key={task.id}
                                task={task}
                                index={index}
                                total={orderedTasks.length}
                                prerequisiteCount={dependencies.filter((d) => d.taskId === task.id).length}
                                onMoveUp={handleMoveUp}
                                onMoveDown={handleMoveDown}
                                onEdit={handleEdit}
                                onDelete={setDeletingTask}
                            />
                        );
                    })}
                    <LoadMoreButton onClick={loadMore} hasMore={hasMore} />
                </div>
            )}

            <TaskFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                task={editingTask}
                prefillFrom={prefillFrom}
                prefillKind={prefillKind}
                otherTasks={orderedTasks.filter((t) => t.id !== editingTask?.id)}
                dependencies={dependencies}
                onSubmit={handleSubmit}
                isPending={createTask.isPending || updateTask.isPending}
            />

            <TemplatePickerDialog open={templatePickerOpen} onOpenChange={setTemplatePickerOpen} onPick={handlePickTemplate} />

            <ConfirmDeleteDialog
                open={!!deletingTask}
                onOpenChange={(open) => !open && setDeletingTask(null)}
                title="Delete this task?"
                description={`"${deletingTask?.title}" will be permanently removed, along with any dependency links to it.`}
                onConfirm={handleConfirmDelete}
                isPending={deleteTask.isPending}
            />
        </div>
    );
}