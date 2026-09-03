import { tasksProvider } from "@/data-providers/supabase/tasks.provider";

/**
 * Repository wrapper for task operations.
 * Delegates all calls to `tasksProvider`.
 * 
 * @type {{
 *   list: () => Promise<Array>,
 *   getById: (id: string|number) => Promise<Object>,
 *   create: (input: Object) => Promise<Object>,
 *   update: (id: string|number, input: Object) => Promise<Object>,
 *   remove: (id: string|number) => Promise<void>,
 *   reorder: (orderedIds: Array<string|number>) => Promise<void>,
 *   listDependencies: () => Promise<Array<{ taskId: string, prerequisiteTaskId: string }>>,
 *   setDependencies: (taskId: string|number, prerequisiteTaskIds: Array<string|number>) => Promise<void>
 * }}
 */
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