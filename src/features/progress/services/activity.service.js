import { ActivityRepository } from "@/repositories/activity.repository";

export const ActivityService = {
    list: (limit) => ActivityRepository.list(limit),
    listPage: (params) => ActivityRepository.listPage(params),
    log: (entry) => ActivityRepository.log(entry),
};