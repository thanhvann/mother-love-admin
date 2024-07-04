import { z } from "zod";
export const blogSchema = z.object({
    blogId: z.number(),
    image: z.string(),
    title:  z.string(),
    content: z.string(),
    createdDate: z.string(),
    lastModifiedDate: z.string()
});

export type BrandType = z.infer<typeof blogSchema>;