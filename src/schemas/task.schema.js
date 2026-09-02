import { z } from "zod";

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