import { z } from "zod";

const BlogSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(5, { message: "Title must be at least 5 characters long" })
    .max(100, { message: "Title cannot exceed 100 characters" })
    .trim(),

  slug: z
    .string({ required_error: "Slug is required" })
    .min(2, { message: "Slug must be at least 2 characters long" })
    .max(50, { message: "Slug cannot exceed 50 characters" })
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug can only contain lowercase letters, numbers, and hyphens",
    })
    .refine((val) => !val.startsWith("-") && !val.endsWith("-"), {
      message: "Slug cannot start or end with a hyphen",
    })
    .refine((val) => !val.includes("--"), {
      message: "Slug cannot contain consecutive hyphens",
    }),

  content: z
    .string({ required_error: "Content is required" })
    .min(5, { message: "Content must be at least 5 characters long" })
    .max(10000, { message: "Content cannot exceed 10,000 characters" })
    .trim()
    .refine((val) => val.split(/\s+/).length >= 10, {
      message: "Content must contain at least 10 words",
    }),
});

const BlogQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Page must be a positive number",
    }),
  size: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 25))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Size must be a positive number",
    }),
  search: z.string().optional(),
});

export { BlogSchema, BlogQuerySchema };
