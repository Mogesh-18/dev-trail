import { z } from "zod";

/**
 * Zod schema for validating task form data.
 * 
 * @type {import('zod').ZodObject<{
 *   title: import('zod').ZodString,
 *   description: import('zod').ZodOptional<import('zod').ZodString>,
 *   instructions: import('zod').ZodOptional<import('zod').ZodString>,
 *   priority: import('zod').ZodEnum<['low','medium','high']>,
 *   estimatedMinutes: import('zod').ZodEffects<import('zod').ZodUnion<[import('zod').ZodString, import('zod').ZodNumber]>, number | null>,
 *   dueDate: import('zod').ZodOptional<import('zod').ZodString>,
 *   completionCriteria: import('zod').ZodOptional<import('zod').ZodString>,
 *   prerequisiteTaskIds: import('zod').ZodDefault<import('zod').ZodArray<import('zod').ZodString>>
 * }>}
 */
export const taskSchema = z.object({
    title: z.string().min(1, "Title is required").max(200),
    description: z.string().max(2000).optional().or(z.literal("")),
    instructions: z.string().max(5000).optional().or(z.literal("")),
    priority: z.enum(["low", "medium", "high"]),
    estimatedMinutes: z.union([z.string(), z.number()]).optional().transform((val) => (val === "" || val === undefined ? null : Number(val))),
    dueDate: z.string().optional().or(z.literal("")),
    completionCriteria: z.string().max(2000).optional().or(z.literal("")),
    prerequisiteTaskIds: z.array(z.string()).default([]),
});