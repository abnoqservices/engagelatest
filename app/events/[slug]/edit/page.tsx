"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Save, Plus, Search, Package, CalendarIcon, MapPin, Loader2 } from 'lucide-react'
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import axiosClient from "@/lib/axiosClient"
import { useParams, useRouter } from "next/navigation"
import { showToast } from "@/lib/showToast"

interface Product {
  id: number
  name: string
  sku?: string
  url_slug: string
  images?: any[]
  category?: { id: number; name: string }
}

interface Booth {
  id: number
  booth_name: string
  booth_code: string | null
  products?: Product[]
}

interface Event {
  id: number
  name: string
  location: string | null
  start_date: string | null
  end_date: string | null
  is_active: boolean
  booth: Booth | null
}

export default function EditEventPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id || params.slug

  // Form state
  const [name, setName] = React.useState("")
  const [location, setLocation] = React.useState("")
  const [startDate, setStartDate] = React.useState<Date | undefined>()
  const [endDate, setEndDate] = React.useState<Date | undefined>()
  const [isActive, setIsActive] = React.useState(false)

  const [boothName, setBoothName] = React.useState("")
  const [boothCode, setBoothCode] = React.useState("")

  // Products
  const [allProducts, setAllProducts] = React.useState<Product[]>([])
  const [boothProducts, setBoothProducts] = React.useState<Product[]>([]) // Already linked (for reference)
  const [selectedProductIds, setSelectedProductIds] = React.useState<number[]>([])
  const [productSearch, setProductSearch] = React.useState("")
  const [isProductDialogOpen, setIsProductDialogOpen] = React.useState(false)

  // Loading states
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [productsLoading, setProductsLoading] = React.useState(false) // Only for dialog

  // Fetch event details
  const fetchEvent = async () => {
    try {
      const res = await axiosClient.get(`/events/${eventId}`)
      const event: Event = res.data.data

      setName(event.name)
      setLocation(event.location || "")
      setIsActive(event.is_active)

      if (event.start_date) setStartDate(parseISO(event.start_date))
      if (event.end_date) setEndDate(parseISO(event.end_date))

      if (event.booth) {
        setBoothName(event.booth.booth_name)
        setBoothCode(event.booth.booth_code || "")
        const linkedProducts = event.booth.products || []
        setBoothProducts(linkedProducts)
        setSelectedProductIds(linkedProducts.map(p => p.id))
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to load event", "error")
      router.push("/events")
    } finally {
      setLoading(false)
    }
  }

  // Fetch all available products (paginated, but for simplicity load first page or all if small)
  // Adjust per_page if you have many products
  const fetchAllProducts = async () => {
    setProductsLoading(true)
    try {
      const res = await axiosClient.get("/products?per_page=100") // Increase if needed, or implement pagination later

      let productsArray: Product[] = []

      if (res.data?.success && res.data?.data?.data && Array.isArray(res.data.data.data)) {
        productsArray = res.data.data.data
      } else if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
        productsArray = res.data.data.data
      } else {
        console.warn("Unexpected products response structure:", res.data)
        productsArray = []
      }

      setAllProducts(productsArray)
    } catch (error: any) {
      showToast("Failed to load products", "error")
      console.error(error)
      setAllProducts([])
    } finally {
      setProductsLoading(false)
    }
  }

  React.useEffect(() => {
    if (eventId) {
      fetchEvent()
      // Do not load all products here; load only when opening dialog
    }
  }, [eventId])

  // Filter to show ONLY non-selected products in the list
  const filteredAvailableProducts = React.useMemo(() => {
    if (!Array.isArray(allProducts)) return []

    const lowerSearch = productSearch.toLowerCase()

    return allProducts
      .filter(p => !selectedProductIds.includes(p.id)) // Key change: exclude selected
      .filter(p =>
        p.name.toLowerCase().includes(lowerSearch) ||
        (p.sku && p.sku.toLowerCase().includes(lowerSearch))
      )
  }, [allProducts, selectedProductIds, productSearch])

  const toggleProduct = (productId: number) => {
    setSelectedProductIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleSave = async () => {
    if (!name.trim()) return showToast("Event name is required", "error")

    setSaving(true)
    try {
      // Update event
      await axiosClient.put(`/events/${eventId}`, {
        name,
        location: location || null,
        start_date: startDate ? format(startDate, "yyyy-MM-dd") : null,
        end_date: endDate ? format(endDate, "yyyy-MM-dd") : null,
        is_active: isActive,
      })

      // Update or create booth
      if (boothName.trim()) {
        const boothRes = await axiosClient.get(`/events/${eventId}/booth`).catch(() => null)
        if (boothRes?.data?.success) {
          await axiosClient.put(`/events/${eventId}/booth`, {
            booth_name: boothName,
            booth_code: boothCode || null,
          })
        } else {
          await axiosClient.post(`/events/${eventId}/booth`, {
            booth_name: boothName,
            booth_code: boothCode || null,
          })
        }
      }

      // Sync products: remove old, add new
      const currentIds = boothProducts.map(p => p.id)
      const newIds = selectedProductIds

      // Remove unselected
      for (const id of currentIds) {
        if (!newIds.includes(id)) {
          await axiosClient.delete(`/events/${eventId}/products/${id}`).catch(() => {})
        }
      }

      // Add new
      for (const id of newIds) {
        if (!currentIds.includes(id)) {
          await axiosClient.post(`/events/${eventId}/products`, { product_id: id }).catch(() => {})
        }
      }

      // Activate if needed
      if (isActive) {
        await axiosClient.patch(`/events/${eventId}/activate`)
      }

      showToast("Event updated successfully", "success")
      router.push("/events")
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to update event", "error")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Event</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Update event details, booth, and showcased products
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
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

        {/* Event Details */}
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>Only one event can be active at a time.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Event Name *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., India Mobile Congress 2025" />
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., New Delhi" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="active">This event is currently active</Label>
            </div>
          </CardContent>
        </Card>

        {/* Booth */}
        <Card>
          <CardHeader>
            <CardTitle>Event Booth</CardTitle>
            <CardDescription>Each event has exactly one booth.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Booth Name *</Label>
                <Input value={boothName} onChange={(e) => setBoothName(e.target.value)} placeholder="e.g., Hall 3 – A12" />
              </div>
              <div className="space-y-2">
                <Label>Booth Code</Label>
                <Input value={boothCode} onChange={(e) => setBoothCode(e.target.value)} placeholder="e.g., H3-A12" />
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Label>Products in Booth</Label>
                  <p className="text-sm text-muted-foreground">{selectedProductIds.length} selected</p>
                </div>
                <Button onClick={() => {
                  fetchAllProducts() // Fresh load every time dialog opens
                  setProductSearch("") // Optional: reset search
                  setIsProductDialogOpen(true)
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Manage Products
                </Button>
              </div>

              {selectedProductIds.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedProductIds.map(id => {
                    const product = allProducts.find(p => p.id === id) || boothProducts.find(p => p.id === id)
                    return product ? (
                      <div key={id} className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm">
                        <Package className="h-3 w-3" />
                        {product.name}
                        <button
  onClick={() => toggleProduct(id)}
  className="ml-2 text-xs hover:text-destructive"
>
  ×
</button>
                      </div>
                    ) : null
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Product Dialog - Now shows only available (non-selected) products */}
        <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Select Products for Booth</DialogTitle>
              <DialogDescription>
                Add products to showcase in this booth. Currently selected: {selectedProductIds.length}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 flex-1 overflow-auto">
              <div className="sticky top-0 bg-background z-10 pb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or SKU..."
                    className="pl-9"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>
                {productsLoading && <p className="text-sm text-muted-foreground mt-2">Loading products...</p>}
              </div>

              <div className="space-y-2">
                {filteredAvailableProducts.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    {productsLoading ? "Loading products..." : (productSearch ? "No matching products" : "No more products available (all selected or none exist)")}
                  </p>
                ) : (
                  filteredAvailableProducts.map(product => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition"
                      onClick={() => toggleProduct(product.id)}
                    >
                      <Checkbox checked={false} readOnly /> {/* Always unchecked here since we hide selected */}
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        {product.sku && <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>}
                        {product.category && <p className="text-xs text-muted-foreground">Category: {product.category.name}</p>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsProductDialogOpen(false)}>
                Done ({selectedProductIds.length} selected)
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}