import { z } from "zod";
import { Field } from "@/types/form";   // ← make sure this type includes rules

type Rule = {
  type: string;
  value?: string | number;
  message?: string;
};

export function buildFormValidationSchema(fields: Field[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    let schema: z.ZodTypeAny;

    // 1. Base type according to field.type
    switch (field.type) {
      case "text":
      case "textarea":
      case "email":
      case "password":
      case "tel":
      case "url":
        schema = z.string();
        break;

      case "number":
      case "range":
        schema = z.number({ invalid_type_error: "Must be a number" });
        break;

      case "checkbox":
      case "switch":
        schema = z.boolean();
        break;

      case "select":
      case "radio":
        schema = z.string();
        break;

      case "multi_select":
        schema = z.array(z.string());
        break;

      // Add more types as needed (date, file, etc.)
      default:
        schema = z.any();
    }

    // 2. Apply "required" (is_required)
    if (field.is_required) {
      if (schema instanceof z.ZodString) {
        schema = schema.min(1, { message: "This field is required" });
      } else if (schema instanceof z.ZodNumber) {
        schema = schema.refine((v) => v !== undefined && v !== null, {
          message: "This field is required",
        });
      } else if (schema instanceof z.ZodArray) {
        schema = schema.min(1, { message: "At least one item is required" });
      } else if (schema instanceof z.ZodBoolean) {
        schema = schema.refine((v) => v === true, {
          message: "This must be checked",
        });
      }
    }

    // 3. Apply custom rules array
    if (field.rules && Array.isArray(field.rules)) {
      for (const rule of field.rules as Rule[]) {
        const msg = rule.message || `${rule.type} validation failed`;

        switch (rule.type) {
          case "minLength":
            if (schema instanceof z.ZodString) {
              schema = schema.min(Number(rule.value), { message: msg });
            }
            break;

          case "maxLength":
            if (schema instanceof z.ZodString) {
              schema = schema.max(Number(rule.value), { message: msg });
            }
            break;

          case "min":
            if (schema instanceof z.ZodNumber) {
              schema = schema.min(Number(rule.value), { message: msg });
            }
            break;

          case "max":
            if (schema instanceof z.ZodNumber) {
              schema = schema.max(Number(rule.value), { message: msg });
            }
            break;

          case "email":
            if (schema instanceof z.ZodString) {
              schema = schema.email({ message: msg || "Invalid email" });
            }
            break;

          case "url":
            if (schema instanceof z.ZodString) {
              schema = schema.url({ message: msg || "Invalid URL" });
            }
            break;

          case "regex":
          case "pattern":
            if (schema instanceof z.ZodString && rule.value) {
              try {
                const regex = new RegExp(rule.value as string);
                schema = schema.regex(regex, { message: msg });
              } catch (e) {
                console.warn("Invalid regex pattern:", rule.value);
              }
            }
            break;

          // Add more rule types as you need (equals, includes, etc.)
          default:
            console.warn(`Unsupported rule type: ${rule.type}`);
        }
      }
    }

    // Optional: trim strings by default (good UX)
    if (schema instanceof z.ZodString) {
      schema = schema.trim();
    }

    shape[field.key] = schema;
  }

  return z.object(shape);
}