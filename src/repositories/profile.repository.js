import { profilesProvider } from "@/data-providers/supabase/profiles.provider";

export const ProfileRepository = {
    list: () => profilesProvider.list(),
    getById: (id) => profilesProvider.getById(id),
    updateSelf: (input) => profilesProvider.updateSelf(input),
    uploadAvatar: (file) => profilesProvider.uploadAvatar(file),
};