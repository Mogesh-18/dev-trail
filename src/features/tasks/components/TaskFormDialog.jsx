import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookmarkPlus } from "lucide-react";
import { taskSchema } from "@/schemas/task.schema";
import { ResponsiveDialog } from "@/components/common/ResponsiveDialog";
import { StaleEditWarningDialog } from "@/components/common/StaleEditWarningDialog";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useCreateTemplate } from "@/features/tasks/hooks/useTemplates";

/**
 * Default form values for the task creation/editing form.
 * 
 * @type {{
 *   title: string,
 *   description: string,
 *   instructions: string,
 *   priority: 'low'|'medium'|'high',
 *   estimatedMinutes: string,
 *   dueDate: string,
 *   completionCriteria: string,
 *   prerequisiteTaskIds: string[]
 * }}
 */
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

/**
 * Create/edit task dialog. Prerequisite checkboxes highlight on check
 * (matching AssignmentFormDialog's linked-task list), "Save as
 * template" gets a subtler treatment (ghost, no shadow) since it's a
 * secondary action next to Save.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {Object|null} props.task
 * @param {Object|null} [props.prefillFrom]
 * @param {'duplicate'|'template'} [props.prefillKind='duplicate']
 * @param {Array} props.otherTasks
 * @param {Array} props.dependencies
 * @param {(values: Object) => void} props.onSubmit
 * @param {boolean} props.isPending
 * @returns {JSX.Element}
 */
export function TaskFormDialog({ open, onOpenChange, task, prefillFrom, prefillKind = "duplicate", otherTasks, dependencies, onSubmit, isPending }) {
    const {
        register,
        handleSubmit,
        control,
        reset,
        getValues,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(taskSchema),
        defaultValues: DEFAULT_VALUES,
    });

    const createTemplate = useCreateTemplate();
    const openedUpdatedAtRef = useRef(null);
    const [conflictOpen, setConflictOpen] = useState(false);
    const [pendingValues, setPendingValues] = useState(null);

    useEffect(() => {
        if (!open) return;
        if (task) {
            openedUpdatedAtRef.current = task.updatedAt ?? null;
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
        } else if (prefillFrom) {
            openedUpdatedAtRef.current = null;
            reset({
                ...DEFAULT_VALUES,
                title: prefillFrom.title ? (prefillKind === "duplicate" ? `${prefillFrom.title} (copy)` : prefillFrom.title) : "",
                description: prefillFrom.description ?? "",
                instructions: prefillFrom.instructions ?? "",
                priority: prefillFrom.priority ?? "medium",
                estimatedMinutes: prefillFrom.estimatedMinutes ?? "",
                completionCriteria: prefillFrom.completionCriteria ?? "",
            });
        } else {
            openedUpdatedAtRef.current = null;
            reset(DEFAULT_VALUES);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: only re-init on open
    }, [open]);

    function handleSaveAsTemplate() {
        const values = getValues();
        createTemplate.mutate({
            title: values.title,
            description: values.description,
            instructions: values.instructions,
            priority: values.priority,
            estimatedMinutes: values.estimatedMinutes,
            completionCriteria: values.completionCriteria,
        });
    }

    function handleFormSubmit(values) {
        const isStale = task && openedUpdatedAtRef.current && task.updatedAt && task.updatedAt !== openedUpdatedAtRef.current;
        if (isStale) {
            setPendingValues(values);
            setConflictOpen(true);
            return;
        }
        onSubmit(values);
    }

    function handleConfirmOverwrite() {
        setConflictOpen(false);
        if (pendingValues) onSubmit(pendingValues);
        setPendingValues(null);
    }

    return (
        <>
            <ResponsiveDialog open={open} onOpenChange={onOpenChange} title={task ? "Edit task" : "Create task"} contentClassName="sm:max-w-lg">
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
                                    <div className="max-h-32 space-y-1 overflow-y-auto rounded-md border border-border/60 p-2">
                                        {otherTasks.map((t) => {
                                            const checked = field.value.includes(t.id);
                                            return (
                                                <label
                                                    key={t.id}
                                                    className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors duration-fast ${checked ? "bg-primary/10" : "hover:bg-muted"}`}
                                                >
                                                    <Checkbox
                                                        checked={checked}
                                                        onCheckedChange={(c) => {
                                                            field.onChange(c ? [...field.value, t.id] : field.value.filter((id) => id !== t.id));
                                                        }}
                                                    />
                                                    {t.title}
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
                            />
                        </div>
                    )}

                    <DialogFooter className="sm:justify-between">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="gap-2"
                            onClick={handleSaveAsTemplate}
                            disabled={createTemplate.isPending}
                        >
                            <BookmarkPlus className="h-4 w-4" />
                            {createTemplate.isPending ? "Saving…" : "Save as template"}
                        </Button>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Saving…" : "Save"}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </ResponsiveDialog>

            <StaleEditWarningDialog open={conflictOpen} onOpenChange={setConflictOpen} onConfirm={handleConfirmOverwrite} />
        </>
    );
}