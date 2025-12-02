"use client"

import * as React from "react"
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
import { Slider } from "@/components/ui/slider"
import { Plus, Download, Eye, Trash2, QrCode } from 'lucide-react'
import Image from "next/image"

export default function QRCodesPage() {
  const [qrSize, setQrSize] = React.useState([256])
  const [qrColor, setQrColor] = React.useState("#000000")

  const templates = [
    { id: "1", name: "Standard QR", type: "standard", preview: "/qr-code-preview.jpg" },
    { id: "2", name: "Logo QR", type: "logo", preview: "/offer-qr-code.jpg" },
    { id: "3", name: "Framed QR", type: "framed", preview: "/offer-qr-code-preview.jpg" },
    { id: "4", name: "Rounded QR", type: "rounded", preview: "/generic-qr-code.png" },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">QR Code Templates</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create and manage QR code templates for your products
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Template
          </Button>
        </div>

        {/* QR Code Templates */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {templates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <div className="aspect-square bg-white p-6 flex items-center justify-center border-b">
                <Image
                  src={template.preview || "/placeholder.svg"}
                  alt={template.name}
                  width={200}
                  height={200}
                  className="rounded"
                />
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{template.name}</CardTitle>
                <CardDescription className="text-xs capitalize">
                  {template.type}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <Eye className="h-3 w-3" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <Download className="h-3 w-3" />
                    Use
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Default QR Settings */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Default QR Code Settings</CardTitle>
              <CardDescription>
                Configure default settings for new QR codes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Default QR Type</Label>
                <Select defaultValue="standard">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="logo">With Logo</SelectItem>
                    <SelectItem value="framed">Framed</SelectItem>
                    <SelectItem value="rounded">Rounded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fg-color">Foreground Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="fg-color"
                      type="color"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input value={qrColor} readOnly className="flex-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bg-color">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="bg-color"
                      type="color"
                      defaultValue="#ffffff"
                      className="w-16 h-10 p-1"
                    />
                    <Input value="#ffffff" readOnly className="flex-1" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Default Size: {qrSize[0]}px</Label>
                <Slider
                  value={qrSize}
                  onValueChange={setQrSize}
                  min={128}
                  max={1024}
                  step={64}
                />
              </div>

              <div className="space-y-2">
                <Label>Error Correction Level</Label>
                <Select defaultValue="M">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Low (7% recovery)</SelectItem>
                    <SelectItem value="M">Medium (15% recovery)</SelectItem>
                    <SelectItem value="Q">Quartile (25% recovery)</SelectItem>
                    <SelectItem value="H">High (30% recovery)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>QR Code Preview</CardTitle>
              <CardDescription>Preview with current settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="rounded-lg border border-slate-200 bg-white p-8">
                  <div className="flex items-center justify-center" style={{ width: qrSize[0], height: qrSize[0] }}>
                    <QrCode className="w-full h-full" style={{ color: qrColor }} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    PNG
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    SVG
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
