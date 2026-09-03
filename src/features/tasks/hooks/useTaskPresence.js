import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/features/auth/hooks/useAuth";

/**
 * Hook that tracks whether another user (admin/student) is viewing the same task page.
 * 
 * @param {string} taskId - Task ID.
 * @returns {boolean} `true` if another role is present on the same task.
 */
export function useTaskPresence(taskId) {
    const { user, role } = useAuth();
    const [otherPresent, setOtherPresent] = useState(false);

    useEffect(() => {
        if (!taskId || !user) return undefined;

        const channel = supabase.channel(`task-presence-${taskId}`, {
            config: { 
                presence: { 
                    key: user.id 
                } 
            },
        });

        channel
            .on("presence", { event: "sync" }, () => {
                const state = channel.presenceState();
                const someoneElse = Object.values(state).flat().some((p) => p.role !== role);
                setOtherPresent(someoneElse);
            })
            .subscribe(async (status) => {
                if (status === "SUBSCRIBED") {
                    await channel.track({ 
                        role, 
                        userId: user.id 
                    });
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [taskId, user, role]);

    return otherPresent;
}