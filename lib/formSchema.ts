// src/lib/formSchema.ts
import { z } from "zod";

export const fieldSchema = z.object({
  label: z.string().min(1, "Label is required"),
  key: z.string().min(1, "Key is required"),
  is_required: z.boolean(),
  options: z.record(z.any()), // More specific per type in form
  // Add more as needed
});

// Extend for type-specific, but for simplicity, use dynamic