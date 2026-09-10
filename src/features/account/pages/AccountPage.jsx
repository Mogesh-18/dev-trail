import { useState, useRef, useEffect } from "react";
import { Camera } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useProfile, useUpdateOwnProfile, useUploadAvatar } from "@/features/users/hooks/useProfiles";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { useProgress, useActivity } from "@/features/progress/hooks/useProgress";
import { calculateOverallProgress, calculateStreak, summarizeCounts } from "@/features/progress/services/insights.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/common/StatCard";
import { NotificationToggle } from "@/features/notifications/components/NotificationToggle";

/**
 * Student account page: profile, display name form, learning stats.
 *
 * @returns {JSX.Element}
 */
export default function AccountPage() {
    const { user } = useAuth();
    const { data: profile, isLoading } = useProfile(user?.id);
    const { data: tasks } = useTasks();
    const { data: progress = [] } = useProgress();
    const { data: activity = [] } = useActivity();
    const updateProfile = useUpdateOwnProfile();
    const uploadAvatar = useUploadAvatar();

    const [displayName, setDisplayName] = useState("");
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (profile) setDisplayName(profile.displayName ?? "");
    }, [profile]);

    if (isLoading || !profile) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
    }

    function handleSaveName(e) {
        e.preventDefault();
        updateProfile.mutate({ displayName, avatarUrl: profile.avatarUrl });
    }

    async function handleAvatarChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        const avatarUrl = await uploadAvatar.mutateAsync(file);
        updateProfile.mutate({ displayName, avatarUrl });
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    const counts = summarizeCounts(tasks ?? [], progress);
    const overallProgress = calculateOverallProgress(tasks ?? [], progress);
    const streak = calculateStreak(activity);

    return (
        <div className="space-y-6">
            <div className="duration-slow animate-in fade-in slide-in-from-bottom-1">
                <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
                <p className="text-muted-foreground">Your profile and learning stats.</p>
            </div>

            <div className="flex items-center gap-4 rounded-lg border border-border/60 bg-card p-4 shadow-[var(--shadow-sm)] duration-base animate-in fade-in slide-in-from-bottom-1">
                <div className="group relative">
                    {profile.avatarUrl ? (
                        <img
                            src={profile.avatarUrl}
                            alt=""
                            className="h-16 w-16 rounded-full object-cover shadow-[var(--shadow-md)] ring-2 ring-card"
                        />
                    ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary font-mono text-xl font-semibold text-primary-foreground shadow-[var(--shadow-md)]">
                            {(profile.displayName || profile.email)[0]?.toUpperCase()}
                        </div>
                    )}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadAvatar.isPending}
                        aria-label="Change photo"
                        className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-[var(--shadow-sm)] transition-transform duration-fast ease-spring hover:scale-110 active:scale-95"
                    >
                        <Camera className="h-3 w-3" />
                    </button>
                </div>
                <div>
                    <p className="font-medium">{profile.email}</p>
                    <p className="text-sm capitalize text-muted-foreground">{profile.role}</p>
                    {uploadAvatar.isPending && <p className="mt-1 text-xs text-muted-foreground">Uploading…</p>}
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </div>
            </div>

            <form
                onSubmit={handleSaveName}
                className="max-w-sm space-y-3 rounded-lg border border-border/60 bg-card p-4 shadow-[var(--shadow-sm)] duration-base animate-in fade-in slide-in-from-bottom-1"
            >
                <div className="space-y-1.5">
                    <Label htmlFor="displayName">Display name</Label>
                    <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>
                <p className="text-xs text-muted-foreground">
                    Your Gmail address and role are tied to your Google account and can't be changed here.
                </p>
                <Button type="submit" size="sm" disabled={updateProfile.isPending}>
                    {updateProfile.isPending ? "Saving…" : "Save"}
                </Button>

                <div className="max-w-sm rounded-lg border border-border/60 p-4">
                    <p className="text-sm font-medium">Notifications</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Get notified on this device when a task or assignment changes.
                    </p>
                    <NotificationToggle className="mt-3 w-full justify-start gap-2" />
                </div>
            </form>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                    { key: "overall", label: "Overall progress", value: overallProgress, tone: "primary" },
                    { key: "completed", label: "Completed", value: counts.completed, tone: "primary" },
                    { key: "streak", label: "Streak", value: streak, tone: "accent" },
                    { key: "inProgress", label: "In progress", value: counts.inProgress, tone: "secondary" },
                ].map((stat, i) => (
                    <div
                        key={stat.key}
                        className="duration-slow animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
                        style={{ animationDelay: `${i * 60}ms` }}
                    >
                        <StatCard label={stat.label} value={stat.value} tone={stat.tone} />
                    </div>
                ))}
            </div>
        </div>
    );
}