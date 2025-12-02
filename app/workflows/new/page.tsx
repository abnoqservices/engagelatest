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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Zap, Mail, MessageSquare, UserPlus, Bell, ArrowRight, Trash2, Save } from 'lucide-react'
import Link from "next/link"

const triggers = [
  { value: "qr_scan", label: "QR Code Scanned", icon: Zap },
  { value: "new_lead", label: "New Lead Created", icon: UserPlus },
  { value: "event_attend", label: "Event Attended", icon: Bell },
  { value: "form_submit", label: "Form Submitted", icon: MessageSquare },
]

const actions = [
  { value: "send_email", label: "Send Email", icon: Mail },
  { value: "send_sms", label: "Send SMS", icon: MessageSquare },
  { value: "add_tag", label: "Add Tag", icon: Plus },
  { value: "update_score", label: "Update Lead Score", icon: Zap },
  { value: "notify_team", label: "Notify Team", icon: Bell },
]

export default function CreateWorkflowPage() {
  const [workflowActions, setWorkflowActions] = React.useState<string[]>([])

  const addAction = () => {
    setWorkflowActions([...workflowActions, ""])
  }

  const removeAction = (index: number) => {
    setWorkflowActions(workflowActions.filter((_, i) => i !== index))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create Workflow</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Build automated engagement workflows
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/workflows">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button className="gap-2">
              <Save className="h-4 w-4" />
              Save Workflow
            </Button>
          </div>
        </div>

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Name and describe your workflow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Workflow Name</Label>
              <Input id="name" placeholder="e.g., Post-Event Follow-up" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this workflow does..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Trigger */}
        <Card>
          <CardHeader>
            <CardTitle>Trigger</CardTitle>
            <CardDescription>What starts this workflow?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Trigger</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a trigger..." />
                </SelectTrigger>
                <SelectContent>
                  {triggers.map((trigger) => (
                    <SelectItem key={trigger.value} value={trigger.value}>
                      <div className="flex items-center gap-2">
                        <trigger.icon className="h-4 w-4" />
                        {trigger.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>What should happen when triggered?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {workflowActions.map((action, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 space-y-2">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an action..." />
                    </SelectTrigger>
                    <SelectContent>
                      {actions.map((act) => (
                        <SelectItem key={act.value} value={act.value}>
                          <div className="flex items-center gap-2">
                            <act.icon className="h-4 w-4" />
                            {act.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAction(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}

            <Button variant="outline" className="w-full gap-2" onClick={addAction}>
              <Plus className="h-4 w-4" />
              Add Action
            </Button>
          </CardContent>
        </Card>

        {/* Visual Flow */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow Flow</CardTitle>
            <CardDescription>Visual representation of your automation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-lg bg-blue-100 px-4 py-3 text-blue-700 font-medium">
                <Zap className="h-4 w-4 inline mr-2" />
                Trigger
              </div>
              {workflowActions.length > 0 && (
                <>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  {workflowActions.map((_, index) => (
                    <React.Fragment key={index}>
                      <div className="rounded-lg bg-purple-100 px-4 py-3 text-purple-700 font-medium">
                        Action {index + 1}
                      </div>
                      {index < workflowActions.length - 1 && (
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      )}
                    </React.Fragment>
                  ))}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
