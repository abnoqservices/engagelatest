// src/components/form-builder/FormFieldEditor.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Trash2, Plus } from "lucide-react";
import { useFormBuilder } from "@/hooks/useFormBuilder";
import { Field } from "@/types/form";
import { fieldSchema } from "@/lib/formSchema";

interface FormFieldEditorProps {
  fieldId: string;
}

export default function FormFieldEditor({ fieldId }: FormFieldEditorProps) {
  const { form: builderForm, updateField } = useFormBuilder();

  const selectedField = builderForm.sections
    .flatMap((sec) => sec.fields)
    .find((f) => f.id === fieldId);

  if (!selectedField) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-10 text-muted-foreground">
            No field selected
          </div>
        </CardContent>
      </Card>
    );
  }

  const form = useForm<Partial<Field>>({
    resolver: zodResolver(fieldSchema),
    defaultValues: selectedField,
  });

  useEffect(() => {
    form.reset(selectedField);
  }, [selectedField, form]);

  const onSubmit = (data: Partial<Field>) => {
    updateField(fieldId, data);
  };

  const isChoiceField = ["select", "multi_select", "radio", "checkbox"].includes(selectedField.type);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Field</CardTitle>
        <CardDescription>Type: {selectedField.type}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Label */}
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Key */}
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key (unique identifier)</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Required */}
            <FormItem className="flex items-center justify-between">
              <div>
                <FormLabel>Required</FormLabel>
                <FormDescription>User must fill this field</FormDescription>
              </div>
              <Switch
                checked={form.watch("is_required") ?? false}
                onCheckedChange={(checked) => form.setValue("is_required", checked)}
              />
            </FormItem>

            {/* Choices – dynamic add/remove */}
            {isChoiceField && (
              <FormItem className="space-y-3">
                <FormLabel>Choices</FormLabel>
                <div className="space-y-2">
                  {(form.watch("options.choices") as string[] ?? []).map((choice, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        value={choice}
                        onChange={(e) => {
                          const choices = [...(form.watch("options.choices") as string[])];
                          choices[idx] = e.target.value;
                          form.setValue("options.choices", choices);
                        }}
                        placeholder={`Choice ${idx + 1}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const choices = (form.watch("options.choices") as string[]).filter(
                            (_, i) => i !== idx
                          );
                          form.setValue("options.choices", choices);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const current = form.watch("options.choices") as string[] ?? [];
                    form.setValue("options.choices", [...current, `Choice ${current.length + 1}`]);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Choice
                </Button>
                <FormDescription>
                  Define the available options for this field.
                </FormDescription>
              </FormItem>
            )}

            {/* Multiple selection */}
            {["select", "multi_select"].includes(selectedField.type) && (
              <FormItem className="flex items-center justify-between">
                <div>
                  <FormLabel>Allow multiple selections</FormLabel>
                  <FormDescription>
                    {selectedField.type === "multi_select"
                      ? "Always enabled for multi-select"
                      : "Allow users to pick more than one option"}
                  </FormDescription>
                </div>
                <Switch
                  checked={form.watch("options.multiple") ?? selectedField.type === "multi_select"}
                  onCheckedChange={(checked) => form.setValue("options.multiple", checked)}
                  disabled={selectedField.type === "multi_select"}
                />
              </FormItem>
            )}

            {/* Placeholder */}
            {["text", "textarea", "email", "number", "phone", "date", "select", "multi_select"].includes(
              selectedField.type
            ) && (
              <FormField
                control={form.control}
                name="options.placeholder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placeholder</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}