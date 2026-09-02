import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileService } from "@/features/users/services/profile.service";

export function useProfiles() {
    return useQuery({ queryKey: ["profiles"], queryFn: ProfileService.list });
}

export function useProfile(id) {
    return useQuery({
        queryKey: ["profile", id],
        queryFn: () => ProfileService.getById(id),
        enabled: !!id,
    });
}

export function useUpdateOwnProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input) => ProfileService.updateSelf(input),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profiles"] }),
    });
}

export function useUploadAvatar() {
    return useMutation({ mutationFn: (file) => ProfileService.uploadAvatar(file) });
}