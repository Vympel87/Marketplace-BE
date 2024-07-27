import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string(),
    price: z.number().positive("Price must be a positive number"),
    tags: z.array(z.string()),
    image: z.string().url().optional(),
});

export const updateProductSchema = createProductSchema.partial().extend({
    id: z.number().positive("ID must be a positive number").optional(),
});
