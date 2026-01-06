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
  Star,
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
  Image as ImageIcon,
  Link2,
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
  { value: "image", label: "Image Upload", icon: ImageIcon },
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
  status: "draft" | "active"
  success_message: string
  redirect_url?: string
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
  })

  const [sections, setSections] = React.useState<Section[]>([])
  const [usedKeys, setUsedKeys] = React.useState<Set<string>>(new Set())

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
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
          fields: [],
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
        setFormData({
          id: data.id,
          name: data.name || "",
          description: data.description || "",
          status: data.is_active ? "active" : "draft",
          success_message: "Thank you for your submission! We'll get back to you soon.",
          redirect_url: "",
        })

        const sectionsRes = await axiosClient.get(`/forms/${formId}/sections`)
        if (sectionsRes.data.success && sectionsRes.data.data.length > 0) {
          const loadedSections = sectionsRes.data.data.map((sec: any, secIndex: number) => ({
            id: sec.id,
            tempId: `sec-${sec.id || Date.now()}`,
            title: sec.title || "Untitled Section",
            order: sec.order ?? secIndex,
            collapsed: false,
            fields: (sec.fields || []).map((f: any, fIndex: number) => {
              const key = f.key || generateKey(f.label)
              return {
                id: f.id,
                tempId: `field-${f.id || Date.now()}-${Math.random()}`,
                type: f.type,
                label: f.label,
                required: f.is_required,
                key,
                placeholder: f.options?.placeholder || "",
                options: f.options?.choices ? f.options.choices.map((c: string) => ({ label: c, value: c })) : undefined,
                order: f.order ?? fIndex,
              }
            }),
          }))
          loadedSections.sort((a, b) => a.order - b.order)
          loadedSections.forEach((sec) => sec.fields.sort((a, b) => a.order - b.order))
          setSections(loadedSections)

          // Populate used keys for uniqueness check
          const keys = new Set<string>()
          loadedSections.forEach((sec) =>
            sec.fields.forEach((f) => {
              if (f.key) keys.add(f.key)
            })
          )
          setUsedKeys(keys)
        }
      }
    } catch (err) {
      showToast("Failed to load form", "error")
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")

  const generateKey = (label: string) =>
    label
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "")

  const isKeyUnique = (key: string, excludeTempId?: string) => {
    if (!key) return true
    for (const section of sections) {
      for (const field of section.fields) {
        if (field.tempId !== excludeTempId && field.key === key) return false
      }
    }
    return true
  }

  const addSection = () => {
    const newSection: Section = {
      tempId: Date.now().toString(),
      title: "New Section",
      order: sections.length,
      fields: [],
      collapsed: false,
    }
    setSections((prev) => [...prev, newSection])
  }

  const updateSection = (tempId: string, updates: Partial<Section>) => {
    setSections((prev) =>
      prev.map((s) => (s.tempId === tempId ? { ...s, ...updates } : s))
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
    setSections((prev) => prev.filter((s) => s.tempId !== section.tempId))
  }

  const addField = (sectionTempId: string, type: string = "text") => {
    const section = sections.find((s) => s.tempId === sectionTempId)
    if (!section) return

    let label = "New Field"
    let key = generateKey(label)
    let counter = 1
    while (!isKeyUnique(key)) {
      label = `New Field ${counter}`
      key = generateKey(label)
      counter++
    }

    const newField: Field = {
      tempId: Date.now().toString(),
      type,
      label,
      key,
      required: false,
      placeholder: ["text", "textarea", "email", "url", "password", "number", "phone", "date", "time", "datetime"].includes(type) ? "" : undefined,
      options: ["select", "multi_select", "radio", "checkbox"].includes(type)
        ? [{ label: "Option 1", value: "option1" }]
        : undefined,
      order: section.fields.length,
    }

    setSections((prev) =>
      prev.map((s) =>
        s.tempId === sectionTempId
          ? { ...s, fields: [...s.fields, newField] }
          : s
      )
    )
    setUsedKeys((prev) => new Set([...prev, key]))
  }

  const updateField = (sectionTempId: string, fieldTempId: string, updates: Partial<Field>) => {
    setSections((prev) =>
      prev.map((s) =>
        s.tempId === sectionTempId
          ? {
              ...s,
              fields: s.fields.map((f) => {
                if (f.tempId === fieldTempId) {
                  const newField = { ...f, ...updates }
                  // Update usedKeys if key changed
                  if (updates.key && updates.key !== f.key) {
                    setUsedKeys((keys) => {
                      const newKeys = new Set(keys)
                      if (f.key) newKeys.delete(f.key)
                      newKeys.add(updates.key!)
                      return newKeys
                    })
                  }
                  return newField
                }
                return f
              }),
            }
          : s
      )
    )
  }

  const removeField = (sectionTempId: string, fieldTempId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.tempId === sectionTempId
          ? {
              ...s,
              fields: s.fields.filter((f) => {
                if (f.tempId === fieldTempId && f.key) {
                  setUsedKeys((keys) => {
                    const newKeys = new Set(keys)
                    newKeys.delete(f.key!)
                    return newKeys
                  })
                }
                return f.tempId !== fieldTempId
              }),
            }
          : s
      )
    )
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId.startsWith("section-")) {
      const activeIndex = sections.findIndex((s) => `section-${s.tempId}` === activeId)
      const overIndex = sections.findIndex((s) => `section-${s.tempId}` === overId)
      if (activeIndex !== -1 && overIndex !== -1) {
        setSections(
          arrayMove(sections, activeIndex, overIndex).map((s, idx) => ({ ...s, order: idx }))
        )
      }
      return
    }

    // Field drag
    let fromSection: Section | null = null
    let fromIndex = -1
    let toSection: Section | null = null
    let toIndex = -1

    sections.forEach((sec) => {
      const fIdx = sec.fields.findIndex((f) => f.tempId === activeId)
      if (fIdx !== -1) {
        fromSection = sec
        fromIndex = fIdx
      }
      const tIdx = sec.fields.findIndex((f) => f.tempId === overId)
      if (tIdx !== -1) {
        toSection = sec
        toIndex = tIdx
      }
    })

    if (fromSection && toSection && fromIndex !== -1) {
      if (fromSection.tempId === toSection.tempId) {
        const newFields = arrayMove(fromSection.fields, fromIndex, toIndex)
        setSections((prev) =>
          prev.map((s) =>
            s.tempId === fromSection!.tempId
              ? { ...s, fields: newFields.map((f, i) => ({ ...f, order: i })) }
              : s
          )
        )
      }
    }
  }

  const getFieldOptionsForApi = (field: Field) => {
    const opts: Record<string, any> = {}

    if (["text", "textarea", "email", "url", "password", "number", "phone", "date", "time", "datetime"].includes(field.type)) {
      if (field.placeholder) opts.placeholder = field.placeholder
    }

    if (["select", "multi_select", "radio", "checkbox"].includes(field.type) && field.options?.length) {
      opts.choices = field.options.map((o) => o.value) // backend expects array of strings
    }

    if (field.type === "rating") {
      opts.min = 1
      opts.max = 5
    }

    if (field.type === "range") {
      opts.min = 0
      opts.max = 100
      opts.step = 1
    }

    if (["file", "image"].includes(field.type)) {
      opts.max_size = 2048 // KB
      opts.allowed_types = field.type === "image" ? ["jpg", "png", "webp", "gif"] : ["pdf", "docx", "txt", "zip"]
    }

    return Object.keys(opts).length > 0 ? opts : null
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
        name: formData.name.trim(),
        slug: formId ? undefined : generateSlug(formData.name.trim()),
        description: formData.description.trim() || null,
        is_active: publish || formData.status === "active",
      }

      if (formId) {
        await axiosClient.put(`/forms/${formId}`, formPayload)
      } else {
        const res = await axiosClient.post("/forms", formPayload)
        savedFormId = res.data.data.id
        router.replace(`/forms/${savedFormId}/edit`)
      }

      // Save sections and fields
      for (const section of sections) {
        let sectionId = section.id

        if (!sectionId) {
          const res = await axiosClient.post(`/forms/${savedFormId}/sections`, {
            title: section.title.trim(),
            order: section.order,
          })
          sectionId = res.data.data.id
        } else {
          await axiosClient.put(`/sections/${sectionId}`, {
            title: section.title.trim(),
            order: section.order,
          })
        }

        for (const field of section.fields) {
          const fieldPayload = {
            form_section_id: sectionId,
            label: field.label.trim(),
            key: field.key || generateKey(field.label),
            type: field.type,
            is_required: field.required,
            is_active: true,
            order: field.order,
            options: getFieldOptionsForApi(field),
          }

          if (field.id) {
            await axiosClient.put(`/fields/${field.id}`, fieldPayload)
          } else {
            await axiosClient.post(`/forms/${savedFormId}/fields`, fieldPayload)
          }
        }
      }

      showToast(publish ? "Form published successfully!" : "Form saved as draft", "success")
    } catch (err: any) {
      console.error(err)
      showToast("Failed to save form", "error")
    } finally {
      setSaving(false)
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
      opacity: isDragging ? 0.6 : 1,
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
              items={section.fields.map((f) => f.tempId)}
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
        className="flex items-start gap-3 rounded-lg border bg-secondary/30 p-4"
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
                        const newValue = e.target.value.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")
                        newOpts[idx] = { label: e.target.value, value: newValue }
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

  const renderPreviewField = (field: Field) => {
    const baseId = field.key || generateKey(field.label) || `field-${field.tempId}`
    const fieldId = `preview-${baseId}`

    const commonProps = {
      id: fieldId,
      readOnly: true,
      tabIndex: -1,
      className: "bg-muted/50 border-muted-foreground/30 cursor-default pointer-events-none",
    }

    switch (field.type) {
      case "textarea":
        return <Textarea {...commonProps} rows={3} value="Example long text..." />

      case "text":
      case "email":
      case "url":
      case "password":
      case "phone":
        return <Input type={field.type === "phone" ? "tel" : field.type} {...commonProps} value="Example value" />

      case "number":
        return <Input type="number" {...commonProps} value="42" />

      case "date":
        return <Input type="date" {...commonProps} value="2025-01-15" />

      case "time":
        return <Input type="time" {...commonProps} value="14:30" />

      case "datetime":
        return <Input type="datetime-local" {...commonProps} value="2025-01-15T14:30" />

      case "select":
      case "multi_select":
        return (
          <Select disabled>
            <SelectTrigger className="bg-muted/50">
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
          </Select>
        )

      case "radio":
        return (
          <RadioGroup defaultValue={field.options?.[0]?.value} className="space-y-2">
            {(field.options || []).map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border border-primary/50 bg-background" />
                <span className="text-sm">{opt.label}</span>
              </div>
            ))}
          </RadioGroup>
        )

      case "checkbox":
        return (
          <div className="space-y-2">
            {(field.options || []).map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <div className="h-4 w-4 rounded border border-primary/50 bg-background" />
                <span className="text-sm">{opt.label}</span>
              </div>
            ))}
          </div>
        )

      case "toggle":
        return <Switch disabled checked={true} />

      case "file":
      case "image":
        return (
          <div className="border-2 border-dashed rounded-lg p-6 text-center text-sm text-muted-foreground bg-muted/30">
            {field.type === "image" ? "Image upload area" : "File upload area"}
          </div>
        )

      case "rating":
        return <div className="flex gap-1 text-2xl">{Array(5).fill("★").join("")}</div>

      case "range":
        return (
          <input
            type="range"
            min={0}
            max={100}
            value={50}
            className="w-full pointer-events-none opacity-60"
          />
        )

      case "color":
        return (
          <div className="flex items-center gap-3">
            <div className="h-8 w-12 rounded border shadow-sm" style={{ backgroundColor: "#8b5cf6" }} />
            <span className="text-sm text-muted-foreground">#8b5cf6</span>
          </div>
        )

      case "hidden":
        return null

      default:
        return <Input {...commonProps} value="Example value" />
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">Loading form...</div>
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
              <h1 className="text-3xl font-bold">{formId ? "Edit Form" : "Create Form"}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Design a custom form with sections and fields
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
            {/* Form Details */}
            <Card>
              <CardHeader>
                <CardTitle>Form Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Form Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Contact Form"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sections & Fields */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Form Sections & Fields</CardTitle>
                    <CardDescription>Organize your form into sections and fields</CardDescription>
                  </div>
                  <Button onClick={addSection} size="sm">
                    <Plus className="h-4 w-4 mr-2" /> Add Section
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext
                    items={sections.map((s) => `section-${s.tempId}`)}
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

            {/* Success Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Success Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Success Message</Label>
                  <Textarea
                    value={formData.success_message}
                    onChange={(e) => setFormData((prev) => ({ ...prev, success_message: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Redirect URL (Optional)</Label>
                  <Input
                    type="url"
                    value={formData.redirect_url || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, redirect_url: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Preview */}
          <div className="space-y-6">
            <Card className="sticky top-6">
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
                        {section.fields.map((field) => (
                          <div key={field.tempId} className="space-y-1">
                            <Label htmlFor={`preview-${field.tempId}`} className="text-sm">
                              {field.label}
                              {field.required && <span className="text-destructive ml-1">*</span>}
                            </Label>
                            {renderPreviewField(field)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <Button className="w-full" disabled>
                    Submit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}