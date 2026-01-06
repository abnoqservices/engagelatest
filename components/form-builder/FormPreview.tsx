// src/components/form-builder/FormPreview.tsx
"use client";

import { FormProvider, useForm } from "react-hook-form";
import FieldRenderer from "./FieldRenderer";
import { Button } from "@/components/ui/button";
import { useFormBuilder } from "@/hooks/useFormBuilder";

export default function FormPreview() {
  const { form: builderForm } = useFormBuilder();

  const methods = useForm({
    mode: "onChange",
    // You can generate full Zod schema here later if needed
  });

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    // → send to backend / show success
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
        {builderForm.sections.map((section) => (
          <div key={section.id} className="space-y-6">
            <h3 className="text-xl font-semibold">{section.title}</h3>
            {section.fields
              .sort((a, b) => a.order - b.order)
              .map((field) => (
                <FieldRenderer key={field.id} field={field} mode="preview" />
              ))}
          </div>
        ))}

        <Button type="submit" className="mt-6">
          Submit Form
        </Button>
      </form>
    </FormProvider>
  );
}