"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { GripVertical, CheckCircle2, X, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import axiosClient from "@/lib/axiosClient";

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
   TOAST COMPONENT
---------------------------------------------------- */
const Toast = ({ message, type = "success", onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-2xl text-white font-medium flex items-center gap-3 ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
      style={{ animation: "slideUp 0.3s ease-out" }}
    >
      {type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <X className="h-5 w-5" />}
      {message}
    </div>
  );
};

/* ----------------------------------------------------
   SORTABLE ITEM
---------------------------------------------------- */
function SortableItem({ item, availableSections, onToggle, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.section });

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
          {availableSections.find(s => s.section === item.section)?.label || item.section}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Switch checked={item.enabled} onCheckedChange={() => onToggle(item.section)} />
        <Button size="sm" variant="ghost" onClick={() => onRemove(item.section)} className="cursor-pointer">
          Remove
        </Button>
      </div>
    </div>
  );
}

/* ----------------------------------------------------
   MAIN BUILDER
---------------------------------------------------- */
export default function NewLandingPagePage({ templateId, userId }) {
  const params = useParams();
  const isEditMode = Boolean(params?.id);
  const [selectValue, setSelectValue] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [toast, setToast] = React.useState(null);
  
  // Dynamic sections from database
  const [availableSections, setAvailableSections] = React.useState([]);
  const [activeSections, setActiveSections] = React.useState([]);
  const [styles, setStyles] = React.useState({
    primaryColor: "#ecedf4ff",
    backgroundColor: "#000000",
    textColor: "#a97d38",
    headlineSize: 28,
    paragraphSize: 16,
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  // Fetch sections from database
  React.useEffect(() => {
    const fetchSections = async () => {
      if (!templateId || !userId) {
        showToast("Missing template ID or user ID", "error");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch available sections and template data
        const response = await axiosClient.post(`/templates/sections`, {
          templateId,
          userId
        });
        

        if (response.data.status === "success") {
         const { availableSections, activeSections, styles } = response.data.data;

          
          // Set available sections from database
          setAvailableSections(availableSections || []);
          
          // Set active sections (either from saved template or defaults)
          if (activeSections && activeSections.length > 0) {
            setActiveSections(activeSections);
            const defaultKeys = ["Header", "Description", "sliderThree", "Specification", "CTA", "Social", "Contact"];
          } else {
            // Set default sections if no saved data
            const defaultKeys = ["Header", "Description", "sliderThree", "Specification", "CTA", "Social", "Contact"];
            const defaultSections = sections
              .filter(sec => defaultKeys.includes(sec.section))
              .map(sec => ({
                section: sec.section,
                enabled: true,
                fields: sec.fields
              }));
            setActiveSections(defaultSections);
          }
          
          // Set styles if available
          // if (templateStyles) {
          //   setStyles(templateStyles);
          // }
        } else {
          showToast(response.data.message || "Failed to load sections", "error");
        }
      } catch (error) {
        console.error("Fetch sections error:", error);
        showToast(error.response?.data?.message || "Failed to load sections", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSections();
  }, [templateId, userId]);

  const handleAddSection = (sectionKey) => {
    if (activeSections.some(s => s.section === sectionKey)) return;
    const template = availableSections.find(s => s.section === sectionKey);

    if (template) {
      setActiveSections(prev => [...prev, {
        section: template.section,
        enabled: true,
        fields: template.fields,
      }]);
    }
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

  const handleSave = async () => {
    if (!templateId || !userId) {
      showToast("Missing template ID or user ID", "error");
      return;
    }

    setIsSaving(true);
    
    try {
      const payload = {
        templateId,
        userId,
        sections: activeSections,
        styles
      };

      const response = await axiosClient.post('/templates/templateupdate/', payload);
      
      if (response.data.status === "success") {
        showToast("Template saved successfully!", "success");
      } else {
        showToast(response.data.message || "Failed to save template", "error");
      }
    } catch (error) {
      console.error("Save error:", error);
      showToast(error.response?.data?.message || "Failed to save template", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const previewPayload = {
    templateName: "modern",
    sections: activeSections,
    styles,
  };

  const availableToAdd = availableSections.filter(
    (s) => !activeSections.some((a) => a.section === s.section)
  );

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-lg text-muted-foreground">Loading sections...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-8 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
      
          </h1>
          
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            size="lg"
            className="cursor-pointer"
          >
            {isSaving ? "Saving..." : "Save & Publish"}
          </Button>
        </div>

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
                <Select
                  value={selectValue}
                  onValueChange={(val) => {
                    handleAddSection(val);
                    setSelectValue("");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Component of section..." />
                  </SelectTrigger>

                  <SelectContent>
                    {availableToAdd.length > 0 ? (
                      availableToAdd.map((s) => (
                        <SelectItem key={s.section} value={s.section}>
                          {s.label}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        All sections added
                      </div>
                    )}
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
                {activeSections.length > 0 ? (
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
                            availableSections={availableSections}
                            onToggle={toggleEnabled}
                            onRemove={removeSection}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No sections added. Select a section from the dropdown above.
                  </div>
                )}
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

        {/* Toast Notification */}
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </div>
    </>
  );
}