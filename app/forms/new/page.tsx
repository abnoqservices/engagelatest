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
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Eye, Check, Plus, GripVertical, Trash2, Settings, FileText, Mail, Phone, Calendar, CheckSquare, ToggleLeft } from 'lucide-react'
import Link from "next/link"

const fieldTypes = [
  { value: "text", label: "Text Input", icon: FileText },
  { value: "email", label: "Email", icon: Mail },
  { value: "phone", label: "Phone", icon: Phone },
  { value: "date", label: "Date", icon: Calendar },
  { value: "checkbox", label: "Checkbox", icon: CheckSquare },
  { value: "select", label: "Dropdown", icon: ToggleLeft },
]

export default function CreateFormPage() {
  const [fields, setFields] = React.useState([
    { id: "1", type: "text", label: "Full Name", required: true },
    { id: "2", type: "email", label: "Email Address", required: true },
  ])

  const addField = () => {
    setFields([...fields, {
      id: Date.now().toString(),
      type: "text",
      label: "New Field",
      required: false
    }])
  }

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/forms">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Create Form</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Design a custom lead capture form
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
            <Button variant="outline" className="gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button className="gap-2">
              <Check className="h-4 w-4" />
              Publish Form
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Form Details */}
            <Card>
              <CardHeader>
                <CardTitle>Form Details</CardTitle>
                <CardDescription>
                  Basic information about your form
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="form-name">Form Name</Label>
                  <Input
                    id="form-name"
                    placeholder="e.g., Product Inquiry Form"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the purpose of this form..."
                    rows={3}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select defaultValue="lead">
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead">Lead Capture</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="registration">Registration</SelectItem>
                        <SelectItem value="contact">Contact</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linked-product">Linked Product</Label>
                    <Select>
                      <SelectTrigger id="linked-product">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="laptop">UltraBook Pro X1</SelectItem>
                        <SelectItem value="smartphone">SmartPhone Z5</SelectItem>
                        <SelectItem value="headphones">Noise-Cancel Headphones</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form Fields */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Form Fields</CardTitle>
                    <CardDescription>
                      Add and configure fields for your form
                    </CardDescription>
                  </div>
                  <Button onClick={addField} size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Field
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-4"
                  >
                    <GripVertical className="h-5 w-5 text-muted-foreground mt-2 cursor-move" />
                    <div className="flex-1 space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-sm">Field Type</Label>
                          <Select defaultValue={field.type}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {fieldTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  <div className="flex items-center gap-2">
                                    <type.icon className="h-4 w-4" />
                                    {type.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Field Label</Label>
                          <Input defaultValue={field.label} />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`required-${field.id}`}
                            defaultChecked={field.required}
                          />
                          <Label htmlFor={`required-${field.id}`} className="text-sm font-normal cursor-pointer">
                            Required field
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`hidden-${field.id}`}
                          />
                          <Label htmlFor={`hidden-${field.id}`} className="text-sm font-normal cursor-pointer">
                            Hidden field
                          </Label>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeField(field.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Success Message */}
            <Card>
              <CardHeader>
                <CardTitle>Success Settings</CardTitle>
                <CardDescription>
                  Configure what happens after form submission
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="success-message">Success Message</Label>
                  <Textarea
                    id="success-message"
                    defaultValue="Thank you for your submission! We'll get back to you soon."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="redirect-url">Redirect URL (Optional)</Label>
                  <Input
                    id="redirect-url"
                    type="url"
                    placeholder="https://example.com/thank-you"
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="send-notification" className="text-sm font-medium">
                      Email Notification
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Send an email when form is submitted
                    </p>
                  </div>
                  <Switch id="send-notification" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Form Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border bg-background p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Product Inquiry</h3>
                    <p className="text-sm text-muted-foreground">
                      Please fill out the form below
                    </p>
                  </div>
                  {fields.slice(0, 3).map((field) => (
                    <div key={field.id} className="space-y-1">
                      <Label className="text-xs">
                        {field.label}
                        {field.required && <span className="text-destructive ml-1">*</span>}
                      </Label>
                      <Input className="h-8 text-sm" disabled />
                    </div>
                  ))}
                  {fields.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center">
                      + {fields.length - 3} more fields
                    </p>
                  )}
                  <Button className="w-full" size="sm">Submit</Button>
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Form Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="captcha" className="text-sm font-medium">
                      Enable CAPTCHA
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Prevent spam submissions
                    </p>
                  </div>
                  <Switch id="captcha" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="gdpr" className="text-sm font-medium">
                      GDPR Consent
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Add consent checkbox
                    </p>
                  </div>
                  <Switch id="gdpr" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-respond" className="text-sm font-medium">
                      Auto-respond
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Send confirmation email
                    </p>
                  </div>
                  <Switch id="auto-respond" defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select defaultValue="draft">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
