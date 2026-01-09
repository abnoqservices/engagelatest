"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  ArrowLeft,
  Save,
  Eye,
  Check,
  Plus,
  GripVertical,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import axiosClient from "@/lib/axiosClient"
import { showToast } from "@/lib/showToast"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import  LivePreview  from "@/components/form-component/LivePreview"
import {
  Type, Mail, Phone, Calendar, Clock, CalendarClock, Hash, Lock,
  CheckSquare, ToggleLeft, Upload, Image, Link2, Star, SlidersHorizontal,
  Palette, EyeOff,
} from "lucide-react"

const fieldTypes = [
  { value: "text", label: "Text Input", icon: Type },
  { value: "textarea", label: "Textarea", icon: Type },
  { value: "email", label: "Email", icon: Mail },
  { value: "number", label: "Number", icon: Hash },
  { value: "phone", label: "Phone", icon: Phone },
  { value: "password", label: "Password", icon: Lock },
  { value: "date", label: "Date", icon: Calendar },
  { value: "time", label: "Time", icon: Clock },
  { value: "datetime", label: "Date & Time", icon: CalendarClock },
  { value: "select", label: "Dropdown", icon: ChevronDown },
  { value: "multi_select", label: "Multi-Select", icon: ChevronDown },
  { value: "radio", label: "Radio Group", icon: CheckSquare },
  { value: "checkbox", label: "Checkbox Group", icon: CheckSquare },
  { value: "toggle", label: "Toggle Switch", icon: ToggleLeft },
  { value: "file", label: "File Upload", icon: Upload },
  { value: "image", label: "Image Upload", icon: Image },
  { value: "url", label: "URL", icon: Link2 },
  { value: "rating", label: "Rating", icon: Star },
  { value: "range", label: "Range Slider", icon: SlidersHorizontal },
  { value: "color", label: "Color Picker", icon: Palette },
  { value: "hidden", label: "Hidden Field", icon: EyeOff },
]

// Replace your current Field & Section interfaces

interface FieldOption {
  label: string
  value: string
}

interface ValidationRule {
  type: string          // "min_length" | "max_length" | "min" | "max" | "regex" | "file_size" | "allowed_types" etc.
  value: any
  message?: string
}

interface Condition {
  fieldKey: string
  operator: string      // "equals" | "not_equals" | "contains" | "greater_than" | ...
  value: any
  action: "show" | "hide"
}

interface Field {
  id?: number
  tempId: string
  type: string
  label: string
  placeholder?: string
  is_required: boolean      // ← note: you used is_required instead of required
  key?: string
  options?: FieldOption[] | Record<string, any>  // choices | {min,max} | etc.
  rules: ValidationRule[]
  conditions: Condition[] | null
  order: number
}

interface Section {
  id?: number
  tempId: string
  title: string
  order: number
  fields: Field[]
  collapsed?: boolean
}

