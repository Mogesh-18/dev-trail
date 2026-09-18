import { taskLinksProvider } from "@/data-providers/supabase/task-links.provider";

/**
 * Repository layer for task links — same method names as the provider,
 * kept as a pass-through today so a future backend swap only touches
 * the provider, per the app's Page → Hook → Service → Repository →
 * Provider layering.
 */
export const taskLinksRepository = {
    listByTask: (taskId) => taskLinksProvider.listByTask(taskId),
    add: (taskId, input) => taskLinksProvider.add(taskId, input),
    remove: (id) => taskLinksProvider.remove(id),
};