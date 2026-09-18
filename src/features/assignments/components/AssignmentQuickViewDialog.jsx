import { Link as RouterLink } from "@tanstack/react-router";
import { ExternalLink, FileText, Paperclip, Info, Lock } from "lucide-react";
import { ResponsiveDialog } from "@/components/common/ResponsiveDialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ResourceList } from "@/features/assignments/components/ResourceList";
import { AddResourceForm } from "@/features/assignments/components/AddResourceForm";
import { SubmissionsSection } from "@/features/assignments/components/SubmissionsSection";
import { useAssignmentResources } from "@/features/assignments/hooks/useAssignments";
import { ROUTES } from "@/constants/routes";

/**
 * Tabbed quick-view for an assignment, opened from the list. Resource
 * management (admin: add/remove; student: view) and the submissions
 * thread now live here instead of requiring a trip to the detail page
 * — the detail page itself is unchanged.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {Object|null} props.assignment
 * @param {'admin'|'student'} [props.mode='student']
 * @param {string[]} [props.lockedReasons] - Incomplete linked-task titles; when present and non-empty, shows a locked callout instead of hiding it.
 * @returns {JSX.Element|null}
 */
export function AssignmentQuickViewDialog({ open, onOpenChange, assignment, mode = "student", lockedReasons = [] }) {
    const { data: resources = [] } = useAssignmentResources(assignment?.id);

    if (!assignment) return null;

    const detailRoute = mode === "admin" ? ROUTES.ADMIN_ASSIGNMENT_DETAILS(assignment.id) : ROUTES.STUDENT_ASSIGNMENT_DETAILS(assignment.id);

    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange} title={assignment.title} contentClassName="sm:max-w-xl">
            <div className="mb-3 flex items-center justify-between gap-2">
                <StatusBadge status={assignment.status} />
                <RouterLink
                    to={detailRoute}
                    onClick={() => onOpenChange(false)}
                    className="ml-auto inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                    Open full page
                    <ExternalLink className="h-3 w-3" />
                </RouterLink>
            </div>

            {lockedReasons.length > 0 && (
                <div className="mb-3 flex items-center gap-3 rounded-lg border border-status-locked/30 bg-status-locked/10 p-3 text-sm shadow-[var(--shadow-sm)]">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-status-locked/20 text-status-locked">
                        <Lock className="h-4 w-4" />
                    </span>
                    <span className="text-muted-foreground">Complete {lockedReasons.join(", ")} first to unlock this assignment.</span>
                </div>
            )}

            <Tabs defaultValue="details">
                <TabsList className="w-full">
                    <TabsTrigger value="details" className="gap-1.5">
                        <Info className="h-3.5 w-3.5" />
                        Details
                    </TabsTrigger>
                    <TabsTrigger value="resources" className="gap-1.5">
                        <Paperclip className="h-3.5 w-3.5" />
                        Resources
                    </TabsTrigger>
                    <TabsTrigger value="submissions" className="gap-1.5">
                        <FileText className="h-3.5 w-3.5" />
                        Submissions
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="max-h-[50vh] space-y-3 overflow-y-auto py-1">
                    {assignment.deadline && <p className="text-sm text-muted-foreground">Due {assignment.deadline}</p>}
                    {assignment.instructions && (
                        <div className="space-y-1">
                            <h3 className="text-xs font-medium text-muted-foreground">Instructions</h3>
                            <p className="whitespace-pre-wrap text-sm">{assignment.instructions}</p>
                        </div>
                    )}
                    {assignment.requirements && (
                        <div className="space-y-1">
                            <h3 className="text-xs font-medium text-muted-foreground">Requirements</h3>
                            <p className="whitespace-pre-wrap text-sm">{assignment.requirements}</p>
                        </div>
                    )}
                    {assignment.acceptanceCriteria && (
                        <div className="space-y-1">
                            <h3 className="text-xs font-medium text-muted-foreground">Acceptance criteria</h3>
                            <p className="whitespace-pre-wrap text-sm">{assignment.acceptanceCriteria}</p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="resources" className="max-h-[50vh] space-y-3 overflow-y-auto py-1">
                    <ResourceList assignmentId={assignment.id} resources={resources} canManage={mode === "admin"} />
                    {mode === "admin" && <AddResourceForm assignmentId={assignment.id} />}
                </TabsContent>

                <TabsContent value="submissions" className="max-h-[50vh] overflow-y-auto py-1">
                    <SubmissionsSection assignmentId={assignment.id} mode={mode} />
                </TabsContent>
            </Tabs>
        </ResponsiveDialog>
    );
}