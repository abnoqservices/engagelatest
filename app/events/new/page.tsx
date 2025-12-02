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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, Save, Eye, Plus, GripVertical, Trash2, CalendarIcon, MapPin, QrCode, Users, Package, Search, X } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const MASTER_PRODUCTS = [
  { id: "1", name: "Premium Laptop", category: "Electronics", sku: "LAP-001", image: "/modern-laptop-workspace.png" },
  { id: "2", name: "Wireless Headphones", category: "Audio", sku: "AUD-002", image: "/diverse-people-listening-headphones.png" },
  { id: "3", name: "Smart Watch Pro", category: "Wearables", sku: "WAT-003", image: "/wrist-watch-close-up.png" },
  { id: "4", name: "Tablet Ultra", category: "Electronics", sku: "TAB-004", image: "/modern-tablet-display.png" },
  { id: "5", name: "Smartphone X", category: "Mobile", sku: "MOB-005", image: "/modern-smartphone.png" },
]

export default function NewEventPage() {
  const [startDate, setStartDate] = React.useState<Date>()
  const [endDate, setEndDate] = React.useState<Date>()
  const [booths, setBooths] = React.useState([
    { id: "1", name: "Booth A1", number: "A1", location: "Hall A", size: "3x3m", products: [] as string[] },
    { id: "2", name: "Booth A2", number: "A2", location: "Hall A", size: "3x3m", products: [] as string[] },
    { id: "3", name: "Booth B1", number: "B1", location: "Hall B", size: "6x3m", products: [] as string[] },
  ])
  
  const [selectedBoothId, setSelectedBoothId] = React.useState<string | null>(null)
  const [productSearch, setProductSearch] = React.useState("")
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([])
  const [isProductDialogOpen, setIsProductDialogOpen] = React.useState(false)

  const addNewBooth = () => {
    const newBoothNumber = booths.length + 1
    const newBooth = {
      id: Date.now().toString(),
      name: `Booth ${String.fromCharCode(65 + Math.floor((booths.length) / 10))}${newBoothNumber}`,
      number: `${String.fromCharCode(65 + Math.floor((booths.length) / 10))}${newBoothNumber}`,
      location: "Hall A",
      size: "3x3m",
      products: [] as string[]
    }
    setBooths([...booths, newBooth])
  }

  const removeBooth = (boothId: string) => {
    setBooths(booths.filter(booth => booth.id !== boothId))
  }

  const openProductSelector = (boothId: string) => {
    setSelectedBoothId(boothId)
    const booth = booths.find(b => b.id === boothId)
    setSelectedProducts(booth?.products || [])
    setIsProductDialogOpen(true)
  }

  const saveBoothProducts = () => {
    if (selectedBoothId) {
      setBooths(booths.map(booth => 
        booth.id === selectedBoothId 
          ? { ...booth, products: selectedProducts }
          : booth
      ))
    }
    setIsProductDialogOpen(false)
    setSelectedBoothId(null)
    setProductSearch("")
  }

  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const filteredProducts = MASTER_PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.category.toLowerCase().includes(productSearch.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create New Event</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Set up your event with booths and products
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Save Draft</Button>
            <Button variant="outline" className="gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button className="gap-2">
              <Save className="h-4 w-4" />
              Publish Event
            </Button>
          </div>
        </div>

        {/* Event Form */}
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Event Details</TabsTrigger>
            <TabsTrigger value="booths">Booths</TabsTrigger>
          </TabsList>

          {/* Event Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Information</CardTitle>
                <CardDescription>Enter the basic details about your event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="event-name">Event Name *</Label>
                  <Input id="event-name" placeholder="e.g., Tech Summit 2024" />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Start Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>End Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venue">Venue *</Label>
                  <div className="flex gap-2">
                    <MapPin className="mt-2 h-5 w-5 text-muted-foreground" />
                    <Input id="venue" placeholder="Convention Center, San Francisco" className="flex-1" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event-type">Event Type</Label>
                  <Select>
                    <SelectTrigger id="event-type">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="tradeshow">Trade Show</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="exhibition">Exhibition</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Write a detailed event description..."
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Event Banner</Label>
                  <button className="flex w-full items-center justify-center rounded-lg border-2 border-dashed border-slate-200 p-8 hover:border-primary transition-colors">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-2 text-sm font-medium">Upload Banner Image</p>
                      <p className="text-xs text-muted-foreground">Recommended: 1920x1080px</p>
                    </div>
                  </button>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Technology</Badge>
                    <Badge variant="secondary">Innovation</Badge>
                    <Button variant="outline" size="sm" className="h-6">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Tag
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Booths Tab */}
          <TabsContent value="booths" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Booth Management</CardTitle>
                    <CardDescription>Add and manage event booths with product mapping</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                      <QrCode className="h-4 w-4" />
                      Bulk Generate QRs
                    </Button>
                    <Button className="gap-2" onClick={addNewBooth}>
                      <Plus className="h-4 w-4" />
                      Add Booth
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {booths.map((booth) => (
                  <div
                    key={booth.id}
                    className="rounded-lg border border-slate-200 p-4 space-y-3"
                  >
                    <div className="flex items-center gap-4">
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                      <div className="flex-1 grid gap-4 sm:grid-cols-4">
                        <Input placeholder="Booth name" defaultValue={booth.name} />
                        <Input placeholder="Number" defaultValue={booth.number} />
                        <Input placeholder="Location" defaultValue={booth.location} />
                        <Input placeholder="Size" defaultValue={booth.size} />
                      </div>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => openProductSelector(booth.id)}
                      >
                        <Package className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeBooth(booth.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    
                    {booth.products.length > 0 && (
                      <div className="ml-9 pl-4 border-l-2 border-slate-200">
                        <p className="text-sm font-medium mb-2">
                          Mapped Products ({booth.products.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {booth.products.map(productId => {
                            const product = MASTER_PRODUCTS.find(p => p.id === productId)
                            return product ? (
                              <Badge key={productId} variant="secondary" className="gap-1">
                                <Package className="h-3 w-3" />
                                {product.name}
                              </Badge>
                            ) : null
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <div className="mt-4 p-4 rounded-lg border border-dashed border-slate-200 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Auto-generate booths based on layout
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Input placeholder="e.g., A1-A10, B1-B10" className="max-w-xs" />
                    <Button variant="outline">Generate</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Map Products to Booth</DialogTitle>
              <DialogDescription>
                Select products from master data to display in this booth
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 flex-1 overflow-auto">
              {/* Search */}
              <div className="sticky top-0 bg-background z-10 pb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, SKU, or category..."
                    className="pl-9"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>
                {selectedProducts.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedProducts.length} product(s) selected
                  </p>
                )}
              </div>

              {/* Product List */}
              <div className="space-y-2">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => toggleProduct(product.id)}
                  >
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => toggleProduct(product.id)}
                    />
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="h-12 w-12 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          SKU: {product.sku}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveBoothProducts}>
                Save Products ({selectedProducts.length})
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
