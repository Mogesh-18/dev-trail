import { useState } from "react";
import { Github, Code2, ExternalLink, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/common/EmptyState";
import { TrailLoader } from "@/components/common/TrailLoader";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useSubmissions, useAddSubmission, useDeleteSubmission } from "@/features/assignments/hooks/useSubmissions";
import { SubmissionService } from "@/features/assignments/services/submission.service";
import { formatRelativeTime } from "@/utils/format-date";
import { canManageOwned } from "@/utils/can-manage-owned";

/**
 * Mapping from code host type to Lucide icon component.
 * 
 * @type {Record<'github'|'codesandbox'|'stackblitz'|'other', import('lucide-react').LucideIcon>}
 */
const HOST_ICON = {
    github: Github,
    codesandbox: Code2,
    stackblitz: Code2,
    other: Code2,
};

/**
 * Extracts the embed URL from a CodeSandbox link.
 * 
 * @param {string} url - Full CodeSandbox URL.
 * @returns {string|null} Embed URL or null if not a valid CodeSandbox link.
 */
function codesandboxEmbedUrl(url) {
    const match = url.match(/codesandbox\.io\/(?:s|p\/sandbox)\/([a-zA-Z0-9_-]+)/);
    return match ? `https://codesandbox.io/embed/${match[1]}?fontsize=12&hidenavigation=1&theme=dark` : null;
}

/**
 * Checks whether a string is a valid HTTP or HTTPS URL.
 * 
 * @param {string} value - The URL string to validate.
 * @returns {boolean} `true` if the string is a valid HTTP/HTTPS URL, `false` otherwise.
 */
function isValidHttpUrl(value) {
    try {
        const parsed = new URL(value);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
}

/**
 * Submission list with add/delete. List rows now lift on hover, the
 * embed toggle chevron rotates instead of swapping icons instantly,
 * and the loading state uses the branded TrailLoader.
 *
 * @param {Object} props
 * @param {string} props.assignmentId
 * @param {'student'|'admin'} [props.mode='student']
 * @returns {JSX.Element}
 */
export function SubmissionsSection({ assignmentId, mode = "student" }) {
    const { user, role } = useAuth();
    const { data: submissions = [], isLoading } = useSubmissions(assignmentId);
    const addSubmission = useAddSubmission(assignmentId);
    const deleteSubmission = useDeleteSubmission(assignmentId);

    const [url, setUrl] = useState("");
    const [note, setNote] = useState("");
    const [urlError, setUrlError] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    function handleSubmit(e) {
        e.preventDefault();
        const trimmed = url.trim();
        if (!trimmed) return;
        if (!isValidHttpUrl(trimmed)) {
            setUrlError("That doesn't look like a valid link (needs to start with http:// or https://).");
            return;
        }
        setUrlError(null);
        addSubmission.mutate(
            { url: trimmed, note: note.trim() },
            { onSuccess: () => { setUrl(""); setNote(""); } }
        );
    }

    return (
        <div className="space-y-3">
            {isLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrailLoader size="sm" />
                    Loading submissions…
                </div>
            )}

            {!isLoading && submissions.length === 0 && (
                <EmptyState
                    icon={Code2}
                    title="No submissions yet"
                    description={mode === "student" ? "Paste a GitHub repo or CodeSandbox link below to submit your work." : "Waiting on the student's submission."}
                />
            )}

            {submissions.length > 0 && (
                <ul className="space-y-2">
                    {submissions.map((s, i) => {
                        const host = SubmissionService.detectCodeHost(s.url);
                        const Icon = HOST_ICON[host];
                        const embedUrl = host === "codesandbox" ? codesandboxEmbedUrl(s.url) : null;
                        const isExpanded = expandedId === s.id;

                        return (
                            <li
                                key={s.id}
                                style={{ animationDelay: `${i * 40}ms` }}
                                className="rounded-md border border-border/60 bg-card p-3 text-sm shadow-[var(--shadow-sm)] transition-all duration-base ease-trail duration-base animate-in fade-in slide-in-from-bottom-1 fill-mode-both hover:shadow-[var(--shadow-md)]"
                            >
                                <div className="flex items-start gap-2">
                                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                        <Icon className="h-3.5 w-3.5" />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
                                            <span className="truncate">{s.url}</span>
                                            <ExternalLink className="h-3 w-3 shrink-0" />
                                        </a>
                                        {s.note && <p className="mt-1 text-muted-foreground">{s.note}</p>}
                                        <p className="mt-1 font-mono text-xs text-muted-foreground">{formatRelativeTime(s.createdAt)}</p>
                                    </div>
                                    {embedUrl && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 shrink-0"
                                            onClick={() => setExpandedId(isExpanded ? null : s.id)}
                                        >
                                            <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-base ease-spring ${isExpanded ? "rotate-180" : ""}`} />
                                        </Button>
                                    )}
                                    {canManageOwned(s.studentId, { role, userId: user?.id }) && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                                            onClick={() => deleteSubmission.mutate(s.id)}
                                            aria-label="Delete submission"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    )}
                                </div>
                                {embedUrl && isExpanded && (
                                    <iframe
                                        src={embedUrl}
                                        title={`Preview of ${s.url}`}
                                        className="mt-3 h-80 w-full rounded-md border border-border/60 shadow-[var(--shadow-sm)] duration-base animate-in fade-in slide-in-from-top-1"
                                        sandbox="allow-scripts allow-same-origin allow-forms"
                                    />
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}

            {mode === "student" && (
                <form onSubmit={handleSubmit} className="space-y-2 rounded-md border border-border/60 bg-card p-3">
                    <Input
                        placeholder="https://github.com/you/repo or https://codesandbox.io/s/…"
                        value={url}
                        onChange={(e) => { setUrl(e.target.value); setUrlError(null); }}
                    />
                    {urlError && <p className="text-xs text-destructive">{urlError}</p>}
                    <Textarea rows={2} placeholder="Anything you want to point out about this submission (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
                    <Button type="submit" size="sm" disabled={addSubmission.isPending}>
                        {addSubmission.isPending ? "Submitting…" : "Submit link"}
                    </Button>
                </form>
            )}
        </div>
    );
}