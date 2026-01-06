// src/components/form-builder/FormFieldEditor.tsx
"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { useFormBuilder } from "@/hooks/useFormBuilder";
import { Field, FieldRule } from "@/types/form";
import { fieldSchema } from "@/lib/formSchema";

interface FormFieldEditorProps {
  fieldId: string;
}

// Define available rule types per field type
const getAvailableRules = (fieldType: Field["type"]): { value: string; label: string }[] => {
  switch (fieldType) {
    case "text":
    case "textarea":
      return [
        { value: "required", label: "Required" },
        { value: "minLength", label: "Minimum Length" },
        { value: "maxLength", label: "Maximum Length" },
        { value: "pattern", label: "Pattern (Regex)" },
      ];
    case "email":
      return [
        { value: "required", label: "Required" },
        { value: "minLength", label: "Minimum Length" },
        { value: "maxLength", label: "Maximum Length" },
        { value: "pattern", label: "Pattern (Regex)" },
        { value: "email", label: "Valid Email" },
      ];
    case "number":
    case "range":
      return [
        { value: "required", label: "Required" },
        { value: "min", label: "Minimum Value" },
        { value: "max", label: "Maximum Value" },
        { value: "step", label: "Step" },
      ];
    case "phone":
      return [
        { value: "required", label: "Required" },
        { value: "minLength", label: "Minimum Length (e.g. 10)" },
        { value: "maxLength", label: "Maximum Length" },
        { value: "pattern", label: "Pattern (Regex)" },
      ];
    case "password":
      return [
        { value: "required", label: "Required" },
        { value: "minLength", label: "Minimum Length (e.g. 8)" },
        { value: "maxLength", label: "Maximum Length" },
      ];
    case "date":
    case "time":
      return [
        { value: "required", label: "Required" },
      ];
    case "select":
    case "multi_select":
    case "radio":
    case "checkbox":
      return [
        { value: "required", label: "Required" },
      ];
    case "file":
    case "image":
      return [
        { value: "required", label: "Required" },
      ];
    case "rating":
      return [
        { value: "required", label: "Required" },
        { value: "min", label: "Minimum Rating" },
        { value: "max", label: "Maximum Rating" },
      ];
    default:
      return [{ value: "required", label: "Required" }];
  }
};

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
            No field selected or field not found
          </div>
        </CardContent>
      </Card>
    );
  }

  const form = useForm<Field>({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      ...selectedField,
      rules: selectedField.rules || [],
      options: selectedField.options || {},
    },
  });

  const { fields: ruleFields, append, remove } = useFieldArray({
    control: form.control,
    name: "rules",
  });

  useEffect(() => {
    form.reset(selectedField);
  }, [selectedField, form]);

  const onSubmit = (data: Field) => {
    updateField(fieldId, data);
    // Optional: show toast notification "Field updated"
  };

  const isChoiceField = ["select", "multi_select", "radio", "checkbox"].includes(selectedField.type);
  const availableRules = getAvailableRules(selectedField.type);

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Edit Field</CardTitle>
        <CardDescription>
          Type: <span className="font-medium capitalize">{selectedField.type}</span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* Basic fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label *</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

             
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key (identifier) *</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormDescription>Used in form data (no spaces/special chars)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
            {/* Required switch */}
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Required field</FormLabel>
                <FormDescription>
                  User must provide a value to submit the form
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={form.watch("is_required")}
                  onCheckedChange={(checked) => form.setValue("is_required", checked)}
                />
              </FormControl>
            </FormItem>

            {/* Placeholder (for supported types) */}
            {["text", "textarea", "email", "number", "phone", "date", "time", "password", "select", "multi_select"].includes(
              selectedField.type
            ) && (
              <FormField
                control={form.control}
                name="options.placeholder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placeholder text</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} placeholder="e.g. Enter your name..." />
                    </FormControl>
                    <FormDescription>Hint shown when field is empty</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Choices for select/radio/etc */}
            {isChoiceField && (
              <div className="space-y-4 border rounded-lg p-4 bg-muted/40">
                <div className="flex items-center justify-between">
                  <Label>Choices</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const current = form.getValues("options.choices") || [];
                      form.setValue("options.choices", [...current, `Option ${current.length + 1}`]);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add
                  </Button>
                </div>

                {(form.watch("options.choices") as string[] ?? []).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <FormField
                      control={form.control}
                      name={`options.choices.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input {...field} placeholder={`Option ${index + 1}`} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const current = form.getValues("options.choices") || [];
                        form.setValue(
                          "options.choices",
                          current.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {form.watch("options.choices")?.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    Add at least one option
                  </p>
                )}
              </div>
            )}

            {/* Rules Section */}
            <div className="space-y-4 border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Validation Rules</Label>
                <Select
                  onValueChange={(ruleType) => {
                    if (ruleType === "required") {
                      form.setValue("is_required", true);
                    } else {
                      append({
                        type: ruleType,
                        value: ruleType.includes("min") || ruleType.includes("max") ? 0 : "",
                        message: "",
                      });
                    }
                  }}
                >
                  <SelectTrigger className="w-[180px] h-8">
                    <SelectValue placeholder="Add rule..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRules.map((rule) => (
                      <SelectItem
                        key={rule.value}
                        value={rule.value}
                        disabled={rule.value === "required" && form.watch("is_required")}
                      >
                        {rule.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {ruleFields.map((ruleField, index) => {
                  const ruleType = form.watch(`rules.${index}.type`);
                  const isRequiredRule = ruleType === "required";

                  return (
                    <div
                      key={ruleField.id}
                      className="flex flex-col sm:flex-row gap-3 items-start sm:items-end border rounded-md p-3 bg-background"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                          {ruleType}
                        </div>

                        {isRequiredRule ? (
                          <div className="flex items-center space-x-2 pt-1">
                            <Switch
                              checked={form.watch("is_required")}
                              onCheckedChange={(checked) => form.setValue("is_required", checked)}
                            />
                            <Label>Required field</Label>
                          </div>
                        ) : (
                          <>
                            <FormField
                              control={form.control}
                              name={`rules.${index}.value`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm">Value</FormLabel>
                                  <FormControl>
                                    <Input
                                      type={["min", "max", "minLength", "maxLength", "step"].includes(ruleType) ? "number" : "text"}
                                      {...field}
                                      value={field.value ?? ""}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`rules.${index}.message`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm">Error Message</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      value={field.value ?? ""}
                                      placeholder="e.g. Password must be at least 8 characters"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </>
                        )}
                      </div>

                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 mt-6 sm:mt-0"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}

                {ruleFields.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No rules added yet. Use the dropdown above to add validation.
                  </p>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Field Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}