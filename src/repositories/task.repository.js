import { tasksProvider } from "@/data-providers/supabase/tasks.provider";

// Swapping persistence later means writing a new provider with this same
// shape and changing only the import above — nothing outside this file.
export const TaskRepository = {
    list: () => tasksProvider.list(),
    getById: (id) => tasksProvider.getById(id),
    create: (input) => tasksProvider.create(input),
    update: (id, input) => tasksProvider.update(id, input),
    remove: (id) => tasksProvider.remove(id),
    reorder: (orderedIds) => tasksProvider.reorder(orderedIds),
    listDependencies: () => tasksProvider.listDependencies(),
    setDependencies: (taskId, prerequisiteTaskIds) => tasksProvider.setDependencies(taskId, prerequisiteTaskIds),
};