// src/components/form-builder/FormFieldEditor.tsx
"use client";

import { useEffect, useState } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Trash2, Plus, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { fieldSchema } from "@/lib/formSchema";
import axiosClient from "@/lib/axiosClient"
// Define the field type (you can move this to a shared types file)
type Field = {
  id: string;
  label: string;
  key: string;
  type: string;
  is_required: boolean;
  is_active: boolean;
  order: number;
  form_section_id: string;
  options?: Record<string, any>;
  rules?: Array<{ type: string; value?: string | number; message?: string }>;
  conditions?: any;
};

interface FormFieldEditorProps {
  fieldId: string;
  sectionId: string;           // passed from parent
  onUpdate?: (updatedField: Field) => void;  // ← NEW: callback to parent
}

const getAvailableRules = (fieldType: Field["type"]): { value: string; label: string }[] => {
  // ... (your existing function remains unchanged)
  // keep it as is
};

export default function FormFieldEditor({
  fieldId,
  sectionId,
  onUpdate,
}: FormFieldEditorProps) {
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // You'll need to fetch the current field data here.
  // Since we don't have useFormBuilder anymore, we can either:
  // A) Receive the field as prop (recommended)
  // B) Fetch it via API (not ideal for editor)
  // For now, assuming parent passes the full field object (see below)

  // Temporary placeholder — replace with real field data from props or context
  const initialField: Field = {
    id: fieldId,
    label: "Loading...",
    key: "",
    type: "text",
    is_required: false,
    is_active: true,
    order: 0,
    form_section_id: sectionId,
  };

  const form = useForm<Field>({
    resolver: zodResolver(fieldSchema),
    defaultValues: initialField,
  });

  const { fields: ruleFields, append, remove } = useFieldArray({
    control: form.control,
    name: "rules",
  });

  // This effect should reset form when fieldId changes
  // But since we don't have real selectedField, we'll simulate
  useEffect(() => {
    // In real implementation → fetch or get field from parent/context
    // For demo:
    form.reset(initialField);
    setSaveStatus("idle");
    setErrorMessage(null);
  }, [fieldId, form]);

  const onSubmit = async (data: Field) => {
    setSaveStatus("saving");
    setErrorMessage(null);

    try {
      // 1. Update local state in parent via callback (optimistic update)
      if (onUpdate) {
        onUpdate({
          ...data,
          id: fieldId,           // keep original id
          form_section_id: sectionId,
        });
      }

      // 2. Call real API (PUT /fields/{id})
      await axiosClient.put(`/fields/${fieldId}`, {
        label: data.label,
        key: data.key,
        is_required: data.is_required,
        is_active: data.is_active,
        options: data.options,
        rules: data.rules,
        conditions: data.conditions,
        // only send changed fields — or send all
      });

      setSaveStatus("success");
      toast({
        title: "Field updated",
        description: "Changes saved successfully.",
      });

      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err: any) {
      console.error(err);
      setSaveStatus("error");
      const msg = err.response?.data?.message || "Failed to update field";
      setErrorMessage(msg);
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
    }
  };

  const isChoiceField = ["select", "multi_select", "radio", "checkbox"].includes(form.watch("type"));

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Edit Field</CardTitle>
        <CardDescription>
          Type: <span className="font-medium capitalize">{form.watch("type")}</span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Status Alerts */}
            {saveStatus === "success" && (
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Saved successfully</AlertTitle>
                <AlertDescription>Field changes applied.</AlertDescription>
              </Alert>
            )}

            {saveStatus === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Save failed</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {/* Label & Key */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Used in form submission data</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Required Switch */}
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Required</FormLabel>
                <FormDescription>User must fill this field</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={form.watch("is_required")}
                  onCheckedChange={(v) => form.setValue("is_required", v)}
                />
              </FormControl>
            </FormItem>

            {/* Placeholder (if applicable) */}
            {["text", "textarea", "email", "number", "phone", "date", "time", "password", "select", "multi_select"].includes(
              form.watch("type")
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
            {/* Choices */}
            {isChoiceField && (
              <div className="space-y-4 border rounded-lg p-4 bg-muted/40">
                {/* ... keep your existing choices UI unchanged ... */}
              </div>
            )}

            {/* Rules Section – keep most of your code, just minor cleanup */}
            <div className="space-y-4 border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Validation Rules</Label>
                <Select
                  onValueChange={(ruleType) => {
                    if (ruleType === "required") {
                      form.setValue("is_required", true, { shouldValidate: true });
                    } else {
                      append({
                        type: ruleType,
                        value: ["min", "max", "minLength", "maxLength", "step"].includes(ruleType) ? "0" : "",
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
                                  <FormMessage />
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
                                      placeholder="e.g. Please enter at least 8 characters"
                                    />
                                  </FormControl>
                                  <FormMessage />
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
                    No custom rules added yet. Select from dropdown above.
                  </p>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={saveStatus === "saving" || form.formState.isSubmitting}
              >
                {saveStatus === "saving" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : saveStatus === "success" ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Saved!
                  </>
                ) : (
                  "Save Field Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}