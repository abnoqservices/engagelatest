"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Upload, Plus, X, GripVertical, BookOpen, Eye, Save, Send } from 'lucide-react'
import Link from "next/link"

const availableProducts = [
  {
    id: 1,
    name: "Premium Laptop Pro",
    category: "Electronics",
    price: 1299.99,
    image: "/modern-laptop-workspace.png",
    sku: "LAP-001",
  },
  {
    id: 2,
    name: "Smartphone X",
    category: "Electronics",
    price: 899.99,
    image: "/modern-smartphone.png",
    sku: "PHN-002",
  },
  {
    id: 3,
    name: "Wireless Headphones",
    category: "Audio",
    price: 299.99,
    image: "/diverse-people-listening-headphones.png",
    sku: "AUD-003",
  },
  {
    id: 4,
    name: "Smart Watch",
    category: "Wearables",
    price: 399.99,
    image: "/wrist-watch-close-up.png",
    sku: "WAT-004",
  },
  {
    id: 5,
    name: "Tablet Device",
    category: "Electronics",
    price: 599.99,
    image: "/modern-tablet-display.png",
    sku: "TAB-005",
  },
]

export default function NewCatalogPage() {
  const [selectedProducts, setSelectedProducts] = React.useState<number[]>([])
  const [coverImage, setCoverImage] = React.useState<string>("")
  const [backCoverImage, setBackCoverImage] = React.useState<string>("")

  const toggleProduct = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  const toggleAllProducts = () => {
    if (selectedProducts.length === availableProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(availableProducts.map((p) => p.id))
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/catalogs">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Create Catalog</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Design your digital product catalog
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline">
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Send className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList>
            <TabsTrigger value="details">Catalog Details</TabsTrigger>
            <TabsTrigger value="cover">Cover Pages</TabsTrigger>
            <TabsTrigger value="products">Select Products</TabsTrigger>
            <TabsTrigger value="layout">Layout & Design</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Catalog Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Tech Products 2024"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of this catalog..."
                    rows={3}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="tech">Technology</SelectItem>
                        <SelectItem value="fashion">Fashion</SelectItem>
                        <SelectItem value="home">Home & Living</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="secondary">
                      Technology
                      <X className="ml-1 h-3 w-3 cursor-pointer" />
                    </Badge>
                    <Badge variant="secondary">
                      2024
                      <X className="ml-1 h-3 w-3 cursor-pointer" />
                    </Badge>
                  </div>
                  <Input placeholder="Add tag and press Enter..." />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cover" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Front Cover</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  {coverImage ? (
                    <div className="relative">
                      <img
                        src={coverImage || "/placeholder.svg"}
                        alt="Cover"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setCoverImage("")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                      <div>
                        <p className="font-medium">Upload front cover image</p>
                        <p className="text-sm text-muted-foreground">
                          PNG, JPG up to 10MB (Recommended: 1200x1600px)
                        </p>
                      </div>
                      <Button variant="outline">Choose File</Button>
                    </div>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="coverTitle">Cover Title</Label>
                    <Input
                      id="coverTitle"
                      placeholder="Tech Products 2024"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coverSubtitle">Subtitle</Label>
                    <Input
                      id="coverSubtitle"
                      placeholder="Complete Product Catalog"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Back Cover</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  {backCoverImage ? (
                    <div className="relative">
                      <img
                        src={backCoverImage || "/placeholder.svg"}
                        alt="Back Cover"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setBackCoverImage("")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                      <div>
                        <p className="font-medium">Upload back cover image</p>
                        <p className="text-sm text-muted-foreground">
                          PNG, JPG up to 10MB (Optional)
                        </p>
                      </div>
                      <Button variant="outline">Choose File</Button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backCoverText">Back Cover Text</Label>
                  <Textarea
                    id="backCoverText"
                    placeholder="Company information, contact details, etc."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    Select Products ({selectedProducts.length} selected)
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleAllProducts}
                  >
                    {selectedProducts.length === availableProducts.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => toggleProduct(product.id)}
                      />
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          SKU: {product.sku} • {product.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedProducts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Selected Products Order</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop to reorder products in the catalog
                  </p>
                  <div className="space-y-2">
                    {selectedProducts.map((id, index) => {
                      const product = availableProducts.find((p) => p.id === id)
                      return (
                        <div
                          key={id}
                          className="flex items-center gap-3 p-2 border rounded-lg bg-muted/30"
                        >
                          <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                          <span className="text-sm font-medium w-8">
                            {index + 1}
                          </span>
                          <img
                            src={product?.image || "/placeholder.svg"}
                            alt={product?.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <span className="flex-1 text-sm">{product?.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleProduct(id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="layout" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Layout Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="pageSize">Page Size</Label>
                    <Select defaultValue="a4">
                      <SelectTrigger id="pageSize">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a4">A4 (210 x 297 mm)</SelectItem>
                        <SelectItem value="letter">Letter (8.5 x 11 in)</SelectItem>
                        <SelectItem value="a5">A5 (148 x 210 mm)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="orientation">Orientation</Label>
                    <Select defaultValue="portrait">
                      <SelectTrigger id="orientation">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portrait">Portrait</SelectItem>
                        <SelectItem value="landscape">Landscape</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productsPerPage">Products per Page</Label>
                    <Select defaultValue="2">
                      <SelectTrigger id="productsPerPage">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 product</SelectItem>
                        <SelectItem value="2">2 products</SelectItem>
                        <SelectItem value="4">4 products</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template">Template Style</Label>
                    <Select defaultValue="modern">
                      <SelectTrigger id="template">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="elegant">Elegant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Information Display</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox id="showPrice" defaultChecked />
                  <Label htmlFor="showPrice" className="font-normal">
                    Show product prices
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="showSKU" defaultChecked />
                  <Label htmlFor="showSKU" className="font-normal">
                    Show SKU codes
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="showDescription" defaultChecked />
                  <Label htmlFor="showDescription" className="font-normal">
                    Show product descriptions
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="showSpecs" />
                  <Label htmlFor="showSpecs" className="font-normal">
                    Show specifications
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="showQR" defaultChecked />
                  <Label htmlFor="showQR" className="font-normal">
                    Show QR codes for each product
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Branding</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logo">Company Logo</Label>
                  <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Upload logo (PNG, SVG)
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        defaultValue="#6366f1"
                        className="w-16 h-10 p-1"
                      />
                      <Input defaultValue="#6366f1" className="flex-1" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        defaultValue="#8b5cf6"
                        className="w-16 h-10 p-1"
                      />
                      <Input defaultValue="#8b5cf6" className="flex-1" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
