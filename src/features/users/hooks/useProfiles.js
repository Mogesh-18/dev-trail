import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileService } from "@/features/users/services/profile.service";

/**
 * Fetches all user profiles.
 * @returns {import('@tanstack/react-query').UseQueryResult<Array>}
 */
export function useProfiles() {
    return useQuery({ 
        queryKey: ["profiles"], 
        queryFn: ProfileService.list 
    });
}

/**
 * Fetches a single profile by user ID.
 * @param {string} id - User ID.
 * @returns {import('@tanstack/react-query').UseQueryResult<Object>}
 */
export function useProfile(id) {
    return useQuery({
        queryKey: ["profile", id],
        queryFn: () => ProfileService.getById(id),
        enabled: !!id,
    });
}

/**
 * Mutation for updating the current user's profile (display name and avatar URL).
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export function useUpdateOwnProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input) => ProfileService.updateSelf(input),
        onSuccess: () => queryClient.invalidateQueries({ 
            queryKey: ["profiles"] 
        }),
    });
}

/**
 * Mutation for uploading a new avatar image.
 * @returns {import('@tanstack/react-query').UseMutationResult} Resolves with the public URL.
 */
export function useUploadAvatar() {
    return useMutation({ 
        mutationFn: (file) => ProfileService.uploadAvatar(file) 
    });
}