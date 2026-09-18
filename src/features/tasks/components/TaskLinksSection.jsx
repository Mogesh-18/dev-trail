import { useState } from "react";
import { Link2, ExternalLink, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/common/EmptyState";
import { useTaskLinks, useAddTaskLink, useRemoveTaskLink } from "@/features/tasks/hooks/useTaskLinks";

function isValidHttpUrl(value) {
    try {
        const parsed = new URL(value);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
}

/**
 * Multiple reference links for a task — admin can add/remove, student
 * gets a read-only list. Same row/shadow/hover language as ResourceList
 * so it feels native inside the quick-view dialog.
 *
 * @param {Object} props
 * @param {string} props.taskId
 * @param {boolean} [props.canManage=true]
 * @returns {JSX.Element}
 */
export function TaskLinksSection({ taskId, canManage = true }) {
    const { data: links = [], isLoading } = useTaskLinks(taskId);
    const addLink = useAddTaskLink(taskId);
    const removeLink = useRemoveTaskLink(taskId);

    const [url, setUrl] = useState("");
    const [label, setLabel] = useState("");
    const [error, setError] = useState(null);

    function handleAdd(e) {
        e.preventDefault();
        const trimmed = url.trim();
        if (!trimmed) return;
        if (!isValidHttpUrl(trimmed)) {
            setError("That doesn't look like a valid link (needs to start with http:// or https://).");
            return;
        }
        setError(null);
        addLink.mutate(
            { url: trimmed, label: label.trim() || trimmed },
            { onSuccess: () => { setUrl(""); setLabel(""); } }
        );
    }

    if (isLoading) return <p className="text-sm text-muted-foreground">Loading links…</p>;

    return (
        <div className="space-y-3">
            {links.length === 0 && (
                <EmptyState icon={Link2} title="No links yet" description={canManage ? "Add reference links below." : "The admin hasn't added any links to this task."} />
            )}

            {links.length > 0 && (
                <ul className="space-y-2">
                    {links.map((link) => (
                        <li key={link.id} className="flex items-center gap-3 rounded-md border border-border/60 p-2.5 transition-all duration-base ease-trail hover:border-primary/30 hover:shadow-[var(--shadow-sm)]">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                <Link2 className="h-3.5 w-3.5" />
                            </span>
                            <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex min-w-0 flex-1 items-center gap-1 truncate text-sm font-medium text-primary hover:underline"
                            >
                                <span className="truncate">{link.label || link.url}</span>
                                <ExternalLink className="h-3 w-3 shrink-0" />
                            </a>
                            {canManage && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                                    onClick={() => removeLink.mutate(link.id)}
                                    aria-label="Remove link"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {canManage && (
                <form onSubmit={handleAdd} className="flex flex-col gap-2 sm:flex-row">
                    <Input placeholder="Label (optional)" value={label} onChange={(e) => setLabel(e.target.value)} className="sm:w-36" />
                    <Input
                        placeholder="https://…"
                        value={url}
                        onChange={(e) => { setUrl(e.target.value); setError(null); }}
                        className="flex-1"
                    />
                    <Button type="submit" variant="outline" disabled={addLink.isPending} className="gap-1.5">
                        <Plus className="h-3.5 w-3.5" />
                        {addLink.isPending ? "Adding…" : "Add"}
                    </Button>
                </form>
            )}
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}