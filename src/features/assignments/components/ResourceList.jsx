import { useState } from "react";
import { FileText, Link as LinkIcon, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssignmentService } from "@/features/assignments/services/assignment.service";
import { useRemoveResource } from "@/features/assignments/hooks/useAssignments";

/**
 * Displays a list of assignment resources with open/remove actions.
 * 
 * @param {Object} props
 * @param {string|number} props.assignmentId - Assignment ID.
 * @param {Array} props.resources - Resources to display.
 * @param {boolean} [props.canManage=true] - Whether to show remove buttons.
 * @returns {JSX.Element}
 */
export function ResourceList({ assignmentId, resources, canManage = true }) {
    const removeResource = useRemoveResource(assignmentId);
    const [openingId, setOpeningId] = useState(null);

    async function handleOpen(resource) {
        if (resource.type === "link") {
            window.open(resource.url, "_blank", "noopener,noreferrer");
            return;
        }
        setOpeningId(resource.id);
        try {
            const signedUrl = await AssignmentService.getResourceDownloadUrl(resource.url);
            window.open(signedUrl, "_blank", "noopener,noreferrer");
        } finally {
            setOpeningId(null);
        }
    }

    if (resources.length === 0) {
        return <p className="text-sm text-muted-foreground">No resources added yet.</p>;
    }

    return (
        <ul className="space-y-2">
            {resources.map((resource) => (
                <li key={resource.id} className="flex items-center gap-3 rounded-md border p-2.5">
                    {resource.type === "link" ? (
                        <LinkIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : (
                        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className="min-w-0 flex-1 truncate text-sm">{resource.label || resource.url}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpen(resource)}
                        disabled={openingId === resource.id}
                        aria-label="Open resource"
                    >
                        <Download className="h-4 w-4" />
                    </Button>
                    {canManage && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeResource.mutate(resource)}
                            aria-label="Remove resource"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </li>
            ))}
        </ul>
    );
}