export default function CreateFormPage() {
  const params = useParams()
  const router = useRouter()
  const formId = params?.slug as string | undefined

  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)

  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    description: "",
    is_active: false,
    success_message: "Thank you for your submission! We'll get back to you soon.",
    redirect_url: "",
  })

  const [sections, setSections] = React.useState<Section[]>([])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  React.useEffect(() => {
    if (formId) {
      loadForm()
    } else {
      setSections([
        {
          tempId: "main-" + Date.now(),
          title: "Main Section",
          order: 0,
          fields: [
            { tempId: "f1", type: "text", label: "Full Name", is_required: true, placeholder: "John Doe", order: 0 },
            { tempId: "f2", type: "email", label: "Email Address", is_required: true, placeholder: "you@example.com", order: 1 },
          ],
          collapsed: false,
        },
      ])
      setLoading(false)
    }
  }, [formId])

  const loadForm = async () => {
    if (!formId) return
  
    setLoading(true)
    try {
      const res = await axiosClient.get(`/forms/${formId}`)
      if (!res.data.success) throw new Error("Failed to load form")
  
      const data = res.data.data
  
      setFormData({
        id: data.id,
        name: data.name || "",
        description: data.description || "",
        is_active: data.is_active ?? false,
        success_message: data.success_message || "Thank you for your submission!",
        redirect_url: data.redirect_url || "",
      })
  
      // Load sections & fields with rules & conditions
      if (data.sections?.length > 0) {
        const loadedSections: Section[] = data.sections.map((sec: any, secIndex: number) => ({
          id: sec.id,
          tempId: `sec-${sec.id || Date.now()}`,
          title: sec.title || "Untitled Section",
          order: sec.order ?? secIndex,
          collapsed: false,
          fields: (sec.fields || []).map((f: any, fIndex: number) => ({
            id: f.id,
            tempId: `field-${f.id || Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            type: f.type,
            label: f.label || "",
            key: f.key,
            is_required: f.is_required ?? false,
            placeholder: f.options?.placeholder || "",
            options: f.options?.choices || f.options || undefined,
            rules: f.rules || [],                    // ← important
            conditions: f.conditions || null,        // ← important
            order: f.order ?? fIndex,
          })),
        }))
  
        loadedSections.sort((a, b) => a.order - b.order)
        loadedSections.forEach(sec => sec.fields.sort((a, b) => a.order - b.order))
  
        setSections(loadedSections)
      } else {
        // fallback empty
        setSections([{
          tempId: "main-" + Date.now(),
          title: "Main Section",
          order: 0,
          fields: [],
          collapsed: false,
        }])
      }
    } catch (err) {
      console.error(err)
      showToast("Failed to load form", "error")
    } finally {
      setLoading(false)
    }
  }
  const addSection = () => {
    const newSection: Section = {
      tempId: "sec-" + Date.now(),
      title: "New Section",
      order: sections.length,
      fields: [],
      collapsed: false,
    }
    setSections(prev => [...prev, newSection])
  }

  const updateSection = (tempId: string, updates: Partial<Section>) => {
    setSections(prev =>
      prev.map(s => s.tempId === tempId ? { ...s, ...updates } : s)
    )
  }

  const deleteSection = async (section: Section) => {
    if (section.id) {
      try {
        await axiosClient.delete(`/sections/${section.id}`)
        showToast("Section deleted", "success")
      } catch (err) {
        showToast("Failed to delete section from server", "error")
      }
    }
    setSections(prev => prev.filter(s => s.tempId !== section.tempId))
  }

  const addField = (sectionTempId: string, type: string = "text") => {
    const section = sections.find(s => s.tempId === sectionTempId)
    if (!section) return
  
    const newField: Field = {
      tempId: `field-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      type,
      label: "New Field",
      is_required: false,
      placeholder: ["text","textarea","email","url","password","number","phone","date","time","datetime"].includes(type)
        ? ""
        : undefined,
      options: ["select","multi_select","radio","checkbox"].includes(type)
        ? [{ label: "Option 1", value: "option1" }]
        : ["rating","range","file","image"].includes(type) ? {} : undefined,
      rules: [],                      // ← start empty
      conditions: null,               // ← null = always visible
      order: section.fields.length,
    }
  
    setSections(prev => prev.map(s =>
      s.tempId === sectionTempId
        ? { ...s, fields: [...s.fields, newField] }
        : s
    ))
  }

  const updateField = (sectionTempId: string, fieldTempId: string, updates: Partial<Field>) => {
    setSections(prev =>
      prev.map(s =>
        s.tempId === sectionTempId
          ? {
              ...s,
              fields: s.fields.map(f =>
                f.tempId === fieldTempId ? { ...f, ...updates } : f
              ),
            }
          : s
      )
    )
  }

  const removeField = (sectionTempId: string, fieldTempId: string) => {
    setSections(prev =>
      prev.map(s =>
        s.tempId === sectionTempId
          ? { ...s, fields: s.fields.filter(f => f.tempId !== fieldTempId) }
          : s
      )
    )
  }

  const generateKey = (label: string) => {
    return label
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "")
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeId = active.id as string
    const overId = over.id as string

    // Section drag
    if (activeId.startsWith("sec-")) {
      const activeIndex = sections.findIndex(s => `sec-${s.tempId}` === activeId)
      const overIndex = sections.findIndex(s => `sec-${s.tempId}` === overId)
      if (activeIndex !== -1 && overIndex !== -1) {
        setSections(arrayMove(sections, activeIndex, overIndex).map((s, i) => ({ ...s, order: i })))
      }
      return
    }

    // Field drag (only within same section for now)
    let fromSection: Section | undefined
    let fromIndex = -1
    let toSection: Section | undefined
    let toIndex = -1

    for (const sec of sections) {
      const fIdx = sec.fields.findIndex(f => f.tempId === activeId)
      if (fIdx !== -1) {
        fromSection = sec
        fromIndex = fIdx
      }
      const tIdx = sec.fields.findIndex(f => f.tempId === overId)
      if (tIdx !== -1) {
        toSection = sec
        toIndex = tIdx
      }
    }

    if (fromSection && toSection && fromSection.tempId === toSection.tempId) {
      const newFields = arrayMove(fromSection.fields, fromIndex, toIndex)
      setSections(prev =>
        prev.map(s =>
          s.tempId === fromSection!.tempId
            ? { ...s, fields: newFields.map((f, i) => ({ ...f, order: i })) }
            : s
        )
      )
    }
  }

  const saveForm = async (publish: boolean = false) => {
    if (!formData.name.trim()) {
      showToast("Form name is required", "error");
      return;
    }
  
    setSaving(true);
    try {
      let savedFormId = formId ? Number(formId) : null;
  
      // 1. Save/Update main Form
      const formPayload = {
        name: formData.name.trim(),
        description: formData.description?.trim() || null,
        is_active: publish || formData.is_active,
        success_message: formData.success_message?.trim() || null,
        redirect_url: formData.redirect_url?.trim() || null,
      };
  
      if (savedFormId) {
        await axiosClient.put(`/forms/${savedFormId}`, formPayload);
      } else {
        const res = await axiosClient.post("/forms", formPayload);
        savedFormId = res.data.data.id;
        router.replace(`/forms/${savedFormId}/edit`);
      }
  
      // 2. Save / Update Sections + Fields
      for (let secIndex = 0; secIndex < sections.length; secIndex++) {
        const section = sections[secIndex];
        let sectionId = section.id;
  
        const secPayload = {
          title: section.title.trim() || "Untitled Section",
          order: secIndex,
        };
  
        if (!sectionId) {
          const res = await axiosClient.post(`/forms/${savedFormId}/sections`, secPayload);
          sectionId = res.data.data.id;
        } else {
          await axiosClient.put(`/sections/${sectionId}`, secPayload);
        }
  
        // 3. Save / Update Fields
        for (let fieldIndex = 0; fieldIndex < section.fields.length; fieldIndex++) {
          const field = section.fields[fieldIndex];
  
          const isChoiceField = ["select", "multi_select", "radio", "checkbox"].includes(field.type);
  
          const fieldPayload: any = {
            form_section_id: sectionId,
            label: field.label.trim(),
            key: field.key || generateKey(field.label),
            type: field.type,
            is_required: field.is_required,
            is_active: true,
            order: fieldIndex,
  
            // ── Very important ───────────────────────────────
            rules: field.rules || [],
            conditions: field.conditions || null,
            // ──────────────────────────────────────────────────
          };
  
          // Handle options properly
          fieldPayload.options = {};
  
          if (field.placeholder) {
            fieldPayload.options.placeholder = field.placeholder.trim();
          }
  
          if (isChoiceField && Array.isArray(field.options)) {
            fieldPayload.options.choices = field.options.map((o: any) => ({
              label: o.label?.trim() || "",
              value: o.value?.trim() || generateKey(o.label || ""),
            }));
          }
  
          // Future extension points (examples)
          if (field.type === "rating") {
            fieldPayload.options = {
              ...fieldPayload.options,
              max: field.options?.max ?? 5,
              step: field.options?.step ?? 1,
            };
          }
  
          if (field.type === "range") {
            fieldPayload.options = {
              ...fieldPayload.options,
              min: field.options?.min ?? 0,
              max: field.options?.max ?? 100,
              step: field.options?.step ?? 1,
            };
          }
  
          // File / Image fields
          if (["file", "image"].includes(field.type)) {
            fieldPayload.options = {
              ...fieldPayload.options,
              max_size_kb: field.options?.max_size_kb ?? 5120,
              allowed_types: field.options?.allowed_types ?? ["image/*", "application/pdf"],
            };
          }
  
          // ── Save / Update field ─────────────────────────────
          if (field.id) {
            await axiosClient.put(`/fields/${field.id}`, fieldPayload);
          } else {
            const res = await axiosClient.post(`/forms/${savedFormId}/fields`, fieldPayload);
            // Optional: update local state with real id if needed
            // field.id = res.data.data.id;
          }
        }
      }
  
      showToast(publish ? "Form published successfully" : "Form saved successfully", "success");
    } catch (err: any) {
      console.error("Save error:", err);
      const msg = err.response?.data?.message || "Failed to save form";
      showToast(msg, "error");
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">Loading form...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <Header
          formId={formId}
          saving={saving}
          onSaveDraft={() => saveForm(false)}
          onPublish={() => saveForm(true)}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <FormDetails formData={formData} setFormData={setFormData} />
            <SectionsEditor
              sections={sections}
              setSections={setSections}
              sensors={sensors}
              handleDragEnd={handleDragEnd}
              addSection={addSection}
              updateSection={updateSection}
              deleteSection={deleteSection}
              addField={addField}
              updateField={updateField}
              removeField={removeField}
            />
            {/* <SuccessSettings formData={formData} setFormData={setFormData} /> */}
          </div>

          <LivePreview formData={formData} sections={sections} />
        </div>
      </div>
    </DashboardLayout>
  )
}

// ────────────────────────────────────────────────
// Header Component
// ────────────────────────────────────────────────
interface HeaderProps {
  formId: string | undefined
  saving: boolean
  onSaveDraft: () => void
  onPublish: () => void
}

function Header({ formId, saving, onSaveDraft, onPublish }: HeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/forms">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">
            {formId ? "Edit Form" : "Create New Form"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Build your form with sections, fields and drag & drop ordering
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onSaveDraft} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
        {/* <Button variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button> */}
        <Button onClick={onPublish} disabled={saving}>
          <Check className="h-4 w-4 mr-2" />
          {formId ? "Update & Publish" : "Publish Form"}
        </Button>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────
// Form Details
// ────────────────────────────────────────────────
function FormDetails({ formData, setFormData }: { formData: FormData; setFormData: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Form Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
            placeholder="e.g. Contact Us, Registration, Feedback"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
            placeholder="Optional short description of the form purpose"
            rows={3}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={c => setFormData(p => ({ ...p, is_active: !!c }))}
          />
          <Label htmlFor="is_active">Active (publicly available)</Label>
        </div>
      </CardContent>
    </Card>
  )
}

// ────────────────────────────────────────────────
// Sections Editor (main builder area)
// ────────────────────────────────────────────────
interface SectionsEditorProps {
  sections: Section[]
  setSections: React.Dispatch<React.SetStateAction<Section[]>>
  sensors: ReturnType<typeof useSensors>
  handleDragEnd: (e: DragEndEvent) => void
  addSection: () => void
  updateSection: (tempId: string, updates: Partial<Section>) => void
  deleteSection: (section: Section) => Promise<void>
  addField: (secTempId: string, type?: string) => void
  updateField: (secTempId: string, fieldTempId: string, updates: Partial<Field>) => void
  removeField: (secTempId: string, fieldTempId: string) => void
}

function SectionsEditor(props: any) {
  const { sections, setSections, sensors, handleDragEnd, addSection, updateSection, deleteSection, addField, updateField, removeField } = props

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Form Sections & Fields</CardTitle>
            <CardDescription>Organize your form into sections</CardDescription>
          </div>
          <Button onClick={addSection} size="sm"><Plus className="h-4 w-4 mr-2" /> Add Section</Button>
        </div>
      </CardHeader>
      <CardContent>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sections.map((s: any) => `section-${s.tempId}`)} strategy={verticalListSortingStrategy}>
            {sections.map((section: any) => (
              <SortableSection
                key={section.tempId}
                section={section}
                updateSection={updateSection}
                deleteSection={deleteSection}
                addField={addField}
                updateField={updateField}
                removeField={removeField}
              />
            ))}
          </SortableContext>
        </DndContext>

        {sections.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No sections yet. Add one to start building your form.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SortableSection({
  section,
  updateSection,
  deleteSection,
  addField,
  updateField,
  removeField,
}: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: `section-${section.tempId}` })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-4 border border-gray-300 rounded-md bg-[#f5f5f5] shadow-sm"
    >
      {/* ───── Window Header ───── */}
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-[#eaeaea] rounded-t-md">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-move text-gray-500 hover:text-gray-700"
        >
          <GripVertical className="h-4 w-4" />
        </div>

        {/* Title */}
        <Input
          value={section.title}
          onChange={e =>
            updateSection(section.tempId, { title: e.target.value })
          }
          placeholder="Section title"
          className="h-7 text-sm font-medium bg-white border-gray-300 focus:ring-0 focus:border-blue-500"
        />

        {/* Window Buttons */}
        <div className="flex gap-1 ml-auto">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() =>
              updateSection(section.tempId, {
                collapsed: !section.collapsed,
              })
            }
          >
            {section.collapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-red-600 hover:bg-red-100"
            onClick={() => deleteSection(section)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ───── Window Body ───── */}
      {!section.collapsed && (
        <div className="p-3 bg-[#fafafa]">
          <SortableContext
            items={section.fields.map((f: any) => f.tempId)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2 pl-4 border-l border-gray-300">
              {section.fields.map((field: any) => (
                <SortableField
                  key={field.tempId}
                  sectionTempId={section.tempId}
                  field={field}
                  updateField={updateField}
                  removeField={removeField}
                />
              ))}
            </div>
          </SortableContext>

          {/* Add Field Dropdown */}
          <div className="mt-3">
            <Select onValueChange={type => addField(section.tempId, type)}>
              <SelectTrigger className="h-8 text-sm bg-white border-gray-300">
                <SelectValue placeholder="+ Add field" />
              </SelectTrigger>
              <SelectContent>
                {fieldTypes.map(type => {
                  const Icon = type.icon
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  )
}

function SortableField({
  sectionTempId,
  field,
  updateField,
  removeField,
}: {
  sectionTempId: string
  field: Field
  updateField: (sec: string, fieldId: string, updates: Partial<Field>) => void
  removeField: (sec: string, fieldId: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.tempId })
  const style = { transform: CSS.Transform.toString(transform), transition }

  // Helper functions for rules
  const addRule = () => {
    updateField(sectionTempId, field.tempId, {
      rules: [...(field.rules || []), { type: "min_length", value: 0, message: "" }]
    })
  }

  const updateRule = (index: number, updates: Partial<ValidationRule>) => {
    const newRules = [...(field.rules || [])]
    newRules[index] = { ...newRules[index], ...updates }
    updateField(sectionTempId, field.tempId, { rules: newRules })
  }

  const removeRule = (index: number) => {
    const newRules = (field.rules || []).filter((_, i) => i !== index)
    updateField(sectionTempId, field.tempId, { rules: newRules })
  }

  // Helper functions for conditions
  const addCondition = () => {
    const newCond: Condition = { fieldKey: "", operator: "equals", value: "", action: "show" }
    updateField(sectionTempId, field.tempId, {
      conditions: [...(field.conditions || []), newCond]
    })
  }

  const updateCondition = (index: number, updates: Partial<Condition>) => {
    const conds = [...(field.conditions || [])]
    conds[index] = { ...conds[index], ...updates }
    updateField(sectionTempId, field.tempId, { conditions: conds })
  }

  const removeCondition = (index: number) => {
    const conds = (field.conditions || []).filter((_, i) => i !== index)
    updateField(sectionTempId, field.tempId, {
      conditions: conds.length ? conds : null
    })
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3 rounded-lg border bg-secondary/30 p-4 relative"
    >
      <div {...attributes} {...listeners} className="cursor-move mt-2">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="flex-1 space-y-5">
        {/* Basic field settings */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Field Type</Label>
            <Select
              value={field.type}
              onValueChange={v => {
                const updates: Partial<Field> = { type: v }
                if (["select","multi_select","radio","checkbox"].includes(v)) {
                  updates.options = field.options || [{ label: "Option 1", value: "option1" }]
                } else if (["rating","range"].includes(v)) {
                  updates.options = field.options || {}
                }
                updateField(sectionTempId, field.tempId, updates)
              }}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {fieldTypes.map(t => {
                  const Icon = t.icon
                  return (
                    <SelectItem key={t.value} value={t.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" /> {t.label}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Field Label</Label>
            <Input
              value={field.label}
              onChange={e => updateField(sectionTempId, field.tempId, { label: e.target.value })}
            />
          </div>
        </div>

        {/* Placeholder */}
        {["text","textarea","email","url","password","number","phone","date","time","datetime"].includes(field.type) && (
          <div className="space-y-2">
            <Label>Placeholder</Label>
            <Input
              value={field.placeholder || ""}
              onChange={e => updateField(sectionTempId, field.tempId, { placeholder: e.target.value })}
            />
          </div>
        )}

        {/* Choice field options */}
        {["select","multi_select","radio","checkbox"].includes(field.type) && (
          <div className="space-y-2">
            <Label>Options</Label>
            {(field.options || []).map((opt: any, idx: number) => (
              <div key={idx} className="flex gap-2">
                <Input
                  value={opt.label}
                  onChange={e => {
                    const newOpts = [...(field.options || [])]
                    newOpts[idx] = {
                      label: e.target.value,
                      value: e.target.value.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")
                    }
                    updateField(sectionTempId, field.tempId, { options: newOpts })
                  }}
                />
                <Button variant="ghost" size="icon" onClick={() => {
                  const newOpts = (field.options || []).filter((_, i) => i !== idx)
                  updateField(sectionTempId, field.tempId, { options: newOpts })
                }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => {
              const newOpts = [...(field.options || []), { label: "New Option", value: `opt_${Date.now()}` }]
              updateField(sectionTempId, field.tempId, { options: newOpts })
            }}>
              <Plus className="h-4 w-4 mr-1" /> Add Option
            </Button>
          </div>
        )}

        {/* Required */}
        <div className="flex items-center gap-2">
          <Checkbox
            checked={field.is_required}
            onCheckedChange={c => updateField(sectionTempId, field.tempId, { is_required: !!c })}
          />
          <Label>Required field</Label>
        </div>

        {/* ── VALIDATION RULES ─────────────────────────────────────── */}
        <div className="space-y-3 border-t pt-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Validation Rules</Label>
            <Button variant="outline" size="sm" onClick={addRule}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Rule
            </Button>
          </div>

          {(field.rules?.length || 0) === 0 && (
            <p className="text-sm text-muted-foreground italic">No validation rules yet</p>
          )}

          {field.rules?.map((rule, idx) => (
            <div key={idx} className="flex gap-3 items-start bg-background/50 p-3 rounded border">
              <Select value={rule.type} onValueChange={v => updateRule(idx, { type: v })}>
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="min_length">Min Length</SelectItem>
                  <SelectItem value="max_length">Max Length</SelectItem>
                  <SelectItem value="min">Min Value</SelectItem>
                  <SelectItem value="max">Max Value</SelectItem>
                  <SelectItem value="regex">Regex Pattern</SelectItem>
                  <SelectItem value="file_size">Max File Size (KB)</SelectItem>
                  <SelectItem value="allowed_types">Allowed File Types</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Value / Pattern"
                value={rule.value ?? ""}
                onChange={e => updateRule(idx, { value: e.target.value })}
              />

              <Input
                placeholder="Error message (optional)"
                value={rule.message ?? ""}
                onChange={e => updateRule(idx, { message: e.target.value })}
              />

              <Button variant="ghost" size="icon" onClick={() => removeRule(idx)}>
             x
              </Button>
            </div>
          ))}
        </div>

        {/* ── VISIBILITY CONDITIONS ────────────────────────────────── */}
        <div className="space-y-3 border-t pt-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Visibility Conditions</Label>
            <Button variant="outline" size="sm" onClick={addCondition}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Condition
            </Button>
          </div>

          {!field.conditions && (
            <p className="text-sm text-muted-foreground italic">No visibility conditions</p>
          )}

          {field.conditions?.map((cond, idx) => (
            <div key={idx} className="flex gap-2 items-center bg-background/50 p-3 rounded border">
              <Input
                placeholder="Field key"
                value={cond.fieldKey}
                onChange={e => updateCondition(idx, { fieldKey: e.target.value })}
                className="w-44"
              />

              <Select value={cond.operator} onValueChange={v => updateCondition(idx, { operator: v })}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">equals</SelectItem>
                  <SelectItem value="not_equals">not equals</SelectItem>
                  <SelectItem value="contains">contains</SelectItem>
                  <SelectItem value="greater_than">greater than</SelectItem>
                  <SelectItem value="less_than">less than</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Value"
                value={cond.value ?? ""}
                onChange={e => updateCondition(idx, { value: e.target.value })}
                className="flex-1"
              />

              <Select value={cond.action} onValueChange={v => updateCondition(idx, { action: v })}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="show">Show</SelectItem>
                  <SelectItem value="hide">Hide</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="ghost" size="icon" onClick={() => removeCondition(idx)}>
            x
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="text-destructive mt-2"
        onClick={() => removeField(sectionTempId, field.tempId)}
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  )
}

// ────────────────────────────────────────────────
// Success Settings
// ────────────────────────────────────────────────
// function SuccessSettings({ formData, setFormData }: { formData: FormData; setFormData: any }) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>After Submission</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         <div className="space-y-2">
//           <Label>Success Message</Label>
//           <Textarea
//             value={formData.success_message}
//             onChange={e => setFormData(p => ({ ...p, success_message: e.target.value }))}
//             rows={3}
//             placeholder="Shown to user after successful submission"
//           />
//         </div>
//         <div className="space-y-2">
//           <Label>Redirect URL (optional)</Label>
//           <Input
//             type="url"
//             value={formData.redirect_url || ""}
//             onChange={e => setFormData(p => ({ ...p, redirect_url: e.target.value }))}
//             placeholder="https://example.com/thank-you"
//           />
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// ────────────────────────────────────────────────
// Live Preview
// ────────────────────────────────────────────────
// function LivePreview({ formData, sections }: { formData: FormData; sections: Section[] }) {
//   const renderFieldPreview = (field: Field) => {
//     const common = {
//       placeholder: field.placeholder || "",
//       disabled: true,
//       className: "bg-background",
//     }

//     switch (field.type) {
//       case "textarea": return <Textarea {...common} rows={3} />
//       case "email":
//       case "url":
//       case "password":
//       case "text":
//       case "phone": return <Input type={field.type === "phone" ? "tel" : field.type} {...common} />
//       case "number":
//       case "rating":
//       case "range": return <Input type="number" {...common} />
//       case "date": return <Input type="date" {...common} />
//       case "time": return <Input type="time" {...common} />
//       case "datetime": return <Input type="datetime-local" {...common} />
//       case "color": return <Input type="color" className="h-10 w-20" disabled />
//       case "select":
//       case "multi_select":
//         return (
//           <Select disabled>
//             <SelectTrigger>
//               <SelectValue placeholder="Select..." />
//             </SelectTrigger>
//           </Select>
//         )
//       case "radio":
//         return (
//           <RadioGroup disabled className="space-y-2">
//             {(field.options || []).map(opt => (
//               <div key={opt.value} className="flex items-center gap-2">
//                 <div className="h-4 w-4 rounded-full border border-primary" />
//                 <span className="text-sm">{opt.label}</span>
//               </div>
//             ))}
//           </RadioGroup>
//         )
//       case "checkbox":
//         return (
//           <div className="space-y-2">
//             {(field.options || []).map(opt => (
//               <div key={opt.value} className="flex items-center gap-2">
//                 <div className="h-4 w-4 rounded border border-primary" />
//                 <span className="text-sm">{opt.label}</span>
//               </div>
//             ))}
//           </div>
//         )
//       case "toggle": return <div className="h-6 w-11 rounded-full bg-muted relative"><div className="absolute h-4 w-4 rounded-full bg-background top-1 left-1" /></div>
//       case "file":
//       case "image": return <Input type="file" disabled className="h-9" />
//       case "hidden": return <div className="text-xs italic text-muted-foreground">Hidden: {field.label}</div>
//       default: return <Input {...common} />
//     }
//   }

//   return (
//     <div className="space-y-6 sticky top-6">
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-lg">Live Preview</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="rounded-lg border bg-background p-6 space-y-8 shadow-sm">
//             <div>
//               <h2 className="text-2xl font-bold">{formData.name || "Untitled Form"}</h2>
//               {formData.description && (
//                 <p className="text-sm text-muted-foreground mt-2">{formData.description}</p>
//               )}
//             </div>

//             {sections.map(sec => (
//               <div key={sec.tempId} className="space-y-5">
//                 <h3 className="text-xl font-semibold border-b pb-2">{sec.title}</h3>
//                 <div className="space-y-5">
//                   {sec.fields.map(field => (
//                     <div key={field.tempId} className="space-y-2">
//                       <Label className="flex items-center gap-1">
//                         {field.label}
//                         {field.is_required && <span className="text-red-500 text-base">*</span>}
//                       </Label>
//                       {renderFieldPreview(field)}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}

//             <Button className="w-full" disabled>Submit Form</Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }