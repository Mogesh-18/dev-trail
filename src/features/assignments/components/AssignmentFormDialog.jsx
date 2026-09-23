import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignmentSchema } from "@/schemas/assignment.schema";
import { ResponsiveDialog } from "@/components/common/ResponsiveDialog";
import { StaleEditWarningDialog } from "@/components/common/StaleEditWarningDialog";
import { RichTextEditor } from "@/components/common/RichTextEditor";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const DEFAULT_VALUES = {
    title: "",
    instructions: "",
    requirements: "",
    acceptanceCriteria: "",
    deadline: "",
    estimatedMinutes: "",
    taskIds: [],
};

/**
 * Create/edit assignment dialog. Instructions, Requirements, and
 * Acceptance criteria now use RichTextEditor instead of a plain
 * Textarea — admins can bold/italicize, add headings, bullet lists,
 * quotes, and links. Stored value is sanitized HTML.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {Object|null} props.assignment
 * @param {Array} props.allTasks
 * @param {Array} props.taskLinks
 * @param {(values: Object) => void} props.onSubmit
 * @param {boolean} props.isPending
 * @returns {JSX.Element}
 */
export function AssignmentFormDialog({ open, onOpenChange, assignment, allTasks, taskLinks, onSubmit, isPending }) {
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(assignmentSchema),
        defaultValues: DEFAULT_VALUES,
    });

    const openedUpdatedAtRef = useRef(null);
    const [conflictOpen, setConflictOpen] = useState(false);
    const [pendingValues, setPendingValues] = useState(null);

    useEffect(() => {
        if (!open) return;
        if (assignment) {
            openedUpdatedAtRef.current = assignment.updatedAt ?? null;
            const taskIds = taskLinks.filter((link) => link.assignmentId === assignment.id).map((link) => link.taskId);
            reset({
                title: assignment.title,
                instructions: assignment.instructions ?? "",
                requirements: assignment.requirements ?? "",
                acceptanceCriteria: assignment.acceptanceCriteria ?? "",
                deadline: assignment.deadline ?? "",
                estimatedMinutes: assignment.estimatedMinutes ?? "",
                taskIds,
            });
        } else {
            openedUpdatedAtRef.current = null;
            reset(DEFAULT_VALUES);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: only re-init on open
    }, [open]);

    function handleFormSubmit(values) {
        const isStale =
            assignment && openedUpdatedAtRef.current && assignment.updatedAt && assignment.updatedAt !== openedUpdatedAtRef.current;
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
            <ResponsiveDialog
                open={open}
                onOpenChange={onOpenChange}
                title={assignment ? "Edit assignment" : "Create assignment"}
                contentClassName="sm:max-w-xl"
            >
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" {...register("title")} />
                        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label>Instructions</Label>
                        <Controller
                            control={control}
                            name="instructions"
                            render={({ field }) => (
                                <RichTextEditor value={field.value} onChange={field.onChange} placeholder="What should the student do?" />
                            )}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Requirements</Label>
                        <Controller
                            control={control}
                            name="requirements"
                            render={({ field }) => (
                                <RichTextEditor value={field.value} onChange={field.onChange} placeholder="What must the work include?" minHeight="6rem" />
                            )}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Acceptance criteria</Label>
                        <Controller
                            control={control}
                            name="acceptanceCriteria"
                            render={({ field }) => (
                                <RichTextEditor value={field.value} onChange={field.onChange} placeholder="How will you know it's done?" minHeight="6rem" />
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="deadline">Deadline</Label>
                            <Input id="deadline" type="date" {...register("deadline")} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="estimatedMinutes">Estimated minutes</Label>
                            <Input id="estimatedMinutes" type="number" min="0" {...register("estimatedMinutes")} />
                        </div>
                    </div>

                    {allTasks.length > 0 && (
                        <div className="space-y-1.5">
                            <Label>Linked tasks</Label>
                            <Controller
                                control={control}
                                name="taskIds"
                                render={({ field }) => (
                                    <div className="max-h-32 space-y-1 overflow-y-auto rounded-md border border-border/60 p-2">
                                        {allTasks.map((t) => {
                                            const checked = field.value.includes(t.id);
                                            return (
                                                <label
                                                    key={t.id}
                                                    className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors duration-fast ${checked ? "bg-primary/10" : "hover:bg-muted"}`}
                                                >
                                                    <Checkbox
                                                        checked={checked}
                                                        onCheckedChange={(c) => field.onChange(c ? [...field.value, t.id] : field.value.filter((id) => id !== t.id))}
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

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isPending}>{isPending ? "Saving…" : "Save"}</Button>
                    </DialogFooter>
                </form>
            </ResponsiveDialog>

            <StaleEditWarningDialog open={conflictOpen} onOpenChange={setConflictOpen} onConfirm={handleConfirmOverwrite} />
        </>
    );
}