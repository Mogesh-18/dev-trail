import { z } from "zod";

export const assignmentSchema = z.object({
    title: z.string().min(1, "Title is required").max(200),
    instructions: z.string().max(5000).optional().or(z.literal("")),
    requirements: z.string().max(3000).optional().or(z.literal("")),
    acceptanceCriteria: z.string().max(3000).optional().or(z.literal("")),
    deadline: z.string().optional().or(z.literal("")),
    estimatedMinutes: z.union([z.string(), z.number()]).optional().transform((val) => (val === "" || val === undefined ? null : Number(val))),
    taskIds: z.array(z.string()).default([]),
});