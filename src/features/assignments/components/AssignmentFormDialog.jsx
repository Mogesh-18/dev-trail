import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignmentSchema } from "@/schemas/assignment.schema";
import { ResponsiveDialog } from "@/components/common/ResponsiveDialog";
import { StaleEditWarningDialog } from "@/components/common/StaleEditWarningDialog";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

/**
 * Default form values for the assignment creation/editing form.
 * 
 * @type {{
 *   title: string,
 *   instructions: string,
 *   requirements: string,
 *   acceptanceCriteria: string,
 *   deadline: string,
 *   estimatedMinutes: string,
 *   taskIds: string[]
 * }}
 */
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
 * Create/edit assignment dialog. Linked-task checkboxes now highlight
 * on check instead of just toggling a checkbox with no surrounding
 * feedback, and the form fields all inherit the shared input focus
 * treatment (see input.jsx) rather than a flat default border.
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
            const taskIds = taskLinks.filter((link) => link.assignmentId === assignment.id)
                .map((link) => link.taskId);
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
                contentClassName="sm:max-w-lg"
            >
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" {...register("title")} />
                        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="instructions">Instructions</Label>
                        <Textarea id="instructions" rows={3} {...register("instructions")} />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="requirements">Requirements</Label>
                        <Textarea id="requirements" rows={2} {...register("requirements")} />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="acceptanceCriteria">Acceptance criteria</Label>
                        <Textarea id="acceptanceCriteria" rows={2} {...register("acceptanceCriteria")} />
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
                                                    className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors duration-fast ${checked ? "bg-primary/10" : "hover:bg-muted"
                                                        }`}
                                                >
                                                    <Checkbox
                                                        checked={checked}
                                                        onCheckedChange={(c) => {
                                                            field.onChange(
                                                                c ? [...field.value, t.id] : field.value.filter((id) => id !== t.id)
                                                            );
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

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Saving…" : "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </ResponsiveDialog>

            <StaleEditWarningDialog open={conflictOpen} onOpenChange={setConflictOpen} onConfirm={handleConfirmOverwrite} />
        </>
    );
}