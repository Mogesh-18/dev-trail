import { profilesProvider } from "@/data-providers/supabase/profiles.provider";

/**
 * Repository wrapper for user profile operations.
 * Delegates all calls to `profilesProvider`.
 * 
 * @type {{
 *   list: () => Promise<Array>,
 *   getById: (id: string) => Promise<Object>,
 *   updateSelf: (input: { displayName: string, avatarUrl: string }) => Promise<Object>,
 *   uploadAvatar: (file: File) => Promise<string>
 * }}
 */
export const ProfileRepository = {
    list: () => profilesProvider.list(),
    getById: (id) => profilesProvider.getById(id),
    updateSelf: (input) => profilesProvider.updateSelf(input),
    uploadAvatar: (file) => profilesProvider.uploadAvatar(file),
};