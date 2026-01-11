"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
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
import { Plus, Save, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { StepEditor } from "@/components/workflows/StepEditor"
import { automationsApi } from "@/lib/api/automation"
import { showToast } from "@/lib/showToast"
import type { AutomationStep } from "@/lib/types/workflow"

// Available trigger events (from Laravel backend)
const TRIGGER_EVENTS = [
  { value: "lead.form_submitted", label: "Lead Form Submitted" },
  { value: "lead.created", label: "New Lead Created" },
  { value: "qr.scanned", label: "QR Code Scanned" },
  { value: "event.attended", label: "Event Attended" },
]

export default function EditWorkflowPage() {
  const router = useRouter()
  const params = useParams()
  const workflowId = params.id as string

  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [name, setName] = React.useState("")
  const [triggerEvent, setTriggerEvent] = React.useState("")
  const [steps, setSteps] = React.useState<AutomationStep[]>([])

  // Fetch workflow data
  React.useEffect(() => {
    const fetchWorkflow = async () => {
      try {
        setLoading(true)
        const workflow = await automationsApi.get(workflowId)
        setName(workflow.name)
        setTriggerEvent(workflow.trigger_event)
        setSteps(
          (workflow.steps || []).sort((a, b) => a.order - b.order)
        )
      } catch (error: any) {
        console.error("Error fetching workflow:", error)
        showToast("Failed to load workflow", "error")
        router.push("/workflows")
      } finally {
        setLoading(false)
      }
    }

    if (workflowId) {
      fetchWorkflow()
    }
  }, [workflowId, router])

  const handleAddStep = () => {
    const newStep: AutomationStep = {
      order: steps.length,
      type: "action",
      config: { action_type: "send_email" },
    }
    setSteps([...steps, newStep])
  }

  const handleUpdateStep = (index: number, updatedStep: AutomationStep) => {
    const newSteps = [...steps]
    newSteps[index] = { ...updatedStep, order: index }
    setSteps(newSteps)
  }

  const handleDeleteStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index)
    // Reorder remaining steps
    const reorderedSteps = newSteps.map((step, i) => ({
      ...step,
      order: i,
    }))
    setSteps(reorderedSteps)
  }

  const handleMoveStep = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === steps.length - 1)
    ) {
      return
    }

    const newSteps = [...steps]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    ;[newSteps[index], newSteps[targetIndex]] = [
      newSteps[targetIndex],
      newSteps[index],
    ]

    // Reorder
    const reorderedSteps = newSteps.map((step, i) => ({
      ...step,
      order: i,
    }))
    setSteps(reorderedSteps)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      showToast("Workflow name is required", "error")
      return
    }

    if (!triggerEvent) {
      showToast("Trigger event is required", "error")
      return
    }

    if (steps.length === 0) {
      showToast("At least one step is required", "error")
      return
    }

    try {
      setSaving(true)
      await automationsApi.update(workflowId, {
        name: name.trim(),
        trigger_event: triggerEvent,
        steps: steps.map((step) => ({
          order: step.order,
          type: step.type,
          config: step.config,
        })),
      })
      showToast("Workflow updated successfully", "success")
      router.push("/workflows")
    } catch (error: any) {
      showToast(
        error.response?.data?.detail || "Failed to update workflow",
        "error"
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/workflows">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Edit Workflow</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Update your workflow configuration
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/workflows">
              <Button variant="outline" disabled={saving}>
                Cancel
              </Button>
            </Link>
            <Button onClick={handleSubmit} disabled={saving} className="gap-2">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Name and configure your workflow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Workflow Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Welcome Sequence"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trigger">Trigger Event</Label>
                <Select value={triggerEvent} onValueChange={setTriggerEvent} required>
                  <SelectTrigger id="trigger">
                    <SelectValue placeholder="Select a trigger event..." />
                  </SelectTrigger>
                  <SelectContent>
                    {TRIGGER_EVENTS.map((trigger) => (
                      <SelectItem key={trigger.value} value={trigger.value}>
                        {trigger.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  This event will trigger the workflow execution
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Steps Builder */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Workflow Steps</CardTitle>
                  <CardDescription>
                    Define the sequence of conditions, actions, and delays
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {steps.map((step, index) => (
                <StepEditor
                  key={index}
                  step={step}
                  index={index}
                  onUpdate={(updatedStep) => handleUpdateStep(index, updatedStep)}
                  onDelete={() => handleDeleteStep(index)}
                  onMoveUp={index > 0 ? () => handleMoveStep(index, "up") : undefined}
                  onMoveDown={
                    index < steps.length - 1
                      ? () => handleMoveStep(index, "down")
                      : undefined
                  }
                  canMoveUp={index > 0}
                  canMoveDown={index < steps.length - 1}
                />
              ))}

              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                onClick={handleAddStep}
              >
                <Plus className="h-4 w-4" />
                Add Step
              </Button>

              {steps.length === 0 && (
                <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    No steps added yet
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddStep}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add First Step
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  )
}
