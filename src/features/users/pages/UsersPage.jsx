import { Skeleton } from "@/components/ui/skeleton";
import { useProfiles } from "@/features/users/hooks/useProfiles";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { useProgress } from "@/features/progress/hooks/useProgress";
import { formatRelativeTime } from "@/utils/format-date";
import { TASK_STATUS } from "@/constants/statuses";
import { ROLES } from "@/constants/roles";

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
            <div>
                <h1 className="text-2xl font-semibold">Users</h1>
                <p className="text-muted-foreground">The two accounts authorized for DevTrail.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                {(profiles ?? []).map((profile) => (
                    <div key={profile.id} className="rounded-lg border bg-card p-4">
                        <div className="flex items-center gap-3">
                            {profile.avatarUrl ? (
                                <img src={profile.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                            ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
                                    {(profile.displayName || profile.email)[0]?.toUpperCase()}
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="truncate font-medium">{profile.displayName || profile.email}</p>
                                <p className="truncate text-sm text-muted-foreground">{profile.email}</p>
                            </div>
                            <span className="ml-auto rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium capitalize">
                                {profile.role}
                            </span>
                        </div>
                        <dl className="mt-3 space-y-1 text-sm text-muted-foreground">
                            <div className="flex justify-between">
                                <dt>Last login</dt>
                                <dd>{profile.lastLoginAt ? formatRelativeTime(profile.lastLoginAt) : "Never"}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt>Member since</dt>
                                <dd>{new Date(profile.createdAt).toLocaleDateString()}</dd>
                            </div>
                            {profile.role === ROLES.STUDENT && (
                                <div className="flex justify-between">
                                    <dt>Tasks completed</dt>
                                    <dd>
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