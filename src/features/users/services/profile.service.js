import { ProfileRepository } from "@/repositories/profile.repository";
import { emit, EVENTS } from "@/app/events/bus";

/**
 * Profile Service
 */
export const ProfileService = {
    /**
     * Fetches all profiles.
     * 
     * @returns {Promise<Array>}
     */
    list: () => ProfileRepository.list(),

    /**
     * Fetches a profile by ID.
     * 
     * @param {string} id - User ID.
     * @returns {Promise<Object>}
     */
    getById: (id) => ProfileRepository.getById(id),

    /**
     * Updates the current user's profile and emits `USER_UPDATED` event.
     * 
     * @param {Object} input - { displayName, avatarUrl }.
     * @returns {Promise<Object>} Updated profile.
     */
    async updateSelf(input) {
        const profile = await ProfileRepository.updateSelf(input);
        emit(EVENTS.USER_UPDATED, { 
            userId: profile.id 
        });
        return profile;
    },

    /**
     * Uploads an avatar image and returns the public URL.
     * 
     * @param {File} file - Image file.
     * @returns {Promise<string>} Public URL.
     */
    uploadAvatar: (file) => ProfileRepository.uploadAvatar(file),
};