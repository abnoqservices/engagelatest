// src/components/form-builder/QuickAddFieldButtons.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFormBuilder } from "@/hooks/useFormBuilder";
import { Field } from "@/types/form";

const fieldTypePresets = [
  { type: "text", label: "Text Input", icon: "T" },
  { type: "textarea", label: "Textarea", icon: "¶" },
  { type: "email", label: "Email", icon: "@" },
  { type: "password", label: "Password", icon: "🔒" }, // bonus
  { type: "number", label: "Number", icon: "#" },
  { type: "phone", label: "Phone", icon: "☎" },
  { type: "date", label: "Date", icon: "📅" },
  { type: "time", label: "Time", icon: "⏰" }, // bonus
  { type: "select", label: "Dropdown", icon: "▼" },
  { type: "multi_select", label: "Multi-Select", icon: "▼" },
  { type: "radio", label: "Radio Group", icon: "○" },
  { type: "checkbox", label: "Checkbox", icon: "☑" },
  { type: "file", label: "File Upload", icon: "↑" },
  { type: "image", label: "Image Upload", icon: "🖼" },
  { type: "rating", label: "Rating", icon: "★" },
  { type: "range", label: "Range Slider", icon: "↔" },
];

export default function QuickAddFieldButtons() {
  const { addField } = useFormBuilder();
  const [creating, setCreating] = useState<string | null>(null);

  const generateKeyFromLabel = (label: string) => {
    return (
      label
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "") + `_${Date.now().toString(36).slice(-4)}`
    ); // added tiny random to avoid collision
  };

  const createDraftField = (type: string, displayLabel: string) => {
    setCreating(type);

    const defaultLabel = `New ${displayLabel}`;
    const key = generateKeyFromLabel(defaultLabel);

    const baseField: Field = {
      id: `draft-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      form_section_id: null, // adjust if using sections
      label: defaultLabel,
      key,
      type: type as Field["type"],
      is_required: false,
      is_active: true,
      order: 999,
      options: {},
      rules: [],
      conditions: null,
    };

    // ── Type-specific defaults ───────────────────────────────────────────────
    if (["select", "multi_select", "radio"].includes(type)) {
      baseField.options = {
        choices: ["Option 1", "Option 2", "Option 3", "Option 4"],
        placeholder: type === "multi_select" ? "Select options..." : undefined,
      };
      if (type === "multi_select") {
        baseField.options.multiple = true;
      }
    } else if (type === "checkbox") {
      baseField.options = {
        choices: ["Yes", "No"],
        multiple: true,
      };
    } else if (type === "rating") {
      baseField.options = { min: 1, max: 5, step: 1 };
      baseField.rules = [
        { type: "min", value: 1, message: "Minimum rating is 1" },
        { type: "max", value: 5, message: "Maximum rating is 5" },
      ];
    } else if (type === "range") {
      baseField.options = { min: 0, max: 100, step: 5 };
      baseField.rules = [
        { type: "min", value: 0 },
        { type: "max", value: 100 },
      ];
    } else if (type === "file") {
      baseField.options = {
        max_size: 5242880, // 5 MB in bytes
        allowed_types: ["pdf", "doc", "docx", "txt", "jpg", "png"],
        multiple: false,
      };
    } else if (type === "image") {
      baseField.options = {
        max_size: 5242880, // 5 MB
        allowed_types: ["jpg", "jpeg", "png", "gif", "webp"],
        multiple: false,
      };
    } else if (type === "email") {
      baseField.options = { placeholder: "name@example.com" };
      baseField.rules = [{ type: "email", message: "Invalid email address" }];
    } else if (type === "number") {
      baseField.options = { placeholder: "Enter a number" };
    } else if (type === "phone") {
      baseField.options = { placeholder: "+1 (555) 000-0000" };
    } else if (type === "password") {
      baseField.options = { placeholder: "••••••••" };
    }

    addField("main", baseField); // ← change "main" to dynamic section if needed

    setTimeout(() => setCreating(null), 600); // fake delay for better UX
  };

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Add Field</CardTitle>
        <CardDescription>Choose a field type to add instantly</CardDescription>
      </CardHeader>

      <CardContent className="p-3">
        <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
          {fieldTypePresets.map((item) => (
            <Button
              key={item.type}
              variant="ghost"
              className={`
                w-full justify-between 
                h-12 px-4 text-left 
                hover:bg-muted/60 
                transition-colors
                ${creating === item.type ? "bg-muted/40 animate-pulse" : ""}
              `}
              onClick={() => createDraftField(item.type, item.label)}
              disabled={creating !== null}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl opacity-80 w-6 text-center">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>

              {creating === item.type ? (
                <span className="text-xs text-muted-foreground">adding...</span>
              ) : (
                <ChevronRight className="h-4 w-4 opacity-60" />
              )}
            </Button>
          ))}
        </div>

        <div className="mt-4 text-xs text-center text-muted-foreground">
          Click any field type → edit details / validation after adding
        </div>
      </CardContent>
    </Card>
  );
}