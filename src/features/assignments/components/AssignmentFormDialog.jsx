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
 * Responsive dialog (desktop: dialog, mobile: sheet) for creating/editing an assignment.
 * 
 * @param {Object} props
 * @param {boolean} props.open - Controls dialog visibility.
 * @param {(open: boolean) => void} props.onOpenChange - Callback for open state changes.
 * @param {Object|null} props.assignment - Existing assignment (null for create).
 * @param {Array} props.allTasks - List of all tasks available for linking.
 * @param {Array} props.taskLinks - Existing assignment–task link relationships.
 * @param {(values: Object) => void} props.onSubmit - Submit handler.
 * @param {boolean} props.isPending - Whether the submit action is in progress.
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
            const taskIds = taskLinks
                .filter((link) => link.assignmentId === assignment.id)
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
        // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: only re-init on open, see TaskFormDialog's doc comment
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
                                    <div className="max-h-32 space-y-2 overflow-y-auto rounded-md border p-2">
                                        {allTasks.map((t) => (
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
            </ResponsiveDialog>

            <StaleEditWarningDialog open={conflictOpen} onOpenChange={setConflictOpen} onConfirm={handleConfirmOverwrite} />
        </>
    );
}