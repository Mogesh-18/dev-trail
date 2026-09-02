import { useState } from "react";
import { Plus, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog";
import { TaskFormDialog } from "@/features/tasks/components/TaskFormDialog";
import { TaskListItem } from "@/features/tasks/components/TaskListItem";
import {
    useTasks,
    useTaskDependencies,
    useCreateTask,
    useUpdateTask,
    useDeleteTask,
    useReorderTasks,
} from "@/features/tasks/hooks/useTasks";

export default function AdminTasksPage() {
    const { data: tasks, isLoading } = useTasks();
    const { data: dependencies = [] } = useTaskDependencies();
    const createTask = useCreateTask();
    const updateTask = useUpdateTask();
    const deleteTask = useDeleteTask();
    const reorderTasks = useReorderTasks();

    const [formOpen, setFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [deletingTask, setDeletingTask] = useState(null);

    const orderedTasks = tasks ?? [];

    function handleCreate() {
        setEditingTask(null);
        setFormOpen(true);
    }

    function handleEdit(task) {
        setEditingTask(task);
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

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Tasks</h1>
                    <p className="text-muted-foreground">The ordered learning path.</p>
                </div>
                <Button onClick={handleCreate} className="gap-2">
                    <Plus className="h-4 w-4" />
                    New task
                </Button>
            </div>

            {isLoading && (
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            )}

            {!isLoading && orderedTasks.length === 0 && (
                <EmptyState
                    icon={ListTodo}
                    title="No tasks yet"
                    description="Create the first task to start building the learning path."
                    actionLabel="Create task"
                    onAction={handleCreate}
                />
            )}

            {!isLoading && orderedTasks.length > 0 && (
                <div className="space-y-2">
                    {orderedTasks.map((task, index) => (
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
                    ))}
                </div>
            )}

            <TaskFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                task={editingTask}
                otherTasks={orderedTasks.filter((t) => t.id !== editingTask?.id)}
                dependencies={dependencies}
                onSubmit={handleSubmit}
                isPending={createTask.isPending || updateTask.isPending}
            />

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