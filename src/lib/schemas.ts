import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, { message: "Password is required." }),
});

export const ideaSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters." })
    .max(100),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." })
    .max(1000),
  presentation_link: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .optional()
    .or(z.literal("")),
  problem_statement: z
    .string()
    .min(1, { message: "Please select a problem statement." }),
});

export const projectSchema = z.object({
  title: z.string().min(3, { message: "Project name is required." }),
  description: z.string().min(10, { message: "Description is required." }),
  github_link: z.string().url({ message: "A valid GitHub URL is required." }),
  figma_link: z
    .string()
    .url({ message: "Please enter a valid Figma URL." })
    .optional()
    .or(z.literal("")),
  presentation_link: z
    .string()
    .url({ message: "Please enter a valid Presentation URL." })
    .optional()
    .or(z.literal("")),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
export type IdeaFormData = z.infer<typeof ideaSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
