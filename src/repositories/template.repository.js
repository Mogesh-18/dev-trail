import { templatesProvider } from "@/data-providers/supabase/templates.provider";

/**
 * Repository wrapper for template operations.
 * 
 * @type {{
 *   list: () => Promise<Array>,
 *   create: (input: Object) => Promise<Object>,
 *   remove: (id: string|number) => Promise<void>
 * }}
 */
export const TemplateRepository = {
    list: () => templatesProvider.list(),
    create: (input) => templatesProvider.create(input),
    remove: (id) => templatesProvider.remove(id),
};