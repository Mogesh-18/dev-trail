import { z } from "zod";

/**
 * Zod schema for validating report form data.
 * 
 * @type {import('zod').ZodObject<{
 *   title: import('zod').ZodOptional<import('zod').ZodString>,
 *   body: import('zod').ZodEffects<import('zod').ZodString, string>
 * }>}
 */
export const reportSchema = z.object({
    title: z.string().max(200).optional().or(z.literal("")),
    body: z.string().min(1, "Report can't be empty").max(5000),
});