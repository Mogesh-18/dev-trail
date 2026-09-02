import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema } from "@/schemas/task.schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const DEFAULT_VALUES = {
    title: "",
    description: "",
    instructions: "",
    priority: "medium",
    estimatedMinutes: "",
    dueDate: "",
    completionCriteria: "",
    prerequisiteTaskIds: [],
};

export function TaskFormDialog({ open, onOpenChange, task, otherTasks, dependencies, onSubmit, isPending }) {
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(taskSchema),
        defaultValues: DEFAULT_VALUES,
    });

    useEffect(() => {
        if (!open) return;
        if (task) {
            const prerequisiteTaskIds = dependencies
                .filter((dep) => dep.taskId === task.id)
                .map((dep) => dep.prerequisiteTaskId);
            reset({
                title: task.title,
                description: task.description ?? "",
                instructions: task.instructions ?? "",
                priority: task.priority,
                estimatedMinutes: task.estimatedMinutes ?? "",
                dueDate: task.dueDate ?? "",
                completionCriteria: task.completionCriteria ?? "",
                prerequisiteTaskIds,
            });
        } else {
            reset(DEFAULT_VALUES);
        }
    }, [open, task, dependencies, reset]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{task ? "Edit task" : "Create task"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" {...register("title")} />
                        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" rows={2} {...register("description")} />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="instructions">Instructions</Label>
                        <Textarea id="instructions" rows={3} {...register("instructions")} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>Priority</Label>
                            <Controller
                                control={control}
                                name="priority"
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="estimatedMinutes">Estimated minutes</Label>
                            <Input id="estimatedMinutes" type="number" min="0" {...register("estimatedMinutes")} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="completionCriteria">Completion criteria</Label>
                        <Textarea id="completionCriteria" rows={2} {...register("completionCriteria")} />
                    </div>

                    {otherTasks.length > 0 && (
                        <div className="space-y-1.5">
                            <Label>Prerequisite tasks</Label>
                            <Controller
                                control={control}
                                name="prerequisiteTaskIds"
                                render={({ field }) => (
                                    <div className="max-h-32 space-y-2 overflow-y-auto rounded-md border p-2">
                                        {otherTasks.map((t) => (
                                            <label key={t.id} className="flex items-center gap-2 text-sm">
                                                <Checkbox
                                                    checked={field.value.includes(t.id)}
                                                    onCheckedChange={(checked) => {
                                                        field.onChange(
                                                            checked ? [...field.value, t.id] : field.value.filter((id) => id !== t.id)
                                                        );
                                                    }}
                                                />
                                                {t.title}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            />
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Saving…" : "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}