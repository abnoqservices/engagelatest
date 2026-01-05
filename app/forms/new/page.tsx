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
import {
  Type,
  Mail,
  Phone,
  Calendar,
  Clock,
  CalendarClock,
  Hash,
  Lock,
  CheckSquare,
  ToggleLeft,
  Upload,
  Image,
  Link2,
  Star,
  SlidersHorizontal,
  Palette,
  EyeOff,
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

interface Field {
  id?: number
  tempId: string
  type: string
  label: string
  placeholder?: string
  required: boolean
  key?: string
  options?: FieldOption[]
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
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  React.useEffect(() => {
    if (formId) {
      loadForm()
    } else {
      setSections([])
      setLoading(false)
    }
  }, [formId])

  const loadForm = async () => {
    try {
      const res = await axiosClient.get(`/forms/${formId}`)
      if (res.data.success) {
        const data = res.data.data
        setFormData((prev) => ({
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
              options: f.options?.choices || undefined,
              order: f.order ?? fIndex,
            })),
          }))
          loadedSections.sort((a, b) => a.order - b.order)
          loadedSections.forEach(sec => sec.fields.sort((a, b) => a.order - b.order))
          setSections(loadedSections)
        } else {
          setSections([{
            tempId: "main",
            title: "Main Section",
            order: 0,
            fields: [],
          }])
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
    setSections(prev =>
      prev.map(s => s.tempId === tempId ? { ...s, ...updates } : s)
    )
  }

  const deleteSection = async (section: Section) => {
    if (section.id) {
      try {
        await axiosClient.delete(`/sections/${section.id}`)
      } catch (err) {
        showToast("Failed to delete section", "error")
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
      placeholder: ["textarea", "text", "email", "url", "password"].includes(type) ? "" : undefined,
      options: ["select", "multi_select", "radio", "checkbox"].includes(type)
        ? [{ label: "Option 1", value: "option1" }]
        : undefined,
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

    if (activeId.startsWith("section-")) {
      const activeIndex = sections.findIndex(s => s.tempId === activeId.replace("section-", ""))
      const overIndex = sections.findIndex(s => s.tempId === overId.replace("section-", ""))
      if (activeIndex !== -1 && overIndex !== -1) {
        setSections(arrayMove(sections, activeIndex, overIndex).map((s, idx) => ({ ...s, order: idx })))
      }
      return
    }

    let fromSection: Section | null = null
    let fromIndex = -1
    let toSection: Section | null = null
    let toIndex = -1

    sections.forEach(sec => {
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
    })

    if (fromSection && toSection && fromIndex !== -1) {
      if (fromSection.tempId === toSection.tempId) {
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

  const SortableSection = ({ section }: { section: Section }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: `section-${section.tempId}` })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    }

    return (
      <div ref={setNodeRef} style={style} className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div {...attributes} {...listeners} className="cursor-move">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            value={section.title}
            onChange={(e) => updateSection(section.tempId, { title: e.target.value })}
            className="text-lg font-semibold h-9"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateSection(section.tempId, { collapsed: !section.collapsed })}
          >
            {section.collapsed ? <ChevronDown /> : <ChevronUp />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteSection(section)}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {!section.collapsed && (
          <div className="space-y-4 pl-8">
            <SortableContext
              items={section.fields.map(f => f.tempId)}
              strategy={verticalListSortingStrategy}
            >
              {section.fields.map((field) => (
                <SortableField key={field.tempId} sectionTempId={section.tempId} field={field} />
              ))}
            </SortableContext>

            <Select onValueChange={(type) => addField(section.tempId, type)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Add a field..." />
              </SelectTrigger>
              <SelectContent>
                {fieldTypes.map((type) => {
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
        )}
      </div>
    )
  }

  const SortableField = ({ sectionTempId, field }: { sectionTempId: string; field: Field }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id: field.tempId })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-4"
      >
        <div {...attributes} {...listeners} className="cursor-move mt-2">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="flex-1 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm">Field Type</Label>
              <Select
                value={field.type}
                onValueChange={(v) => {
                  const updates: Partial<Field> = { type: v }
                  if (["select", "multi_select", "radio", "checkbox"].includes(v)) {
                    updates.options = field.options || [{ label: "Option 1", value: "option1" }]
                  } else {
                    updates.options = undefined
                  }
                  updateField(sectionTempId, field.tempId, updates)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fieldTypes.map((type) => {
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

            <div className="space-y-2">
              <Label className="text-sm">Field Label</Label>
              <Input
                value={field.label}
                onChange={(e) => updateField(sectionTempId, field.tempId, { label: e.target.value })}
              />
            </div>
          </div>

          {["text", "textarea", "email", "url", "password", "number", "phone", "date", "time", "datetime"].includes(field.type) && (
            <div className="space-y-2">
              <Label className="text-sm">Placeholder</Label>
              <Input
                value={field.placeholder || ""}
                onChange={(e) => updateField(sectionTempId, field.tempId, { placeholder: e.target.value })}
                placeholder="Optional placeholder..."
              />
            </div>
          )}

          {["select", "multi_select", "radio", "checkbox"].includes(field.type) && (
            <div className="space-y-2">
              <Label className="text-sm">Options</Label>
              <div className="space-y-2">
                {(field.options || []).map((opt, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={opt.label}
                      onChange={(e) => {
                        const newOpts = [...(field.options || [])]
                        newOpts[idx] = {
                          ...newOpts[idx],
                          label: e.target.value,
                          value: e.target.value.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ""),
                        }
                        updateField(sectionTempId, field.tempId, { options: newOpts })
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newOpts = (field.options || []).filter((_, i) => i !== idx)
                        updateField(sectionTempId, field.tempId, { options: newOpts })
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newOpts = [
                      ...(field.options || []),
                      { label: "New Option", value: `option_${(field.options || []).length + 1}` },
                    ]
                    updateField(sectionTempId, field.tempId, { options: newOpts })
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Option
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={field.required}
                onCheckedChange={(c) => updateField(sectionTempId, field.tempId, { required: !!c })}
              />
              <Label className="text-sm font-normal">Required field</Label>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeField(sectionTempId, field.tempId)}
          className="text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  // ... (all imports, interfaces, state, functions remain exactly the same until renderPreviewField)

const renderPreviewField = (field: Field) => {
  // Stable identifier — prefer key if exists, otherwise generate from label, fallback to tempId
  const baseId = field.key || generateKey(field.label) || `field-${field.tempId}`;
  const fieldId = `preview-${baseId}`;

  // Shared name for radio/checkbox groups; individual fields use their own for others
  const fieldName = baseId;

  // Common props for most input-like elements
  const commonInputProps = {
    id: fieldId,
    name: fieldName,
    placeholder: field.placeholder || "",
    readOnly: true,
    tabIndex: -1,
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => e.target.blur(),
    className: "h-9 text-sm bg-muted/50 cursor-default pointer-events-none",
  };

  switch (field.type) {
    case "textarea":
      return <Textarea {...commonInputProps} rows={3} value={field.label} />;

    case "text":
    case "email":
    case "url":
    case "password":
    case "phone":
      return (
        <Input
          type={field.type === "phone" ? "tel" : field.type}
          {...commonInputProps}
          value={field.label || "example"}
        />
      );

    case "number":
    case "range":
    case "rating":
      return <Input type="number" {...commonInputProps} value="42" />;

    case "date":
      return <Input type="date" {...commonInputProps} value="2025-01-15" />;

    case "time":
      return <Input type="time" {...commonInputProps} value="14:30" />;

    case "datetime":
      return <Input type="datetime-local" {...commonInputProps} value="2025-01-15T14:30" />;

    case "color":
      return (
        <div className="flex items-center gap-2">
          <Input
            type="color"
            id={fieldId}
            name={fieldName}
            value="#6366f1"
            readOnly
            className="h-8 w-12 p-1 pointer-events-none"
          />
          <span className="text-sm text-muted-foreground">#6366f1</span>
        </div>
      );

    case "select":
    case "multi_select":
      return (
        <div className="relative">
          <Select disabled>
            <SelectTrigger id={fieldId} name={fieldName} className="bg-muted/50 cursor-default">
              <SelectValue placeholder="Option 1" />
            </SelectTrigger>
          </Select>
        </div>
      );

    case "radio":
      return (
        <RadioGroup defaultValue="option1" className="space-y-2" name={fieldName}>
          {(field.options || []).map((opt, index) => {
            const optId = `${fieldId}-${index}`;
            return (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem id={optId} value={opt.value} />
                <Label htmlFor={optId} className="text-sm">{opt.label}</Label>
              </div>
            );
          })}
        </RadioGroup>
      );

    case "checkbox":
      return (
        <div className="space-y-2">
          {(field.options || []).map((opt, index) => {
            const optId = `${fieldId}-${index}`;
            return (
              <div key={opt.value} className="flex items-center space-x-2">
                <Checkbox id={optId} defaultChecked={opt.value === "option1"} />
                <Label htmlFor={optId} className="text-sm">{opt.label}</Label>
              </div>
            );
          })}
        </div>
      );

    case "toggle":
      return <Switch disabled checked={true} />;

    case "file":
    case "image":
      return (
        <div className="border border-dashed rounded-md p-4 text-center text-sm text-muted-foreground bg-muted/30">
          {field.type === "image" ? "Image preview area" : "File upload area"}
        </div>
      );

    case "hidden":
      return null;

    default:
      return <Input {...commonInputProps} value={field.label || "example"} />;
  }
};

// ... (rest of the component remains the same until the preview JSX)

{/* Inside the preview mapping – make sure Label uses htmlFor correctly */}

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
                : { placeholder: field.placeholder || "" },
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
      showToast("Failed to save form", "error")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">Loading...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/forms">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">
                {formId ? "Edit Form" : "Create Form"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Design a custom form with sections and ordering
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => saveForm(false)} disabled={saving}>
              <Save className="h-4 w-4 mr-2" /> Save Draft
            </Button>
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" /> Preview
            </Button>
            <Button onClick={() => saveForm(true)} disabled={saving}>
              <Check className="h-4 w-4 mr-2" />
              {formId ? "Update & Publish" : "Publish Form"}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Form Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Form Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Contact Form"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Form Sections & Fields</CardTitle>
                    <CardDescription>Organize your form into sections</CardDescription>
                  </div>
                  <Button onClick={addSection} size="sm">
                    <Plus className="h-4 w-4 mr-2" /> Add Section
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={sections.map(s => `section-${s.tempId}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    {sections.map((section) => (
                      <SortableSection key={section.tempId} section={section} />
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

            <Card>
              <CardHeader>
                <CardTitle>Success Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Success Message</Label>
                  <Textarea
                    value={formData.success_message}
                    onChange={(e) => setFormData(prev => ({ ...prev, success_message: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Redirect URL (Optional)</Label>
                  <Input
                    type="url"
                    value={formData.redirect_url || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, redirect_url: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-lg border bg-background p-6 space-y-8 pointer-events-none select-none">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-background p-6 space-y-8">
                  <div>
                    <h3 className="text-xl font-bold">{formData.name || "Untitled Form"}</h3>
                    {formData.description && (
                      <p className="text-sm text-muted-foreground mt-1">{formData.description}</p>
                    )}
                  </div>

                  {sections.map((section) => (
                    <div key={section.tempId} className="space-y-4">
                      <h4 className="font-semibold text-lg">{section.title}</h4>
                      <div className="space-y-4">
                        {section.fields.map((field) => {
                          const baseId = field.key || generateKey(field.label) || `field-${field.tempId}`;
                          const fieldId = `preview-${baseId}`;

                          return (
                            <div key={field.tempId} className="space-y-1">
                              <Label htmlFor={fieldId} className="text-sm">
                                {field.label}
                                {field.required && <span className="text-destructive ml-1">*</span>}
                              </Label>
                              {renderPreviewField(field)}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <Button className="w-full" disabled>Submit</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}