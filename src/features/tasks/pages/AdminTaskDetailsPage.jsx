import { useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog";
import { TaskFormDialog } from "@/features/tasks/components/TaskFormDialog";
import { NotesSection } from "@/features/notes/components/NotesSection";
import { useTask, useTasks, useTaskDependencies, useUpdateTask, useDeleteTask } from "@/features/tasks/hooks/useTasks";
import { ROUTES } from "@/constants/routes";

export default function AdminTaskDetailsPage() {
    const { taskId } = useParams({ strict: false });
    const navigate = useNavigate();

    const { data: task, isLoading } = useTask(taskId);
    const { data: allTasks = [] } = useTasks();
    const { data: dependencies = [] } = useTaskDependencies();
    const updateTask = useUpdateTask();
    const deleteTask = useDeleteTask();

    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
    }

    if (!task) return <p className="text-muted-foreground">Task not found.</p>;

    const prerequisiteTitles = dependencies
        .filter((d) => d.taskId === task.id)
        .map((d) => allTasks.find((t) => t.id === d.prerequisiteTaskId)?.title)
        .filter(Boolean);

    function handleUpdate(values) {
        updateTask.mutateAsync({ id: task.id, input: values }).then(() => setEditOpen(false));
    }

    function handleDelete() {
        deleteTask.mutate(task.id, { onSuccess: () => navigate({ to: ROUTES.ADMIN_TASKS }) });
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-semibold">{task.title}</h1>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium capitalize text-muted-foreground">
                        {task.priority} priority
                    </span>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => setEditOpen(true)}>
                        <Pencil className="h-4 w-4" />
                        Edit
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => setDeleteOpen(true)}>
                        <Trash2 className="h-4 w-4" />
                        Delete
                    </Button>
                </div>
            </div>

            {task.description && <p className="text-muted-foreground">{task.description}</p>}

            {task.instructions && (
                <section className="space-y-1">
                    <h2 className="text-sm font-medium text-muted-foreground">Instructions</h2>
                    <p className="whitespace-pre-wrap text-sm">{task.instructions}</p>
                </section>
            )}

            {task.completionCriteria && (
                <section className="space-y-1">
                    <h2 className="text-sm font-medium text-muted-foreground">Completion criteria</h2>
                    <p className="whitespace-pre-wrap text-sm">{task.completionCriteria}</p>
                </section>
            )}

            {prerequisiteTitles.length > 0 && (
                <section className="space-y-1">
                    <h2 className="text-sm font-medium text-muted-foreground">Prerequisites</h2>
                    <ul className="list-inside list-disc text-sm">
                        {prerequisiteTitles.map((title) => (
                            <li key={title}>{title}</li>
                        ))}
                    </ul>
                </section>
            )}

            <section className="space-y-3 rounded-lg border p-4">
                <h2 className="font-medium">Notes</h2>
                <NotesSection contextType="task" contextId={task.id} />
            </section>

            <TaskFormDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                task={task}
                otherTasks={allTasks.filter((t) => t.id !== task.id)}
                dependencies={dependencies}
                onSubmit={handleUpdate}
                isPending={updateTask.isPending}
            />

            <ConfirmDeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Delete this task?"
                description={`"${task.title}" will be permanently removed, along with any dependency links to it.`}
                onConfirm={handleDelete}
                isPending={deleteTask.isPending}
            />
        </div>
    );
}