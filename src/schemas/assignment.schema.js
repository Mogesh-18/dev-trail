import { z } from "zod";

/**
 * Zod schema for validating assignment form data.
 * 
 * @type {import('zod').ZodObject<{
 *   title: import('zod').ZodString,
 *   instructions: import('zod').ZodOptional<import('zod').ZodString>,
 *   requirements: import('zod').ZodOptional<import('zod').ZodString>,
 *   acceptanceCriteria: import('zod').ZodOptional<import('zod').ZodString>,
 *   deadline: import('zod').ZodOptional<import('zod').ZodString>,
 *   estimatedMinutes: import('zod').ZodEffects<import('zod').ZodUnion<[import('zod').ZodString, import('zod').ZodNumber]>, number | null>,
 *   taskIds: import('zod').ZodDefault<import('zod').ZodArray<import('zod').ZodString>>
 * }>}
 */
export const assignmentSchema = z.object({
    title: z.string().min(1, "Title is required").max(200),
    instructions: z.string().max(5000).optional().or(z.literal("")),
    requirements: z.string().max(3000).optional().or(z.literal("")),
    acceptanceCriteria: z.string().max(3000).optional().or(z.literal("")),
    deadline: z.string().optional().or(z.literal("")),
    estimatedMinutes: z.union([z.string(), z.number()]).optional().transform((val) => (val === "" || val === undefined ? null : Number(val))),
    taskIds: z.array(z.string()).default([]),
});