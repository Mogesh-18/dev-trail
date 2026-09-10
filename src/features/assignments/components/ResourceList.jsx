import { useState } from "react";
import { FileText, Link as LinkIcon, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssignmentService } from "@/features/assignments/services/assignment.service";
import { useRemoveResource } from "@/features/assignments/hooks/useAssignments";

/**
 * Assignment resource list. Rows lift on hover, icon buttons get a
 * press-scale, download action shows a brief spinning state instead
 * of just disabling silently.
 *
 * @param {Object} props
 * @param {string|number} props.assignmentId
 * @param {Array} props.resources
 * @param {boolean} [props.canManage=true]
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
            {resources.map((resource, i) => (
                <li
                    key={resource.id}
                    style={{ animationDelay: `${i * 40}ms` }}
                    className="flex items-center gap-3 rounded-md border border-border/60 p-2.5 transition-all duration-base ease-trail duration-base animate-in fade-in slide-in-from-bottom-1 fill-mode-both hover:border-primary/30 hover:shadow-[var(--shadow-sm)]"
                >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        {resource.type === "link" ? <LinkIcon className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm">{resource.label || resource.url}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpen(resource)}
                        disabled={openingId === resource.id}
                        aria-label="Open resource"
                        className={openingId === resource.id ? "animate-pulse" : ""}
                    >
                        <Download className="h-4 w-4" />
                    </Button>
                    {canManage && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeResource.mutate(resource)}
                            aria-label="Remove resource"
                            className="text-muted-foreground hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </li>
            ))}
        </ul>
    );
}