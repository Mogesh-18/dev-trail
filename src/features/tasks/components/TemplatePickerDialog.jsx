import { LayoutTemplate, Trash2 } from "lucide-react";
import { ResponsiveDialog } from "@/components/common/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { useTemplates, useDeleteTemplate } from "@/features/tasks/hooks/useTemplates";

/**
 * Dialog for picking a task template to create a new task from.
 * 
 * @param {Object} props
 * @param {boolean} props.open - Controls dialog visibility.
 * @param {(open: boolean) => void} props.onOpenChange - Callback for open state changes.
 * @param {(template: Object) => void} props.onPick - Callback when a template is selected.
 * @returns {JSX.Element}
 */
export function TemplatePickerDialog({ open, onOpenChange, onPick }) {
    const { data: templates = [], isLoading } = useTemplates();
    const deleteTemplate = useDeleteTemplate();

    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange} title="New task from template">
            {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

            {!isLoading && templates.length === 0 && (
                <EmptyState
                    icon={LayoutTemplate}
                    title="No templates yet"
                    description={'Open an existing task, edit it, and use "Save as template" to create your first one.'}
                />
            )}

            {templates.length > 0 && (
                <div className="max-h-96 space-y-2 overflow-y-auto">
                    {templates.map((template) => (
                        <div key={template.id} className="flex items-center gap-2 rounded-md border p-2.5">
                            <button
                                type="button"
                                onClick={() => { onPick(template); onOpenChange(false); }}
                                className="min-w-0 flex-1 text-left"
                            >
                                <p className="truncate text-sm font-medium">{template.title}</p>
                                {template.description && <p className="truncate text-xs text-muted-foreground">{template.description}</p>}
                            </button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 shrink-0"
                                onClick={() => deleteTemplate.mutate(template.id)}
                                aria-label="Delete template"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </ResponsiveDialog>
    );
}