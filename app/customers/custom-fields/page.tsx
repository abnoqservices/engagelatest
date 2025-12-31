"use client"

import * as React from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  type UniqueIdentifier,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { DashboardLayout } from "@/components/dashboard/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { GripVertical, Plus, Trash2, Save } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import axiosClient from "@/lib/axiosClient"
import { showToast } from "@/lib/showToast"

type CustomField = {
  id: string
  key: string
  label: string
  type: string
  is_required: boolean
  is_active: boolean
  order: number               // now required & managed
  options?: { choices?: string[] } | null
  isNew?: boolean
  isDirty?: boolean
}

function SortableFieldItem({
  field,
  updateField,
  saveField,
  deleteField,
  savingIds,
}: {
  field: CustomField
  updateField: (id: string, updates: Partial<CustomField>) => void
  saveField: (field: CustomField) => void
  deleteField: (id: string) => void
  savingIds: Set<string>
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border bg-card/50 p-5 shadow-sm transition-all hover:shadow ${
        isDragging ? "ring-2 ring-primary z-10" : ""
      }`}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {/* Drag handle */}
        <div
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className="hidden cursor-grab items-center pt-3 sm:flex touch-none"
        >
          <GripVertical className="h-6 w-6 text-muted-foreground/70 hover:text-foreground" />
        </div>

        {/* Mobile drag hint */}
        <div className="mb-4 flex items-center justify-between sm:hidden">
          <div className="flex items-center gap-2 text-muted-foreground">
            <GripVertical className="h-5 w-5" />
            <span className="text-sm">Drag to reorder</span>
          </div>
        </div>

        {/* Form content */}
        <div className="flex-1 grid gap-5 sm:grid-cols-2 lg:grid-cols-12">
          <div className="space-y-2 lg:col-span-3">
            <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Key (unique)
            </Label>
            <Input
              value={field.key}
              onChange={(e) => updateField(field.id, { key: e.target.value })}
              placeholder="e.g. preferred_contact_method"
              disabled={!field.isNew}
              className={!field.isNew ? "bg-muted/50" : ""}
            />
          </div>

          <div className="space-y-2 lg:col-span-3">
            <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Label
            </Label>
            <Input
              value={field.label}
              onChange={(e) => updateField(field.id, { label: e.target.value })}
              placeholder="e.g. Preferred Contact Method"
            />
          </div>

          <div className="space-y-2 lg:col-span-3">
            <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Type
            </Label>
            <Select
              value={field.type}
              onValueChange={(v) => updateField(field.id, { type: v })}
              disabled={!field.isNew}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="textarea">Textarea</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="select">Select</SelectItem>
                <SelectItem value="multi_select">Multi Select</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
                <SelectItem value="radio">Radio</SelectItem>
                <SelectItem value="url">URL</SelectItem>
                <SelectItem value="boolean">Boolean</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-row gap-6 pt-2 lg:col-span-3 lg:flex-col lg:gap-4 lg:pt-8">
            <div className="flex items-center gap-2">
              <Switch
                checked={field.is_required}
                onCheckedChange={(v) => updateField(field.id, { is_required: v })}
              />
              <Label className="text-sm font-medium">Required</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={field.is_active}
                onCheckedChange={(v) => updateField(field.id, { is_active: v })}
              />
              <Label className="text-sm font-medium">Active</Label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 sm:justify-start sm:pl-4">
          {field.isDirty && (
            <Button
              size="sm"
              onClick={() => saveField(field)}
              disabled={savingIds.has(field.id)}
              className="min-w-[90px]"
            >
              {savingIds.has(field.id) ? (
                <Spinner className="size-3.5 mr-2" />
              ) : (
                <Save className="size-3.5 mr-2" />
              )}
              Save
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive px-2.5"
            onClick={() => deleteField(field.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function CustomFieldsPage() {
  const [fields, setFields] = React.useState<CustomField[]>([])
  const [loading, setLoading] = React.useState(true)
  const [savingIds, setSavingIds] = React.useState<Set<string>>(new Set())
  const [activeDragId, setActiveDragId] = React.useState<UniqueIdentifier | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // Load fields + ensure order exists
  async function loadFields() {
    try {
      setLoading(true)
      const res = await axiosClient.get("/contacts/custom-fields")
      console.log("Custom fields response:", res.data)
      const { success, data, message } = res.data

      if (success && Array.isArray(data)) {
        const loaded = data.map((f: any, index: number) => ({
          id: String(f.id),
          key: f.key,
          label: f.label,
          type: f.type,
          is_required: !!f.is_required,
          is_active: !!f.is_active,
          order: f.order ?? index,
          options: f.options || null,
        }))
        // sort by order just in case backend sends unsorted
        loaded.sort((a, b) => a.order - b.order)
        setFields(loaded)
      } else {
        showToast(message || "No custom fields data received", "warning")
      }
    } catch (err: any) {
      console.error("Failed to load custom fields:", err)
      showToast(`Cannot load custom fields: ${err.message}`, "error")
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    loadFields()
  }, [])

  const addNewField = () => {
    const newOrder = fields.length
    const newField: CustomField = {
      id: `new-${Date.now()}`,
      key: "",
      label: "",
      type: "text",
      is_required: false,
      is_active: true,
      order: newOrder,
      isNew: true,
      isDirty: true,
    }
    setFields((prev) => [...prev, newField])
  }

  const updateField = (id: string, updates: Partial<CustomField>) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates, isDirty: true } : f))
    )
  }

  const saveField = async (field: CustomField) => {
    if (savingIds.has(field.id)) return
    setSavingIds((prev) => new Set([...prev, field.id]))

    try {
      if (field.isNew) {
        if (!field.key.trim() || !field.label.trim()) {
          showToast("Key and Label are required", "error")
          return
        }

        const payload = {
          key: field.key.trim(),
          label: field.label.trim(),
          type: field.type,
          options: field.options || null,
          is_required: field.is_required,
          is_active: field.is_active,
          order: field.order,
        }

        const res = await axiosClient.post("/contacts/custom-fields", payload)
        const { success, data, message } = res.data

        if (success) {
          showToast(message || "Field created", "success")
          setFields((prev) =>
            prev.map((f) =>
              f.id === field.id
                ? { ...data, id: String(data.id), isNew: false, isDirty: false }
                : f
            )
          )
        } else {
          showToast(message || "Create failed", "error")
        }
      } else {
        const payload: any = {}
        if (field.label !== undefined) payload.label = field.label.trim()
        if ("is_required" in field) payload.is_required = field.is_required
        if ("is_active" in field) payload.is_active = field.is_active
        if (field.options !== undefined) payload.options = field.options
        if ("order" in field) payload.order = field.order   // ← send new order

        if (Object.keys(payload).length === 0) return

        const res = await axiosClient.put(`/contacts/custom-fields/${field.id}`, payload)
        const { success, message } = res.data

        if (success) {
          showToast(message || "Field updated", "success")
          updateField(field.id, { isDirty: false })
        } else {
          showToast(message || "Update failed", "error")
        }
      }
    } catch (err: any) {
      console.error(err)
      showToast(err.response?.data?.message || "Save error", "error")
    } finally {
      setSavingIds((prev) => {
        const next = new Set(prev)
        next.delete(field.id)
        return next
      })
    }
  }

  const deleteField = async (id: string) => {
    const field = fields.find((f) => f.id === id)
    if (!field) return

    if (field.isNew) {
      setFields((prev) => prev.filter((f) => f.id !== id))
      return
    }

    if (!confirm("Delete this custom field? All associated contact values will be removed.")) return

    try {
      const res = await axiosClient.delete(`/contacts/custom-fields/${id}`)
      const { success, message } = res.data

      if (success) {
        showToast(message || "Field deleted", "success")
        setFields((prev) => prev.filter((f) => f.id !== id))
      } else {
        showToast(message || "Delete failed", "error")
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || "Delete error", "error")
    }
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveDragId(event.active.id)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveDragId(null)

    if (!over || active.id === over.id) return

    setFields((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id)
      const newIndex = items.findIndex((i) => i.id === over.id)

      if (oldIndex === newIndex) return items

      const newItems = arrayMove(items, oldIndex, newIndex)

      // Update order numbers & mark as dirty
      return newItems.map((item, idx) => ({
        ...item,
        order: idx,
        isDirty: true,           // so user can save new order
      }))
    })
  }

  const activeField = activeDragId
    ? fields.find((f) => f.id === activeDragId)
    : null

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner className="size-10" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 md:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Custom Fields</h1>
            <p className="mt-1.5 text-muted-foreground">
              Add, manage and reorder custom fields for contacts
            </p>
          </div>
          <Button onClick={addNewField} className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Field
          </Button>
        </div>

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle>Contact Custom Fields</CardTitle>
            <CardDescription>
              Drag rows to reorder. Changes to order are saved individually.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {fields.length === 0 ? (
              <div className="rounded-lg border border-dashed py-16 text-center text-muted-foreground">
                <p className="mb-2 text-lg font-medium">No custom fields yet</p>
                <p className="text-sm">Click "Add New Field" to get started.</p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-4">
                    {fields.map((field) => (
                      <SortableFieldItem
                        key={field.id}
                        field={field}
                        updateField={updateField}
                        saveField={saveField}
                        deleteField={deleteField}
                        savingIds={savingIds}
                      />
                    ))}
                  </div>
                </SortableContext>

                <DragOverlay adjustScale={false}>
                  {activeField ? (
                    <div className="rounded-xl border bg-card/80 p-5 shadow-lg opacity-90 ring-2 ring-primary/50">
                      <div className="flex items-center gap-3 opacity-50">
                        <GripVertical className="h-6 w-6" />
                        <span className="font-medium">{activeField.label || "New field"}</span>
                      </div>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}

            <Button
              variant="outline"
              className="mt-6 w-full gap-2 py-6"
              onClick={addNewField}
            >
              <Plus className="h-4 w-4" />
              Add New Custom Field
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}