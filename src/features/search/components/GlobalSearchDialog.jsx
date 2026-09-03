import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ListChecks, ClipboardList, StickyNote, FileText } from "lucide-react";
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { useGlobalSearch } from "@/features/search/hooks/useGlobalSearch";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ROLES } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";

/**
 * Global search dialog using `Command` UI, showing results for tasks, assignments, notes, and reports.
 * 
 * @param {Object} props
 * @param {boolean} props.open - Controls dialog visibility.
 * @param {(open: boolean) => void} props.onOpenChange - Callback for open state changes.
 * @returns {JSX.Element}
 */
export function GlobalSearchDialog({ open, onOpenChange }) {
    const [query, setQuery] = useState("");
    const { results, isLoading } = useGlobalSearch(query);
    const { role } = useAuth();
    const navigate = useNavigate();
    const isAdmin = role === ROLES.ADMIN;

    function go(to) {
        navigate({ to });
        onOpenChange(false);
        setQuery("");
    }

    const taskRoute = (id) => (isAdmin ? ROUTES.ADMIN_TASK_DETAILS(id) : ROUTES.STUDENT_TASK_DETAILS(id));
    const assignmentRoute = (id) => (isAdmin ? ROUTES.ADMIN_ASSIGNMENT_DETAILS(id) : ROUTES.STUDENT_ASSIGNMENT_DETAILS(id));

    const hasAnyResults = results && (results.tasks.length || results.assignments.length || results.notes.length || results.reports.length);

    return (
        <CommandDialog open={open} onOpenChange={onOpenChange}>
            <CommandInput placeholder="Search tasks, assignments, notes, reports…" value={query} onValueChange={setQuery} />
            <CommandList>
                {query.trim().length < 3 && <CommandEmpty>Type at least 3 characters to search.</CommandEmpty>}
                {query.trim().length >= 3 && isLoading && <CommandEmpty>Searching…</CommandEmpty>}
                {query.trim().length >= 3 && !isLoading && !hasAnyResults && <CommandEmpty>No results.</CommandEmpty>}

                {results?.tasks.length > 0 && (
                    <CommandGroup heading="Tasks">
                        {results.tasks.map((r) => (
                            <CommandItem key={r.id} onSelect={() => go(taskRoute(r.id))}>
                                <ListChecks className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <span className="truncate">{r.title}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}

                {results?.assignments.length > 0 && (
                    <CommandGroup heading="Assignments">
                        {results.assignments.map((r) => (
                            <CommandItem key={r.id} onSelect={() => go(assignmentRoute(r.id))}>
                                <ClipboardList className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <span className="truncate">{r.title}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}

                {results?.notes.length > 0 && (
                    <CommandGroup heading="Notes">
                        {results.notes.map((r) => (
                            <CommandItem
                                key={r.id}
                                onSelect={() => go(r.contextType === "task" ? taskRoute(r.contextId) : assignmentRoute(r.contextId))}
                            >
                                <StickyNote className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <span className="truncate">{r.snippet}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}

                {results?.reports.length > 0 && (
                    <CommandGroup heading="Reports">
                        {results.reports.map((r) => (
                            <CommandItem key={r.id} onSelect={() => go(taskRoute(r.taskId))}>
                                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <span className="truncate">{r.title || r.snippet}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}
            </CommandList>
        </CommandDialog>
    );
}