"use client"

import * as React from "react"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, GripVertical } from "lucide-react"
import type {
  AutomationStep,
  StepConfig,
  ConditionConfig,
  ActionConfig,
  DelayConfig,
} from "@/lib/types/workflow"

interface StepEditorProps {
  step: AutomationStep
  index: number
  onUpdate: (step: AutomationStep) => void
  onDelete: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

export function StepEditor({
  step,
  index,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
}: StepEditorProps) {
  const handleTypeChange = (type: "condition" | "action" | "delay") => {
    let defaultConfig: StepConfig = {}

    if (type === "condition") {
      defaultConfig = { condition_type: "email_exists" } as ConditionConfig
    } else if (type === "action") {
      defaultConfig = { action_type: "send_email" } as ActionConfig
    } else if (type === "delay") {
      defaultConfig = { seconds: 3600 } as DelayConfig
    }

    onUpdate({
      ...step,
      type,
      config: defaultConfig,
    })
  }

  const handleConfigUpdate = (updates: Partial<StepConfig>) => {
    onUpdate({
      ...step,
      config: {
        ...step.config,
        ...updates,
      },
    })
  }

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {canMoveUp && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={onMoveUp}
                >
                  <GripVertical className="h-4 w-4" />
                </Button>
              )}
            </div>
            <CardTitle className="text-sm font-medium">
              Step {index + 1}: {step.type.charAt(0).toUpperCase() + step.type.slice(1)}
            </CardTitle>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Step Type */}
        <div className="space-y-2">
          <Label>Step Type</Label>
          <Select value={step.type} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="condition">Condition</SelectItem>
              <SelectItem value="action">Action</SelectItem>
              <SelectItem value="delay">Delay</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Condition Configuration */}
        {step.type === "condition" && (
          <ConditionConfigEditor
            config={step.config as ConditionConfig}
            onUpdate={handleConfigUpdate}
          />
        )}

        {/* Action Configuration */}
        {step.type === "action" && (
          <ActionConfigEditor
            config={step.config as ActionConfig}
            onUpdate={handleConfigUpdate}
          />
        )}

        {/* Delay Configuration */}
        {step.type === "delay" && (
          <DelayConfigEditor
            config={step.config as DelayConfig}
            onUpdate={handleConfigUpdate}
          />
        )}
      </CardContent>
    </Card>
  )
}

interface ConditionConfigEditorProps {
  config: ConditionConfig
  onUpdate: (updates: Partial<ConditionConfig>) => void
}

function ConditionConfigEditor({ config, onUpdate }: ConditionConfigEditorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Condition Type</Label>
        <Select
          value={config.condition_type}
          onValueChange={(value) =>
            onUpdate({
              condition_type: value as ConditionConfig["condition_type"],
              field_name: undefined,
              expected_value: undefined,
              threshold: undefined,
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email_exists">Email exists</SelectItem>
            <SelectItem value="phone_exists">Phone exists</SelectItem>
            <SelectItem value="form_field_equals">Form field equals</SelectItem>
            <SelectItem value="form_field_greater_than">Form field greater than</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {config.condition_type === "form_field_equals" && (
        <>
          <div className="space-y-2">
            <Label>Field Name</Label>
            <Input
              value={config.field_name || ""}
              onChange={(e) => onUpdate({ field_name: e.target.value })}
              placeholder="e.g., role, budget"
            />
          </div>
          <div className="space-y-2">
            <Label>Expected Value</Label>
            <Input
              value={config.expected_value?.toString() || ""}
              onChange={(e) => onUpdate({ expected_value: e.target.value })}
              placeholder="e.g., CTO, 50000"
            />
          </div>
        </>
      )}

      {config.condition_type === "form_field_greater_than" && (
        <>
          <div className="space-y-2">
            <Label>Field Name</Label>
            <Input
              value={config.field_name || ""}
              onChange={(e) => onUpdate({ field_name: e.target.value })}
              placeholder="e.g., budget, score"
            />
          </div>
          <div className="space-y-2">
            <Label>Threshold</Label>
            <Input
              type="number"
              value={config.threshold?.toString() || ""}
              onChange={(e) => onUpdate({ threshold: parseFloat(e.target.value) || 0 })}
              placeholder="e.g., 50000"
            />
          </div>
        </>
      )}
    </div>
  )
}

interface ActionConfigEditorProps {
  config: ActionConfig
  onUpdate: (updates: Partial<ActionConfig>) => void
}

function ActionConfigEditor({ config, onUpdate }: ActionConfigEditorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Action Type</Label>
        <Select
          value={config.action_type}
          onValueChange={(value) =>
            onUpdate({
              action_type: value as ActionConfig["action_type"],
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="send_email">Send Email</SelectItem>
            <SelectItem value="send_whatsapp">Send WhatsApp</SelectItem>
            <SelectItem value="send_sms">Send SMS</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Template ID (optional)</Label>
        <Input
          value={config.template_id || ""}
          onChange={(e) => onUpdate({ template_id: e.target.value })}
          placeholder="e.g., welcome_email_1"
        />
        <p className="text-xs text-muted-foreground">
          Template ID for the notification (handled by Laravel backend)
        </p>
      </div>
    </div>
  )
}

interface DelayConfigEditorProps {
  config: DelayConfig
  onUpdate: (updates: Partial<DelayConfig>) => void
}

function DelayConfigEditor({ config, onUpdate }: DelayConfigEditorProps) {
  const [seconds, setSeconds] = React.useState(config.seconds?.toString() || "3600")
  const [unit, setUnit] = React.useState<"seconds" | "minutes" | "hours" | "days">("hours")

  // Convert seconds to human-readable units for display
  React.useEffect(() => {
    const secs = config.seconds || 3600
    if (secs % 86400 === 0) {
      setUnit("days")
      setSeconds((secs / 86400).toString())
    } else if (secs % 3600 === 0) {
      setUnit("hours")
      setSeconds((secs / 3600).toString())
    } else if (secs % 60 === 0) {
      setUnit("minutes")
      setSeconds((secs / 60).toString())
    } else {
      setUnit("seconds")
      setSeconds(secs.toString())
    }
  }, [config.seconds])

  const handleValueChange = (value: string, newUnit: typeof unit) => {
    const numValue = parseFloat(value) || 0
    let totalSeconds = 0

    switch (newUnit) {
      case "days":
        totalSeconds = numValue * 86400
        break
      case "hours":
        totalSeconds = numValue * 3600
        break
      case "minutes":
        totalSeconds = numValue * 60
        break
      case "seconds":
        totalSeconds = numValue
        break
    }

    onUpdate({ seconds: totalSeconds })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Wait Duration</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            value={seconds}
            onChange={(e) => {
              setSeconds(e.target.value)
              handleValueChange(e.target.value, unit)
            }}
            min="0"
            className="flex-1"
          />
          <Select
            value={unit}
            onValueChange={(value) => {
              const newUnit = value as typeof unit
              setUnit(newUnit)
              handleValueChange(seconds, newUnit)
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seconds">Seconds</SelectItem>
              <SelectItem value="minutes">Minutes</SelectItem>
              <SelectItem value="hours">Hours</SelectItem>
              <SelectItem value="days">Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-muted-foreground">
          Execution will pause for this duration before continuing to the next step
        </p>
      </div>
    </div>
  )
}
