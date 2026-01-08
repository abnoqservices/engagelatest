// src/components/form-builder/FormPreview.tsx
"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import FieldRenderer from "./FieldRenderer";
import { useFormBuilder } from "@/hooks/useFormBuilder";
import { Field } from "@/types/form";
import { useState } from "react";
import { buildFormValidationSchema } from "@/lib/buildFormValidationSchema";

// Helper: Generate default values based on field type
const getDefaultValue = (field: Field): any => {
  switch (field.type) {
    case "multi_select":
    case "checkbox":
      return [];
    case "select":
    case "radio":
      return "";
    case "number":
    case "range":
    case "rating":
      return field.options?.min ?? 0;
    case "file":
    case "image":
      return null;
    case "textarea":
      return "";
    default:
      return "";
  }
};

// Helper: Build defaultValues object from all fields
const generateDefaultValues = (fields: Field[]) => {
  return fields.reduce((acc, field) => {
    acc[field.key] = getDefaultValue(field);
    return acc;
  }, {} as Record<string, any>);
};

export default function FormPreview() {
  const { form: builderForm } = useFormBuilder();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Flatten all fields from all sections
  const allFields = builderForm.sections.flatMap((section) => section.fields);
  const schema = buildFormValidationSchema(allFields);

  const methods = useForm({
    mode: "onChange",
    defaultValues: generateDefaultValues(allFields),
    resolver: zodResolver(schema),
    reValidateMode: "onChange",
  });

  const {
    handleSubmit,
    formState: { isSubmitting: formIsSubmitting, isSubmitted, isValid, errors },
  } = methods;

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);

    try {
      console.log("Form submitted with values:", data);

      // TODO: Replace with real API call
      // await api.submitForm(data);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setSubmitSuccess(true);
      methods.reset(); // Optional: reset form after success
    } catch (err) {
      console.error("Submission error:", err);
      setSubmitError("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasFields = allFields.length > 0;

  // Check if there are any validation errors after submit attempt
  const hasValidationErrors = isSubmitted && !isValid;
console.log("Validation errors:", hasValidationErrors);
  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <Card className="border-2 shadow-lg">
        <CardHeader className="pb-6 border-b">
          <CardTitle className="text-2xl font-bold">
            {builderForm.title || "Form Preview"}
          </CardTitle>
          {builderForm.description && (
            <CardDescription className="text-base mt-2">
              {builderForm.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="pt-8">
          {!hasFields ? (
            <div className="py-12 text-center text-muted-foreground">
              <Alert variant="default" className="max-w-md mx-auto">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>No fields yet</AlertTitle>
                <AlertDescription className="mt-2">
                  Add some fields using the builder panel on the left to see them here.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                {builderForm.sections.map((section) => (
                  <section key={section.id} className="space-y-6">
                    {section.title && (
                      <h3 className="text-xl font-semibold tracking-tight border-b pb-2">
                        {section.title}
                      </h3>
                    )}

                    {section.description && (
                      <p className="text-muted-foreground text-sm">
                        {section.description}
                      </p>
                    )}

                    <div className="space-y-8">
                      {section.fields
                        .sort((a, b) => a.order - b.order)
                        .map((field) => (
                          <div
                            key={field.id}
                            className="transition-all duration-200"
                          >
                            <FieldRenderer field={field} mode="preview" />
                          </div>
                        ))}
                    </div>
                  </section>
                ))}

                {/* Global validation error message */}
                {hasValidationErrors && (
                  <Alert variant="destructive" className="mt-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Form has errors</AlertTitle>
                    <AlertDescription>
                      Please check the highlighted fields and correct them before
                      submitting.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Success / Server error messages */}
                {submitSuccess && (
                  <Alert className="mt-6 bg-green-50 border-green-200 text-green-800">
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>
                      Form submitted successfully.
                    </AlertDescription>
                  </Alert>
                )}

                {submitError && (
                  <Alert variant="destructive" className="mt-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}

                <div className="pt-6 border-t">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full sm:w-auto min-w-[180px]"
                    disabled={
                      isSubmitting ||
                      formIsSubmitting ||
                      (isSubmitted && !isValid)
                    }
                  >
                    {isSubmitting || formIsSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Form"
                    )}
                  </Button>
                </div>
              </form>
            </FormProvider>
          )}
        </CardContent>

        <CardFooter className="text-xs text-muted-foreground border-t pt-4">
          Preview mode • Data is not saved •{" "}
          {new Date().toLocaleDateString()}
        </CardFooter>
      </Card>
    </div>
  );
}