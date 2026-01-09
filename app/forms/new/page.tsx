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
import { Switch } from "@/components/ui/switch"
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
  X,
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

interface FieldOption {
  label: string
  value: string
}

interface ValidationRule {
  type: string          // e.g. "min_length", "max_length", "min", "max", "regex", "file_size", "allowed_types"
  value: any
  message?: string
}

interface Condition {
  fieldKey: string      // key of the field we depend on
  operator: string      // "equals", "not_equals", "contains", "greater_than", etc.
  value: any
  action: "show" | "hide"
}

interface Field {
  id?: number
  tempId: string
  type: string
  label: string
  placeholder?: string
  required: boolean
  key?: string
  options?: FieldOption[] | Record<string, any>
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

interface FormData {
  id?: number
  name: string
  description: string
  status: string
  success_message: string
  redirect_url?: string
  send_notification: boolean
  captcha: boolean
  gdpr: boolean
  auto_respond: boolean
}

export default function CreateFormPage() {
  const params = useParams()
  const router = useRouter()
  const formId = params?.id as string | undefined

  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)

  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    description: "",
    status: "draft",
    success_message: "Thank you for your submission! We'll get back to you soon.",
    redirect_url: "",
    send_notification: true,
    captcha: true,
    gdpr: false,
    auto_respond: true,
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
          tempId: "main",
          title: "Main Section",
          order: 0,
          fields: [
            { tempId: "1", type: "text", label: "Full Name", required: true, placeholder: "John Doe", order: 0, rules: [], conditions: null },
            { tempId: "2", type: "email", label: "Email Address", required: true, placeholder: "you@example.com", order: 1, rules: [], conditions: null },
          ],
        },
      ])
      setLoading(false)
    }
  }, [formId])

  const loadForm = async () => {
    try {
      const res = await axiosClient.get(`/forms/${formId}`)
      if (res.data.success) {
        const data = res.data.data
        setFormData(prev => ({
          ...prev,
          name: data.name || "",
          description: data.description || "",
          status: data.is_active ? "active" : "draft",
        }))

        const sectionsRes = await axiosClient.get(`/forms/${formId}/sections`)
        if (sectionsRes.data.success && sectionsRes.data.data.length > 0) {
          const loadedSections: Section[] = sectionsRes.data.data.map((sec: any, secIndex: number) => ({
            id: sec.id,
            tempId: `sec-${sec.id || Date.now()}`,
            title: sec.title || "Untitled Section",
            order: sec.order ?? secIndex,
            collapsed: false,
            fields: (sec.fields || []).map((f: any, fIndex: number) => ({
              id: f.id,
              tempId: `field-${f.id || Date.now()}-${Math.random()}`,
              type: f.type,
              label: f.label,
              required: f.is_required,
              key: f.key,
              placeholder: f.options?.placeholder || "",
              options: f.options?.choices || f.options || undefined,
              rules: f.rules || [],
              conditions: f.conditions || null,
              order: f.order ?? fIndex,
            })),
          }))
          loadedSections.sort((a, b) => a.order - b.order)
          loadedSections.forEach(sec => sec.fields.sort((a, b) => a.order - b.order))
          setSections(loadedSections)
        }
      }
    } catch (err) {
      showToast("Failed to load form", "error")
    } finally {
      setLoading(false)
    }
  }

  const addSection = () => {
    const newSection: Section = {
      tempId: Date.now().toString(),
      title: "New Section",
      order: sections.length,
      fields: [],
      collapsed: false,
    }
    setSections(prev => [...prev, newSection])
  }

  const updateSection = (tempId: string, updates: Partial<Section>) => {
    setSections(prev => prev.map(s => s.tempId === tempId ? { ...s, ...updates } : s))
  }

  const deleteSection = async (section: Section) => {
    if (section.id) {
      try {
        await axiosClient.delete(`/sections/${section.id}`)
      } catch {
        showToast("Failed to delete section from server", "error")
      }
    }
    setSections(prev => prev.filter(s => s.tempId !== section.tempId))
  }

  const addField = (sectionTempId: string, type: string = "text") => {
    const section = sections.find(s => s.tempId === sectionTempId)
    if (!section) return

    const newField: Field = {
      tempId: Date.now().toString(),
      type,
      label: "New Field",
      required: false,
      placeholder: ["text","textarea","email","url","password","number","phone","date","time","datetime"].includes(type) ? "" : undefined,
      options: ["select","multi_select","radio","checkbox"].includes(type)
        ? [{ label: "Option 1", value: "option1" }]
        : ["rating","range","file","image"].includes(type) ? {} : undefined,
      rules: [],
      conditions: null,
      order: section.fields.length,
    }

    setSections(prev =>
      prev.map(s =>
        s.tempId === sectionTempId
          ? { ...s, fields: [...s.fields, newField] }
          : s
      )
    )
  }

  const updateField = (sectionTempId: string, fieldTempId: string, updates: Partial<Field>) => {
    setSections(prev =>
      prev.map(s =>
        s.tempId === sectionTempId
          ? {
              ...s,
              fields: s.fields.map(f => f.tempId === fieldTempId ? { ...f, ...updates } : f)
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

    if (activeId.startsWith("section-")) {
      const activeIndex = sections.findIndex(s => s.tempId === activeId.replace("section-", ""))
      const overIndex = sections.findIndex(s => s.tempId === overId.replace("section-", ""))
      if (activeIndex !== -1 && overIndex !== -1) {
        setSections(arrayMove(sections, activeIndex, overIndex).map((s, idx) => ({ ...s, order: idx })))
      }
    } else {
      // Field drag (same section only in this version)
      let fromSection: Section | undefined
      let fromIndex = -1
      let toSection: Section | undefined
      let toIndex = -1

      for (const sec of sections) {
        const fIdx = sec.fields.findIndex(f => f.tempId === activeId)
        if (fIdx !== -1) { fromSection = sec; fromIndex = fIdx }
        const tIdx = sec.fields.findIndex(f => f.tempId === overId)
        if (tIdx !== -1) { toSection = sec; toIndex = tIdx }
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
  }

  const saveForm = async (publish: boolean = false) => {
    if (!formData.name.trim()) {
      showToast("Form name is required", "error")
      return
    }

    setSaving(true)
    try {
      let savedFormId = formId

      const formPayload = {
        name: formData.name,
        description: formData.description || null,
        is_active: publish || formData.status === "active",
      }

      if (formId) {
        await axiosClient.put(`/forms/${formId}`, formPayload)
      } else {
        const res = await axiosClient.post("/forms", formPayload)
        savedFormId = res.data.data.id
        router.replace(`/forms/${savedFormId}/edit`)
      }

      // Save sections + fields
      for (const section of sections) {
        let sectionId = section.id

        if (!sectionId) {
          const res = await axiosClient.post(`/forms/${savedFormId}/sections`, {
            title: section.title,
            order: section.order,
          })
          sectionId = res.data.data.id
        } else {
          await axiosClient.put(`/sections/${sectionId}`, {
            title: section.title,
            order: section.order,
          })
        }

        for (const field of section.fields) {
          const fieldPayload = {
            form_section_id: sectionId,
            label: field.label,
            key: field.key || generateKey(field.label),
            type: field.type,
            options:
              ["select", "multi_select", "radio", "checkbox"].includes(field.type)
                ? { choices: field.options || [] }
                : field.options || { placeholder: field.placeholder || "" },
            rules: field.rules || [],
            conditions: field.conditions,
            is_required: field.required,
            is_active: true,
            order: field.order,
          }

          if (field.id) {
            await axiosClient.put(`/fields/${field.id}`, fieldPayload)
          } else {
            await axiosClient.post(`/forms/${savedFormId}/fields`, fieldPayload)
          }
        }
      }

      showToast(publish ? "Form published!" : "Form saved as draft", "success")
    } catch (err: any) {
      console.error(err)
      showToast(err.response?.data?.message || "Failed to save form", "error")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <DashboardLayout><div className="p-8 text-center">Loading...</div></DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Header formId={formId} saving={saving} onSaveDraft={() => saveForm(false)} onPublish={() => saveForm(true)} />
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

// ──────────────────────────────────────────────
// Header, FormDetails, SuccessSettings (unchanged)
// ──────────────────────────────────────────────

function Header({ formId, saving, onSaveDraft, onPublish }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/forms"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
        <div>
          <h1 className="text-3xl font-bold">{formId ? "Edit Form" : "Create Form"}</h1>
          <p className="text-sm text-muted-foreground mt-1">Design a custom form with sections and ordering</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onSaveDraft} disabled={saving}><Save className="h-4 w-4 mr-2" /> Save Draft</Button>
        {/* <Button variant="outline"><Eye className="h-4 w-4 mr-2" /> Preview</Button> */}
        <Button onClick={onPublish} disabled={saving}><Check className="h-4 w-4 mr-2" />{formId ? "Update & Publish" : "Publish Form"}</Button>
      </div>
    </div>
  )
}

function FormDetails({ formData, setFormData }: any) {
  return (
    <Card>
      <CardHeader><CardTitle>Form Details</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Form Name</Label>
          <Input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="e.g., Contact Form" />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={3} />
        </div>
      </CardContent>
    </Card>
  )
}

// function SuccessSettings({ formData, setFormData }: any) {
//   return (
//     <Card>
//       <CardHeader><CardTitle>Success Settings</CardTitle></CardHeader>
//       <CardContent className="space-y-6">
//         <div className="space-y-2">
//           <Label>Success Message</Label>
//           <Textarea value={formData.success_message} onChange={e => setFormData(p => ({ ...p, success_message: e.target.value }))} rows={3} />
//         </div>
//         <div className="space-y-2">
//           <Label>Redirect URL (Optional)</Label>
//           <Input type="url" value={formData.redirect_url} onChange={e => setFormData(p => ({ ...p, redirect_url: e.target.value }))} />
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// ──────────────────────────────────────────────
// SectionsEditor + SortableSection (minor changes)
// ──────────────────────────────────────────────

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

// ──────────────────────────────────────────────
// SortableField – now with Rules & Conditions
// ──────────────────────────────────────────────

function SortableField({ sectionTempId, field, updateField, removeField }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.tempId })
  const style = { transform: CSS.Transform.toString(transform), transition }

  const addRule = () => {
    const newRule: ValidationRule = { type: "min_length", value: 0, message: "" }
    updateField(sectionTempId, field.tempId, { rules: [...(field.rules || []), newRule] })
  }

  const updateRule = (index: number, updates: Partial<ValidationRule>) => {
    const newRules = [...(field.rules || [])]
    newRules[index] = { ...newRules[index], ...updates }
    updateField(sectionTempId, field.tempId, { rules: newRules })
  }

  const removeRule = (index: number) => {
    const newRules = (field.rules || []).filter((_: any, i: number) => i !== index)
    updateField(sectionTempId, field.tempId, { rules: newRules })
  }

  const addCondition = () => {
    const newCond: Condition = { fieldKey: "", operator: "equals", value: "", action: "show" }
    const current = field.conditions || []
    updateField(sectionTempId, field.tempId, { conditions: [...current, newCond] })
  }

  const updateCondition = (index: number, updates: Partial<Condition>) => {
    const conds = [...(field.conditions || [])]
    conds[index] = { ...conds[index], ...updates }
    updateField(sectionTempId, field.tempId, { conditions: conds })
  }

  const removeCondition = (index: number) => {
    const conds = (field.conditions || []).filter((_: any, i: number) => i !== index)
    updateField(sectionTempId, field.tempId, { conditions: conds.length ? conds : null })
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-3 rounded-lg border bg-secondary/30 p-4">
      <div {...attributes} {...listeners} className="cursor-move mt-2">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="flex-1 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm">Field Type</Label>
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
                      <div className="flex items-center gap-2"><Icon className="h-4 w-4" /> {t.label}</div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Field Label</Label>
            <Input
              value={field.label}
              onChange={e => updateField(sectionTempId, field.tempId, { label: e.target.value })}
            />
          </div>
        </div>

        {/* Placeholder for text-like fields */}
        {["text","textarea","email","url","password","number","phone","date","time","datetime"].includes(field.type) && (
          <div className="space-y-2">
            <Label className="text-sm">Placeholder</Label>
            <Input
              value={field.placeholder || ""}
              onChange={e => updateField(sectionTempId, field.tempId, { placeholder: e.target.value })}
            />
          </div>
        )}

        {/* Options for choice fields */}
        {["select","multi_select","radio","checkbox"].includes(field.type) && (
          <div className="space-y-2">
            <Label className="text-sm">Options</Label>
            <div className="space-y-2">
              {(field.options || []).map((opt: any, idx: number) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Input
                    value={opt.label}
                    onChange={e => {
                      const newOpts = [...field.options]
                      newOpts[idx] = {
                        label: e.target.value,
                        value: e.target.value.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ""),
                      }
                      updateField(sectionTempId, field.tempId, { options: newOpts })
                    }}
                    placeholder="Option label"
                  />
                  <Button variant="ghost" size="icon" onClick={() => {
                    const newOpts = field.options.filter((_: any, i: number) => i !== idx)
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
          </div>
        )}

        {/* Basic options for rating/range/file */}
        {field.type === "rating" && (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-sm">Min</Label>
              <Input type="number" value={field.options?.min ?? 1} onChange={e => updateField(sectionTempId, field.tempId, { options: { ...field.options, min: Number(e.target.value) } })} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Max</Label>
              <Input type="number" value={field.options?.max ?? 5} onChange={e => updateField(sectionTempId, field.tempId, { options: { ...field.options, max: Number(e.target.value) } })} />
            </div>
          </div>
        )}

        {["range","file","image"].includes(field.type) && (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-sm">Min {field.type === "range" ? "Value" : "Size (KB)"}</Label>
              <Input type="number" value={field.options?.min ?? (field.type === "range" ? 0 : undefined)} onChange={e => updateField(sectionTempId, field.tempId, { options: { ...field.options, min: Number(e.target.value) } })} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Max {field.type === "range" ? "Value" : "Size (KB)"}</Label>
              <Input type="number" value={field.options?.max ?? (field.type === "range" ? 100 : 2048)} onChange={e => updateField(sectionTempId, field.tempId, { options: { ...field.options, max: Number(e.target.value) } })} />
            </div>
          </div>
        )}

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Checkbox checked={field.required} onCheckedChange={c => updateField(sectionTempId, field.tempId, { required: !!c })} />
            <Label className="text-sm font-normal">Required field</Label>
          </div>
        </div>

        {/* ─── Rules Section ──────────────────────────────────────────────── */}
        <div className="space-y-3 border-t pt-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Validation Rules</Label>
            <Button variant="outline" size="sm" onClick={addRule}><Plus className="h-3.5 w-3.5 mr-1" /> Add Rule</Button>
          </div>

          {(field.rules || []).length === 0 && (
            <p className="text-sm text-muted-foreground italic">No validation rules yet</p>
          )}

          {(field.rules || []).map((rule: ValidationRule, idx: number) => (
            <div key={idx} className="flex gap-3 items-start bg-background/50 p-3 rounded border">
              <Select
                value={rule.type}
                onValueChange={v => updateRule(idx, { type: v })}
              >
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
                className="flex-1"
              />

              <Input
                placeholder="Error message (optional)"
                value={rule.message ?? ""}
                onChange={e => updateRule(idx, { message: e.target.value })}
                className="flex-1"
              />

              <Button variant="ghost" size="icon" onClick={() => removeRule(idx)}>
             x
              </Button>
            </div>
          ))}
        </div>

        {/* ─── Conditions (Show/Hide Logic) ───────────────────────────────── */}
        <div className="space-y-3 border-t pt-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Visibility Conditions</Label>
            <Button variant="outline" size="sm" onClick={addCondition}><Plus className="h-3.5 w-3.5 mr-1" /> Add Condition</Button>
          </div>

          {!field.conditions && (
            <p className="text-sm text-muted-foreground italic">No visibility conditions</p>
          )}

          {(field.conditions || []).map((cond: Condition, idx: number) => (
            <div key={idx} className="flex gap-2 items-center bg-background/50 p-3 rounded border">
              <Input
                placeholder="Field key to watch"
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
                value={cond.value}
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

      <Button variant="ghost" size="icon" onClick={() => removeField(sectionTempId, field.tempId)} className="text-destructive mt-2">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

// ──────────────────────────────────────────────
// Live Preview (small enhancement – shows required + some rules)
// ──────────────────────────────────────────────

