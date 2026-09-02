import { NoteRepository } from "@/repositories/note.repository";

export const NoteService = {
    listByContext: (contextType, contextId) => NoteRepository.listByContext(contextType, contextId),
    listByContextPage: (params) => NoteRepository.listByContextPage(params),
    listAllPage: (params) => NoteRepository.listAllPage(params),
    create: (input) => NoteRepository.create(input),
    remove: (id) => NoteRepository.remove(id),
};