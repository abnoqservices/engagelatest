"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { GripVertical, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import Perview from "@/app/preview/page";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

/* ----------------------------------------------------
   ALL AVAILABLE SECTIONS (Master List)
---------------------------------------------------- */
const AVAILABLE_SECTIONS = [
  {
    section: "Header",
    label: "Header (Logo + Title)",
    fields: [
      { name: "logo", label: "Upload Logo", type: "image", required: true },
      { name: "title", label: "Site Title / Brand Name", type: "text", required: true },
    ],
  },
  {
    section: "slider",
    label: "Main Slider",
    fields: [{ name: "image", label: "Slider Image", type: "image", required: true }],
  },
  {
    section: "sliderTwo",
    label: "Secondary Slider",
    fields: [{ name: "image", label: "Image", type: "image", required: true }],
  },
  {
    section: "sliderThree",
    label: "Tertiary Slider",
    fields: [{ name: "image", label: "Image", type: "image", required: true }],
  },
  {
    section: "Description",
    label: "Description Block",
    fields: [
      { name: "heading", label: "Heading", type: "text", required: true },
      { name: "description", label: "Description Text", type: "textarea", required: true },
    ],
  },
  {
    section: "Specification",
    label: "Product Specifications",
    fields: [
      {
        name: "specifications",
        label: "Specification List",
        type: "repeater",
        fields: [
          { name: "label", label: "Title", type: "text", required: true },
          { name: "value", label: "Value", type: "text", required: true },
        ],
      },
    ],
  },
  {
    section: "YouTube",
    label: "YouTube Video",
    fields: [{ name: "videoUrl", label: "YouTube Embed URL", type: "url" }],
  },
  {
    section: "CTA",
    label: "Call to Action Button",
    fields: [
      { name: "ctaText", label: "Button Text", type: "text", required: true },
      { name: "ctaUrl", label: "Button URL", type: "url", required: true },
    ],
  },
  {
    section: "Social",
    label: "Social Links",
    fields: [
      { name: "facebook", label: "Facebook", type: "url" },
      { name: "instagram", label: "Instagram", type: "url" },
      { name: "youtube", label: "YouTube", type: "url" },
      { name: "twitter", label: "Twitter", type: "url" },
    ],
  },
  {
    section: "Contact",
    label: "Contact Information",
    fields: [
      { name: "phone", label: "Phone", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "address", label: "Address", type: "textarea" },
      { name: "directionButtonText", label: "Direction Button Text", type: "text" },
      { name: "directionUrl", label: "Direction URL", type: "url" },
    ],
  },
];

/* ----------------------------------------------------
   SORTABLE ITEM
---------------------------------------------------- */
function SortableItem({ item, onToggle, onRemove }: { item: any; onToggle: any; onRemove: any }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.section });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="flex items-center justify-between rounded-lg border p-4 bg-white shadow-sm"
    >
      <div className="flex items-center gap-3">
        <GripVertical
          className="h-5 w-5 cursor-grab text-muted-foreground"
          {...attributes}
          {...listeners}
        />
        <span className="font-medium">
          {AVAILABLE_SECTIONS.find(s => s.section === item.section)?.label || item.section}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Switch checked={item.enabled} onCheckedChange={() => onToggle(item.section)} />
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onRemove(item.section)}
          className="text-red-600 hover:bg-red-50"
        >
          Remove
        </Button>
      </div>
    </div>
  );
}

