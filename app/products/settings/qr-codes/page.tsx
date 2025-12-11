"use client"

import * as React from "react"
import { QRCodeCanvas } from "qrcode.react"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Plus, Download, Save, Palette } from 'lucide-react'
import Image from "next/image"
import { nanoid } from 'nanoid'

interface QRTemplate {
  id: string
  name: string
  type: "standard" | "logo" | "framed" | "rounded"
  size: number
  fgColor: string
  bgColor: string
  errorCorrection: "L" | "M" | "Q" | "H"
  logo?: string
}

export default function QRCodesPage() {
  const [templates, setTemplates] = React.useState<QRTemplate[]>([
    { id: "1", name: "Classic Black", type: "standard", size: 280, fgColor: "#000000", bgColor: "#ffffff", errorCorrection: "M" },
    { id: "2", name: "Brand Blue", type: "logo", size: 300, fgColor: "#1d4ed8", bgColor: "#ffffff", errorCorrection: "H", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" },
    { id: "3", name: "Modern Green", type: "standard", size: 260, fgColor: "#16a34a", bgColor: "#f0fdf4", errorCorrection: "Q" },
  ])

  const [activeTemplateId, setActiveTemplateId] = React.useState(templates[0].id)
  const [previewUrl, setPreviewUrl] = React.useState("https://yourstore.com/product/123")

  const activeTemplate = templates.find(t => t.id === activeTemplateId) || templates[0]
  const [edit, setEdit] = React.useState<QRTemplate>({ ...activeTemplate })

  // Sync when user selects a different template
  React.useEffect(() => {
    setEdit({ ...activeTemplate })
  }, [activeTemplateId])

  const saveTemplate = () => {
    setTemplates(prev => prev.map(t => t.id === activeTemplateId ? edit : t))
  }

  const downloadQR = () => {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement
    if (canvas) {
      const link = document.createElement("a")
      link.download = `qr-${edit.name.toLowerCase().replace(/\s+/g, "-")}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Palette className="h-8 w-8 text-primary" />
              QR Code Designer
            </h1>
            <p className="text-muted-foreground mt-1">Customize instantly — see changes live!</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={saveTemplate} size="lg">
              <Save className="h-5 w-5 mr-2" />
              Save Template
            </Button>
            <Button onClick={downloadQR} variant="default" size="lg">
              <Download className="h-5 w-5 mr-2" />
              Download PNG
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left: Customization Panel */}
          <div className="space-y-6">
            {/* Template Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Choose a Template</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTemplateId(t.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        activeTemplateId === t.id
                          ? "border-primary bg-primary/5 shadow-lg"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="bg-white rounded p-3 mb-2 flex justify-center">
                        <QRCodeCanvas value="https://example.com" size={60} fgColor={t.fgColor} />
                      </div>
                      <p className="text-xs font-medium truncate">{t.name}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customization Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Customize Your QR Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>URL or Text</Label>
                  <Input
                    value={previewUrl}
                    onChange={(e) => setPreviewUrl(e.target.value)}
                    placeholder="https://yourstore.com/product/123"
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Style</Label>
                    <Select value={edit.type} onValueChange={(v) => setEdit({ ...edit, type: v as any })}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="rounded">Rounded</SelectItem>
                        <SelectItem value="logo">With Logo</SelectItem>
                        <SelectItem value="framed">Framed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Error Correction</Label>
                    <Select value={edit.errorCorrection} onValueChange={(v) => setEdit({ ...edit, errorCorrection: v as any })}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">Low (7%)</SelectItem>
                        <SelectItem value="M">Medium (15%)</SelectItem>
                        <SelectItem value="Q">High (25%)</SelectItem>
                        <SelectItem value="H">Highest (30%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Size: {edit.size}px</Label>
                  <Slider
                    value={[edit.size]}
                    onValueChange={([v]) => setEdit({ ...edit, size: v })}
                    min={200}
                    max={600}
                    step={20}
                    className="mt-3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label>Foreground Color</Label>
                    <div className="flex gap-3 mt-2">
                      <Input type="color" value={edit.fgColor} onChange={(e) => setEdit({ ...edit, fgColor: e.target.value })} className="w-24 h-12" />
                      <Input value={edit.fgColor} readOnly className="flex-1" />
                    </div>
                  </div>
                  <div>
                    <Label>Background Color</Label>
                    <div className="flex gap-3 mt-2">
                      <Input type="color" value={edit.bgColor} onChange={(e) => setEdit({ ...edit, bgColor: e.target.value })} className="w-24 h-12" />
                      <Input value={edit.bgColor} readOnly className="flex-1" />
                    </div>
                  </div>
                </div>

                {edit.type === "logo" && (
                  <div>
                    <Label>Upload Logo (Optional)</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      className="mt-2"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = () => setEdit({ ...edit, logo: reader.result as string })
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                    {edit.logo && (
                      <div className="mt-3">
                        <Image src={edit.logo} alt="Logo" width={100} height={100} className="rounded-lg border" />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Live Preview */}
          <div className="flex flex-col items-center justify-center">
            <Card className="w-full max-w-lg shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Live Preview</CardTitle>
                <p className="text-sm text-muted-foreground">Changes appear instantly</p>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-8 pb-10">
                <div
                  className="p-10 rounded-3xl shadow-inner border-4"
                  style={{ backgroundColor: edit.bgColor }}
                >
                  <QRCodeCanvas
                    value={previewUrl || "https://example.com"}
                    size={edit.size}
                    fgColor={edit.fgColor}
                    bgColor={edit.bgColor}
                    level={edit.errorCorrection}
                    includeMargin={true}
                    imageSettings={
                      edit.logo
                        ? {
                            src: edit.logo,
                            height: edit.size * 0.2,
                            width: edit.size * 0.2,
                            excavate: true,
                          }
                        : undefined
                    }
                  />
                </div>

                <div className="text-center space-y-2">
                  <p className="font-semibold text-lg">{edit.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {edit.size}px • {edit.errorCorrection} Error Correction
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}