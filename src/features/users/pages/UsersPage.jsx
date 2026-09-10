import { Skeleton } from "@/components/ui/skeleton";
import { useProfiles } from "@/features/users/hooks/useProfiles";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { useProgress } from "@/features/progress/hooks/useProgress";
import { formatRelativeTime } from "@/utils/format-date";
import { TASK_STATUS } from "@/constants/statuses";
import { ROLES } from "@/constants/roles";

/**
 * User profile cards — avatar/initial badge gets the shared shadow
 * treatment, cards lift on hover, entrance staggers.
 *
 * @returns {JSX.Element}
 */
export default function UsersPage() {
    const { data: profiles, isLoading } = useProfiles();
    const { data: tasks } = useTasks();
    const { data: progress } = useProgress();

    if (isLoading) {
        return (
            <div className="grid gap-3 sm:grid-cols-2">
                {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                ))}
            </div>
        );
    }

    const completedCount = (progress ?? []).filter((p) => p.status === TASK_STATUS.COMPLETED).length;

    return (
        <div className="space-y-4">
            <div className="duration-slow animate-in fade-in slide-in-from-bottom-1">
                <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
                <p className="text-muted-foreground">The two accounts authorized for DevTrail.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                {(profiles ?? []).map((profile, i) => (
                    <div
                        key={profile.id}
                        style={{ animationDelay: `${i * 60}ms` }}
                        className="rounded-lg border border-border/60 bg-card p-4 shadow-[var(--shadow-sm)] transition-all duration-base ease-trail duration-base animate-in fade-in slide-in-from-bottom-1 fill-mode-both hover:-translate-y-px hover:shadow-[var(--shadow-md)]"
                    >
                        <div className="flex items-center gap-3">
                            {profile.avatarUrl ? (
                                <img src={profile.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover shadow-[var(--shadow-sm)]" />
                            ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-mono text-sm font-semibold text-primary-foreground shadow-[var(--shadow-sm)]">
                                    {(profile.displayName || profile.email)[0]?.toUpperCase()}
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="truncate font-medium">{profile.displayName || profile.email}</p>
                                <p className="truncate text-sm text-muted-foreground">{profile.email}</p>
                            </div>
                            <span className="ml-auto rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium capitalize">{profile.role}</span>
                        </div>
                        <dl className="mt-3 space-y-1 text-sm text-muted-foreground">
                            <div className="flex justify-between">
                                <dt>Last login</dt>
                                <dd className="font-mono">{profile.lastLoginAt ? formatRelativeTime(profile.lastLoginAt) : "Never"}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt>Member since</dt>
                                <dd className="font-mono">{new Date(profile.createdAt).toLocaleDateString()}</dd>
                            </div>
                            {profile.role === ROLES.STUDENT && (
                                <div className="flex justify-between">
                                    <dt>Tasks completed</dt>
                                    <dd className="font-mono">
                                        {completedCount} / {(tasks ?? []).length}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>
                ))}
            </div>
        </div>
    );
}