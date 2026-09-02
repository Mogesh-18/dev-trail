import { notesProvider } from "@/data-providers/supabase/notes.provider";

export const NoteRepository = {
    listByContext: (contextType, contextId) => notesProvider.listByContext(contextType, contextId),
    listByContextPage: (params) => notesProvider.listByContextPage(params),
    listAllPage: (params) => notesProvider.listAllPage(params),
    create: (input) => notesProvider.create(input),
    remove: (id) => notesProvider.remove(id),
};