import { TaskRepository } from "@/repositories/task.repository";
import { emit, EVENTS } from "@/app/events/bus";

export const TaskService = {
    list: () => TaskRepository.list(),
    listDependencies: () => TaskRepository.listDependencies(),

    async create(input) {
        const task = await TaskRepository.create(input);
        if (input.prerequisiteTaskIds?.length) {
            await TaskRepository.setDependencies(task.id, input.prerequisiteTaskIds);
        }
        emit(EVENTS.TASK_CREATED, { taskId: task.id });
        return task;
    },

    async update(id, input) {
        const task = await TaskRepository.update(id, input);
        await TaskRepository.setDependencies(id, input.prerequisiteTaskIds ?? []);
        emit(EVENTS.TASK_UPDATED, { taskId: id });
        return task;
    },

    async remove(id) {
        await TaskRepository.remove(id);
        emit(EVENTS.TASK_DELETED, { taskId: id });
    },

    reorder: (orderedIds) => TaskRepository.reorder(orderedIds),
};