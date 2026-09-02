import { ProfileRepository } from "@/repositories/profile.repository";
import { emit, EVENTS } from "@/app/events/bus";

export const ProfileService = {
    list: () => ProfileRepository.list(),
    getById: (id) => ProfileRepository.getById(id),

    async updateSelf(input) {
        const profile = await ProfileRepository.updateSelf(input);
        emit(EVENTS.USER_UPDATED, { userId: profile.id });
        return profile;
    },

    uploadAvatar: (file) => ProfileRepository.uploadAvatar(file),
};