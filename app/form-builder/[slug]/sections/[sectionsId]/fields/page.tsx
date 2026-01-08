// src/app/form-builder/[formId]/sections/[sectionId]/fields/page.tsx
"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Save, ArrowLeft } from "lucide-react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import QuickAddFieldButtons from "@/components/form-builder/QuickAddFieldButtons";
import SortableFieldItem from "@/components/form-builder/SortableFieldItem";
import FormFieldEditor from "@/components/form-builder/FormFieldEditor";
import FormPreview from "@/components/form-builder/FormPreview";
import { showToast } from "@/lib/showToast";
import axiosClient from "@/lib/axiosClient";

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
  rules?: any[];
  conditions?: any;
};

export default function SectionFieldsPage() {
  const params = useParams();
  const router = useRouter();

  const formId = params.slug as string;
  const sectionId = params.sectionsId as string;

  const [fields, setFields] = React.useState<Field[]>([]);
  const [sectionTitle, setSectionTitle] = React.useState<string>("");
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [selectedFieldId, setSelectedFieldId] = React.useState<string | null>(null);

  // Load fields for this specific section
  React.useEffect(() => {
 
    if (!formId || !sectionId) {
      showToast("Missing form ID or section ID", "error");
      setLoading(false);
      return;
    }

    async function loadSectionFields() {
      try {
        // We use the form endpoint which includes sections + fields
        const res = await axiosClient.get(`/forms/${formId}`);
        const data = res.data;

        if (data.success && data.data?.sections) {
          const section = data.data.sections.find(
            (s: any) => String(s.id) === sectionId
          );

          if (section) {
            setSectionTitle(section.title || "Untitled Section");
            setFields(
              (section.fields || []).map((f: any) => ({
                id: String(f.id),
                label: f.label || "",
                key: f.key || "",
                type: f.type || "text",
                is_required: !!f.is_required,
                is_active: !!f.is_active,
                order: Number(f.order ?? 0),
                form_section_id: String(f.form_section_id),
                options: f.options || {},
                rules: f.rules || [],
                conditions: f.conditions || null,
              }))
            );
          } else {
            showToast("Section not found in this form", "error");
          }
        } else {
          showToast(data.message || "Failed to load form data", "error");
        }
      } catch (err: any) {
        console.error(err);
        showToast(err.response?.data?.message || "Could not load fields", "error");
      } finally {
        setLoading(false);
      }
    }

    loadSectionFields();
  }, [formId, sectionId]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);

    const newFields = arrayMove(fields, oldIndex, newIndex).map((f, idx) => ({
      ...f,
      order: idx,
    }));

    setFields(newFields);
  };

  const handleAddField = async (fieldType: string) => {
    if (!formId || !sectionId) return;

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    const newField: Field = {
      id: tempId,
      label: `New ${fieldType}`,
      key: `field_${fields.length + 1}`,
      type: fieldType,
      is_required: false,
      is_active: true,
      order: fields.length,
      form_section_id: sectionId,
      options: fieldType === "select" || fieldType === "multi_select" ? { choices: [] } : {},
      rules: [],
      conditions: null,
    };

    setFields([...fields, newField]);
    setSelectedFieldId(tempId);
    showToast(`Added new ${fieldType} field`, "success");
  };

  const handleSave = async () => {
    if (!formId || !sectionId) {
      showToast("Cannot save: missing IDs", "error");
      return;
    }

    setSaving(true);

    try {
      let createdCount = 0;

      // Sort fields by current order before saving
      const sortedFields = [...fields].sort((a, b) => a.order - b.order);

      for (const field of sortedFields) {
        const payload = {
          form_section_id: sectionId,
          label: field.label.trim() || "Untitled Field",
          key: field.key.trim() || `field_${field.order + 1}`,
          type: field.type,
          options: field.options || {},
          rules: field.rules || [],
          conditions: field.conditions || null,
          order: field.order,
          is_required: field.is_required,
          is_active: field.is_active,
        };

        if (field.id.startsWith("temp-")) {
          // Create new field
          const res = await axiosClient.post(`/forms/${formId}/fields`, payload);
          const newId = res.data.data?.id;
          if (newId) {
            // Update local id
            setFields((prev) =>
              prev.map((f) => (f.id === field.id ? { ...f, id: String(newId) } : f))
            );
            createdCount++;
          }
        } else {
          // Update existing field (only changed properties if you want, but sending all is fine)
          await axiosClient.put(`/fields/${field.id}`, payload);
        }
      }

      showToast(
        createdCount > 0
          ? `Saved! ${createdCount} new field${createdCount > 1 ? "s" : ""} created`
          : "Fields saved successfully",
        "success"
      );
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to save fields", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-screen items-center justify-center">
          {/* <Spinner className="h-8 w-8" /> */}
          <span className="ml-3">Loading section fields...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Fields • {sectionTitle}
                </h1>
                <p className="text-sm text-muted-foreground">Form #{formId}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Preview</span>
              </Button>
              <Button
                size="sm"
                className="gap-1.5"
                onClick={handleSave}
                disabled={saving || fields.length === 0}
              >
                {saving ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                {saving ? "Saving..." : "Save Fields"}
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          <Tabs defaultValue="builder" className="space-y-6">
            <TabsList className="inline-flex h-10 w-full max-w-md mx-auto border bg-muted/40 backdrop-blur-sm rounded-lg p-1">
              <TabsTrigger value="builder" className="flex-1">
                Builder
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex-1">
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="builder">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Toolbox */}
                <div className="md:col-span-3">
                  <QuickAddFieldButtons onAddField={handleAddField} />
                </div>

                {/* Canvas */}
                <div className="md:col-span-5">
                  <div className="bg-card border rounded-xl p-6 min-h-[70vh]">
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                        {fields.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-[50vh] text-center text-muted-foreground">
                            <p className="text-lg font-medium mb-2">This section is empty</p>
                            <p className="text-sm">Add fields using the toolbox on the left</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {fields.map((field) => (
                              <SortableFieldItem
                                key={field.id}
                                field={field}
                                isSelected={selectedFieldId === field.id}
                                onSelect={() => setSelectedFieldId(field.id)}
                              />
                            ))}
                          </div>
                        )}
                      </SortableContext>
                    </DndContext>
                  </div>
                </div>

                {/* Editor */}
                <div className="md:col-span-4">
                  <div className="bg-card border rounded-xl p-5 sticky md:top-6">
                    {selectedFieldId ? (
                      <FormFieldEditor
                        fieldId={selectedFieldId}
                        sectionId={sectionId}
                        onUpdate={(updatedField) => {
                          setFields(prev =>
                            prev.map(f => f.id === updatedField.id ? updatedField : f)
                          );
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                        <p className="text-base font-medium mb-2">No field selected</p>
                        <p className="text-sm">Click a field to edit its properties</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview">
              <div className="bg-card border rounded-xl p-6 min-h-[70vh]">
               {/* or limit to section */}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </DashboardLayout>
  );
}