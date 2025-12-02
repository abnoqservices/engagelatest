"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { GripVertical } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
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
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.section });

  const label = AVAILABLE_SECTIONS.find(s => s.section === item.section)?.label || item.section;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-center justify-between rounded-lg border p-4 bg-white shadow-sm hover:shadow transition-shadow"
    >
      <div className="flex items-center gap-3">
        <GripVertical className="h-5 w-5 cursor-grab text-muted-foreground" {...attributes} {...listeners} />
        <span className="font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <Switch checked={item.enabled} onCheckedChange={() => onToggle(item.section)} />
        <Button size="sm" variant="ghost" onClick={() => onRemove(item.section)} className="text-red-600 hover:bg-red-50">
          Remove
        </Button>
      </div>
    </div>
  );
}

/* ----------------------------------------------------
   MAIN COMPONENT - Works with /landing-pages/[slug]/
---------------------------------------------------- */
export default function LandingPageBuilder() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const isEditMode = slug && slug !== "new";
  const isNewMode = !slug || slug === "new";

  // Simulate loading saved data based on slug
  // Replace with real API call later
  const [savedData, setSavedData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(isEditMode);

  React.useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      // Simulate API fetch
      setTimeout(() => {
        const mockData = {
          "my-awesome-page": {
            sections: [
              { section: "Header", enabled: true },
              { section: "slider", enabled: true },
              { section: "Description", enabled: true },
              { section: "YouTube", enabled: false },
              { section: "Specification", enabled: true },
              { section: "CTA", enabled: true },
              { section: "Contact", enabled: true },
            ],
            styles: {
              primaryColor: "#3b82f6",
              backgroundColor: "#0f172a",
              textColor: "#e2e8f0",
              headlineSize: 36,
              paragraphSize: 18,
            },
          },
          "ecommerce-demo": {
            sections: [
              { section: "Header", enabled: true },
              { section: "sliderTwo", enabled: true },
              { section: "Description", enabled: true },
              { section: "Social", enabled: true },
              { section: "CTA", enabled: true },
            ],
            styles: {
              primaryColor: "#10b981",
              backgroundColor: "#f8fafc",
              textColor: "#1e293b",
              headlineSize: 32,
              paragraphSize: 16,
            },
          },
        };

        const data = mockData[slug] || null;
        setSavedData(data);
        setLoading(false);
      }, 800);
    }
  }, [slug, isEditMode]);

  // Initialize sections & styles
  const [activeSections, setActiveSections] = React.useState<Array<{
    section: string;
    enabled: boolean;
    fields: any[];
  }>>([]);

  const [styles, setStyles] = React.useState({
    primaryColor: "#ecedf4ff",
    backgroundColor: "#000000",
    textColor: "#a97d38",
    headlineSize: 28,
    paragraphSize: 16,
  });

  // Load saved data when available
  React.useEffect(() => {
    if (savedData && !loading) {
      // Map saved sections to full template
      const loadedSections = savedData.sections.map((saved: any) => {
        const template = AVAILABLE_SECTIONS.find(s => s.section === saved.section);
        return {
          section: saved.section,
          enabled: saved.enabled ?? true,
          fields: template?.fields || [],
        };
      });

      setActiveSections(loadedSections);
      setStyles(prev => ({ ...prev, ...savedData.styles }));
    } else if (isNewMode) {
      // Default for new page
      setActiveSections([
        { section: "Header", enabled: true, fields: AVAILABLE_SECTIONS.find(s => s.section === "Header")!.fields },
        { section: "Description", enabled: true, fields: AVAILABLE_SECTIONS.find(s => s.section === "Description")!.fields },
        { section: "CTA", enabled: true, fields: AVAILABLE_SECTIONS.find(s => s.section === "CTA")!.fields },
      ]);
    }
  }, [savedData, loading, isNewMode]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleAddSection = (sectionKey: string) => {
    if (activeSections.some(s => s.section === sectionKey)) return;
    const template = AVAILABLE_SECTIONS.find(s => s.section === sectionKey);
    if (template) {
      setActiveSections(prev => [...prev, { section: template.section, enabled: true, fields: template.fields }]);
    }
  };

  const toggleEnabled = (sectionKey: string) => {
    setActiveSections(prev =>
      prev.map(s => (s.section === sectionKey ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const removeSection = (sectionKey: string) => {
    setActiveSections(prev => prev.filter(s => s.section !== sectionKey));
  };

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
    slug: slug || "new-page",
    sections: activeSections,
    styles,
  };

  const availableToAdd = AVAILABLE_SECTIONS.filter(
    s => !activeSections.some(active => active.section === s.section)
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-lg">Loading your landing page...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            {isEditMode ? `Edit: ${slug}` : "Create New Landing Page"}
          </h1>
       
        </div>
        <div className="flex justify-end gap-4 mt-10">
        {isEditMode && (
            <Button variant="outline" onClick={() => router.push(`/preview/${slug}`)}>
              View Live Page
            </Button>
            
          )}
          <Button variant="outline" onClick={() => router.push("/landing-pages")}>
            Cancel
          </Button>
          <Button size="lg">
            {isEditMode ? "Update Page" : "Create Page"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Section</CardTitle>
              </CardHeader>
              <CardContent>
                <Select onValueChange={handleAddSection} disabled={availableToAdd.length === 0}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a section..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableToAdd.map(section => (
                      <SelectItem key={section.section} value={section.section}>
                        {section.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Page Sections</CardTitle>
                <CardDescription>Drag to reorder • Toggle • Remove</CardDescription>
              </CardHeader>
              <CardContent>
                {activeSections.length === 0 ? (
                  <p className="text-center py-10 text-muted-foreground">No sections added yet</p>
                ) : (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                    <SortableContext items={activeSections.map(s => s.section)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-3">
                        {activeSections.map(item => (
                          <SortableItem key={item.section} item={item} onToggle={toggleEnabled} onRemove={removeSection} />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </CardContent>
            </Card>

            {/* Global Styles */}
            <Card>
              <CardHeader><CardTitle>Global Styling</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                {/* Your existing styling inputs */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <Label>Primary Color</Label>
                    <div className="flex gap-2">
                      <Input type="color" className="w-16 h-10" value={styles.primaryColor} onChange={e => setStyles(s => ({ ...s, primaryColor: e.target.value }))} />
                      <Input value={styles.primaryColor} onChange={e => setStyles(s => ({ ...s, primaryColor: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <Label>Background</Label>
                    <div className="flex gap-2">
                      <Input type="color" className="w-16 h-10" value={styles.backgroundColor} onChange={e => setStyles(s => ({ ...s, backgroundColor: e.target.value }))} />
                      <Input value={styles.backgroundColor} onChange={e => setStyles(s => ({ ...s, backgroundColor: e.target.value }))} />
                    </div>
                  </div>
                </div>
                {/* ... rest of styling */}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Preview */}
          <Card>
            <CardHeader><CardTitle>Live Preview</CardTitle></CardHeader>
            <CardContent className="flex justify-center py-8">
              <div className="w-[360px] h-[720px] rounded-[45px] border-[14px] border-black bg-black overflow-hidden relative shadow-2xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-black rounded-b-3xl z-10"></div>
                <div className="w-full h-full bg-white overflow-y-auto">
                  <Perview data={previewPayload} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

    

        {/* Debug */}
        <details className="mt-10">
          <summary className="cursor-pointer font-medium">View JSON</summary>
          <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-auto mt-2">
            {JSON.stringify(previewPayload, null, 2)}
          </pre>
        </details>
      </div>
    </DashboardLayout>
  );
}