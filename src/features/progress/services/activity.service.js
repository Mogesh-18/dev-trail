import { ActivityRepository } from "@/repositories/activity.repository";

export const ActivityService = {
    list: (limit) => ActivityRepository.list(limit),
    log: (entry) => ActivityRepository.log(entry),
};