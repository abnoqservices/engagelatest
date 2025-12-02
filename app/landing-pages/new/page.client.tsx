"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { GripVertical } from "lucide-react";
import { useParams } from "next/navigation";

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

// Preview client-only
const Perview = dynamic(() => import("@/app/preview/page"), {
  ssr: false,
});

/* ----------------------------------------------------
   ALL AVAILABLE SECTIONS
---------------------------------------------------- */
const AVAILABLE_SECTIONS = [
  { section: "Header", label: "Header (Logo + Title)", fields: [
    { name: "logo", label: "Upload Logo", type: "image", required: true },
    { name: "title", label: "Site Title / Brand Name", type: "text", required: true }
  ]},

  { section: "slider", label: "Main Slider", fields: [
    { name: "image", label: "Slider Image", type: "image", required: true }
  ]},

  { section: "sliderTwo", label: "Secondary Slider", fields: [
    { name: "image", label: "Image", type: "image", required: true }
  ]},

  { section: "sliderThree", label: "Tertiary Slider", fields: [
    { name: "image", label: "Image", type: "image", required: true }
  ]},

  { section: "Description", label: "Description Block", fields: [
    { name: "heading", label: "Heading", type: "text", required: true },
    { name: "description", label: "Description Text", type: "textarea", required: true },
  ]},

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

  { section: "YouTube", label: "YouTube Video", fields: [
    { name: "videoUrl", label: "YouTube Embed URL", type: "url" }
  ]},

  { section: "CTA", label: "Call to Action Button", fields: [
    { name: "ctaText", label: "Button Text", type: "text", required: true },
    { name: "ctaUrl", label: "Button URL", type: "url", required: true },
  ]},

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
    label: "Contact Info",
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
function SortableItem({ item, onToggle, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.section });

  // prevent hydration mismatch
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const style = {
    transform: mounted && transform ? CSS.Transform.toString(transform) : undefined,
    transition: mounted ? transition : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between rounded-lg border p-4 bg-white shadow-sm"
    >
      <div className="flex items-center gap-3">
        <GripVertical className="h-5 w-5 cursor-grab" {...attributes} {...listeners} />
        <span className="font-medium">
          {AVAILABLE_SECTIONS.find(s => s.section === item.section)?.label}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Switch checked={item.enabled} onCheckedChange={() => onToggle(item.section)} />
        <Button size="sm" variant="ghost" onClick={() => onRemove(item.section)}>
          Remove
        </Button>
      </div>
    </div>
  );
}

/* ----------------------------------------------------
   MAIN BUILDER (CLIENT ONLY)
---------------------------------------------------- */
export default function NewLandingPagePage() {
  const params = useParams();
  const isEditMode = Boolean(params?.id);

  const [activeSections, setActiveSections] = React.useState([
    { section: "Header", enabled: true, fields: AVAILABLE_SECTIONS.find(s => s.section === "Header").fields },
    { section: "Description", enabled: true, fields: AVAILABLE_SECTIONS.find(s => s.section === "Description").fields },
    { section: "CTA", enabled: true, fields: AVAILABLE_SECTIONS.find(s => s.section === "CTA").fields },
  ]);

  const [styles, setStyles] = React.useState({
    primaryColor: "#ecedf4ff",
    backgroundColor: "#000000",
    textColor: "#a97d38",
    headlineSize: 28,
    paragraphSize: 16,
  });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const handleAddSection = (sectionKey) => {
    if (activeSections.some(s => s.section === sectionKey)) return;
    const template = AVAILABLE_SECTIONS.find(s => s.section === sectionKey);

    setActiveSections(prev => [...prev, {
      section: template.section,
      enabled: true,
      fields: template.fields,
    }]);
  };

  const toggleEnabled = (key) =>
    setActiveSections(prev => prev.map(s =>
      s.section === key ? { ...s, enabled: !s.enabled } : s
    ));

  const removeSection = (key) =>
    setActiveSections(prev => prev.filter(s => s.section !== key));

  const onDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    setActiveSections((prev) => {
      const oldIndex = prev.findIndex((s) => s.section === active.id);
      const newIndex = prev.findIndex((s) => s.section === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const previewPayload = {
    templateName: "modern",
    sections: activeSections,
    styles,
  };

  const availableToAdd = AVAILABLE_SECTIONS.filter(
    (s) => !activeSections.some((a) => a.section === s.section)
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 p-6">
        <h1 className="text-3xl font-bold">
          {isEditMode ? "Edit Landing Page" : "Create New Landing Page"}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT */}
          <div className="space-y-6">
            {/* Add Sections */}
            <Card>
              <CardHeader>
                <CardTitle>Add Sections</CardTitle>
                <CardDescription>Select a section to add</CardDescription>
              </CardHeader>

              <CardContent>
                <Select onValueChange={handleAddSection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select section..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableToAdd.map((s) => (
                      <SelectItem key={s.section} value={s.section}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Drag & Drop */}
            <Card>
              <CardHeader>
                <CardTitle>Page Sections</CardTitle>
                <CardDescription>Reorder sections</CardDescription>
              </CardHeader>

              <CardContent>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                  <SortableContext
                    items={activeSections.map((s) => s.section)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {activeSections.map((item) => (
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
              </CardContent>
            </Card>

            {/* Styling */}
            <Card>
              <CardHeader><CardTitle>Global Styling</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <Label>Primary Color</Label>
                    <Input
                      type="color"
                      value={styles.primaryColor}
                      onChange={(e) => setStyles({ ...styles, primaryColor: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>Background Color</Label>
                    <Input
                      type="color"
                      value={styles.backgroundColor}
                      onChange={(e) => setStyles({ ...styles, backgroundColor: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Text Color</Label>
                  <Input
                    type="color"
                    value={styles.textColor}
                    onChange={(e) => setStyles({ ...styles, textColor: e.target.value })}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <Label>Headline Size</Label>
                    <Input
                      type="number"
                      value={styles.headlineSize}
                      onChange={(e) => setStyles({ ...styles, headlineSize: +e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>Paragraph Size</Label>
                    <Input
                      type="number"
                      value={styles.paragraphSize}
                      onChange={(e) => setStyles({ ...styles, paragraphSize: +e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: PREVIEW */}
          <Card>
            <CardHeader>
              <CardTitle>Mobile Preview</CardTitle>
            </CardHeader>

            <CardContent className="flex justify-center py-8">
              <div className="w-[360px] h-[720px] rounded-[45px] border-[14px] border-black bg-black overflow-hidden relative shadow-xl">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-black rounded-b-3xl z-20"></div>

                <div className="bg-white w-full h-full overflow-y-auto">
                  <Perview data={previewPayload} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