/* ----------------------------------------------------
   MAIN COMPONENT
---------------------------------------------------- */
export default function NewLandingPagePage() {
  const params = useParams();
  const isEditMode = Boolean(params?.id);

  // Active sections (what user has added)
  const [activeSections, setActiveSections] = React.useState<
    Array<{ section: string; enabled: boolean; fields: any[] }>
  >([
    // Default sections (you can start empty or with some defaults)
    { section: "Header", enabled: true, fields: AVAILABLE_SECTIONS.find(s => s.section === "Header")!.fields },
    { section: "Description", enabled: true, fields: AVAILABLE_SECTIONS.find(s => s.section === "Description")!.fields },
    { section: "CTA", enabled: true, fields: AVAILABLE_SECTIONS.find(s => s.section === "CTA")!.fields },
  ]);

  const [styles, setStyles] = React.useState({
    primaryColor: "#ecedf4ff",
    backgroundColor: "#000000",
    textColor: "#a97d38",
    headlineSize: 28,
    paragraphSize: 16,
  });

  const sensors = useSensors(useSensor(PointerSensor));

  // Add section from dropdown
  const handleAddSection = (sectionKey: string) => {
    if (activeSections.some(s => s.section === sectionKey)) return; // prevent duplicate

    const template = AVAILABLE_SECTIONS.find(s => s.section === sectionKey);
    if (template) {
      setActiveSections(prev => [
        ...prev,
        { section: template.section, enabled: true, fields: template.fields },
      ]);
    }
  };

  // Toggle enabled
  const toggleEnabled = (sectionKey: string) => {
    setActiveSections(prev =>
      prev.map(s => (s.section === sectionKey ? { ...s, enabled: !s.enabled } : s))
    );
  };

  // Remove section
  const removeSection = (sectionKey: string) => {
    setActiveSections(prev => prev.filter(s => s.section !== sectionKey));
  };

  // Drag end - reorder
  const onDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setActiveSections(prev => {
      const oldIndex = prev.findIndex(s => s.section === active.id);
      const newIndex = prev.findIndex(s => s.section === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const previewPayload = {
    userId: 1,
    templateName: "modern",
    sections: activeSections,
    styles,
  };

  // Get sections not yet added (for dropdown)
  const availableToAdd = AVAILABLE_SECTIONS.filter(
    s => !activeSections.some(active => active.section === s.section)
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 p-6">
        <h1 className="text-3xl font-bold">
          {isEditMode ? "Edit Landing Page" : "Create New Landing Page"}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Builder Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Sections</CardTitle>
                <CardDescription>Choose a section to add to your page</CardDescription>
              </CardHeader>
              <CardContent>
                <Select onValueChange={handleAddSection} disabled={availableToAdd.length === 0}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a section to add..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableToAdd.map(section => (
                      <SelectItem key={section.section} value={section.section}>
                        {section.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {availableToAdd.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-2">All sections have been added.</p>
                )}
              </CardContent>
            </Card>

            {/* Active Sections - Drag & Drop */}
            <Card>
              <CardHeader>
                <CardTitle>Page Sections</CardTitle>
                <CardDescription>Reorder, enable/disable, or remove sections</CardDescription>
              </CardHeader>
              <CardContent>
                {activeSections.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No sections added yet. Use the dropdown above to add sections.
                  </p>
                ) : (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                    <SortableContext
                      items={activeSections.map(s => s.section)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3">
                        {activeSections.map(item => (
                          <SortableItem
                            key={item.section}
                            item={item}
                            onToggle={toggleEnabled}
                            onRemove={removeSection}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </CardContent>
            </Card>

            {/* Styling Card (unchanged) */}
            <Card>
              <CardHeader>
                <CardTitle>Global Styling</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Same as your original styling controls */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <Label>Primary Color</Label>
                    <div className="flex items-center gap-3">
                      <Input type="color" className="w-16 h-10" value={styles.primaryColor}
                        onChange={e => setStyles({ ...styles, primaryColor: e.target.value })} />
                      <Input value={styles.primaryColor}
                        onChange={e => setStyles({ ...styles, primaryColor: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label>Background Color</Label>
                    <div className="flex items-center gap-3">
                      <Input type="color" className="w-16 h-10" value={styles.backgroundColor}
                        onChange={e => setStyles({ ...styles, backgroundColor: e.target.value })} />
                      <Input value={styles.backgroundColor}
                        onChange={e => setStyles({ ...styles, backgroundColor: e.target.value })} />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Text Color</Label>
                  <div className="flex items-center gap-3">
                    <Input type="color" className="w-16 h-10" value={styles.textColor}
                      onChange={e => setStyles({ ...styles, textColor: e.target.value })} />
                    <Input value={styles.textColor}
                      onChange={e => setStyles({ ...styles, textColor: e.target.value })} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <Label>Headline Size (px)</Label>
                    <Input type="number" value={styles.headlineSize}
                      onChange={e => setStyles({ ...styles, headlineSize: Number(e.target.value) })} />
                  </div>
                  <div>
                    <Label>Paragraph Size (px)</Label>
                    <Input type="number" value={styles.paragraphSize}
                      onChange={e => setStyles({ ...styles, paragraphSize: Number(e.target.value) })} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Mobile Preview */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Live Mobile Preview</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <div className="w-[360px] h-[720px] rounded-[45px] border-[14px] border-black bg-black overflow-hidden relative shadow-2xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-black rounded-b-3xl z-10"></div>
                <div className="w-[105%] h-full bg-white overflow-y-auto">
                  <Perview data={previewPayload} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* JSON Output (Optional - for debugging) */}
        <details className="mt-10">
          <summary className="cursor-pointer text-sm font-medium">View JSON Payload</summary>
          <pre className="mt-2 bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
            {JSON.stringify(previewPayload, null, 2)}
          </pre>
        </details>
      </div>
    </DashboardLayout>
  );
}