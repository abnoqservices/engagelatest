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
import { Save, Eye, Plus, Search, Package, CalendarIcon, MapPin, Loader2 } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import axiosClient from "@/lib/axiosClient"
import { useRouter } from "next/navigation"
import { showToast } from "@/lib/showToast"
import useInfiniteScroll from "react-infinite-scroll-hook"

type Product = {
  id: number
  name: string
  sku: string
  url_slug: string
  category?: { name: string }
}

export default function NewEventPage() {
  const router = useRouter()

  // Event form state
  const [name, setName] = React.useState("")
  const [location, setLocation] = React.useState("")
  const [startDate, setStartDate] = React.useState<Date | undefined>()
  const [endDate, setEndDate] = React.useState<Date | undefined>()
  const [isActive, setIsActive] = React.useState(false)

  // Booth state
  const [boothName, setBoothName] = React.useState("")
  const [boothCode, setBoothCode] = React.useState("")

  // Products selection
  const [selectedProducts, setSelectedProducts] = React.useState<number[]>([])
  const [isProductDialogOpen, setIsProductDialogOpen] = React.useState(false)

  // Product list state (for dialog)
  const [products, setProducts] = React.useState<Product[]>([])
  const [productSearch, setProductSearch] = React.useState("")
  const [hasMore, setHasMore] = React.useState(true)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [loadingProducts, setLoadingProducts] = React.useState(false)

  const perPage = 20

  // Fetch products from API
  const fetchProducts = async (page: number, search: string) => {
    setLoadingProducts(true)
    try {
      const params = new URLSearchParams({
        per_page: perPage.toString(),
        page: page.toString(),
        ...(search && { search }),
        status: "published", // optional: only published
        is_active: "true",
      })

      const res = await axiosClient.get(`/products?${params}`)
      const newProducts: Product[] = res.data.data.data
      const total = res.data.data.total
      const fetchedCount = page === 1 ? newProducts.length : products.length + newProducts.length

      if (page === 1) {
        setProducts(newProducts)
      } else {
        setProducts(prev => [...prev, ...newProducts])
      }

      setHasMore(fetchedCount < total)
    } catch (err) {
      console.error("Failed to load products", err)
      showToast("Failed to load products", "error")
      setHasMore(false)
    } finally {
      setLoadingProducts(false)
    }
  }

  // Load initial or searched products
  React.useEffect(() => {
    if (isProductDialogOpen) {
      setCurrentPage(1)
      setProducts([])
      setHasMore(true)
      fetchProducts(1, productSearch)
    }
  }, [isProductDialogOpen, productSearch])

  // Infinite scroll hook
  const [sentryRef] = useInfiniteScroll({
    loading: loadingProducts,
    hasNextPage: hasMore,
    onLoadMore: () => {
      if (!loadingProducts && hasMore) {
        const nextPage = currentPage + 1
        setCurrentPage(nextPage)
        fetchProducts(nextPage, productSearch)
      }
    },
    disabled: !isProductDialogOpen,
    rootMargin: "0px 0px 200px 0px",
  })

  // Filter out selected products
  const availableProducts = products.filter(p => !selectedProducts.includes(p.id))

  const toggleProduct = (productId: number) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleCreateEvent = async () => {
    if (!name.trim()) {
      showToast("Event name is required", "error")
      return
    }

    setLoading(true)
    try {
      // Step 1: Create Event
      const eventResponse = await axiosClient.post("/events", {
        name,
        location: location || null,
        start_date: startDate ? format(startDate, "yyyy-MM-dd") : null,
        end_date: endDate ? format(endDate, "yyyy-MM-dd") : null,
        is_active: isActive,
      })

      const eventId = eventResponse.data.data.id
      showToast("Event created successfully", "success")

      // Step 2: Create booth if name provided
      if (boothName.trim()) {
        await axiosClient.post(`/events/${eventId}/booth`, {
          booth_name: boothName,
          booth_code: boothCode || null,
        })
        showToast("Booth created", "success")
      }

      // Step 3: Link products
      if (selectedProducts.length > 0) {
        for (const productId of selectedProducts) {
          try {
            await axiosClient.post(`/events/${eventId}/products`, {
              product_id: productId,
            })
          } catch (err: any) {
            if (err.response?.data?.message?.includes("already linked")) {
              continue
            } else {
              throw err
            }
          }
        }
        showToast(`${selectedProducts.length} product(s) linked`, "success")
      }

      // Step 4: Activate if needed
      if (isActive) {
        await axiosClient.patch(`/events/${eventId}/activate`)
        showToast("Event activated", "success")
      }

      router.push("/events")
    } catch (error: any) {
      console.error("Event creation failed:", error)
      const message = error.response?.data?.message || "Failed to create event"
      showToast(message, "error")
    } finally {
      setLoading(false)
    }
  }

  const [loading, setLoading] = React.useState(false)

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create New Event</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Configure your event, booth, and showcased products
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" disabled={loading}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleCreateEvent} disabled={loading} className="gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Create Event
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Event Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>
                Basic information about the event. Only one event can be active at a time.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="event-name">Event Name *</Label>
                <Input
                  id="event-name"
                  placeholder="e.g., India Mobile Congress 2025"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="e.g., New Delhi"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Start Date</Label>
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
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
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
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="is-active" checked={isActive} onCheckedChange={setIsActive} />
                <Label htmlFor="is-active">
                  Activate this event immediately
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Booth Card */}
          <Card>
            <CardHeader>
              <CardTitle>Event Booth</CardTitle>
              <CardDescription>
                Each event has exactly one booth.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="booth-name">Booth Name *</Label>
                  <Input
                    id="booth-name"
                    placeholder="e.g., Hall 3 – A12"
                    value={boothName}
                    onChange={(e) => setBoothName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="booth-code">Booth Code</Label>
                  <Input
                    id="booth-code"
                    placeholder="e.g., H3-A12"
                    value={boothCode}
                    onChange={(e) => setBoothCode(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label>Products in Booth</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedProducts.length} product(s) selected
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setProductSearch("")
                      setIsProductDialogOpen(true)
                    }}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Manage Products
                  </Button>
                </div>

                {/* Selected Products Tags */}
                {selectedProducts.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedProducts.map((productId) => {
                      const product = products.find(p => p.id === productId) ||
                        { id: productId, name: `Product #${productId}`, sku: "", url_slug: "" }
                      return (
                        <div
                          key={productId}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm"
                        >
                          <Package className="h-3 w-3" />
                          {product.name}
                          <button
                            onClick={() => toggleProduct(productId)}
                            className="ml-1 hover:text-destructive transition-colors text-lg leading-none"
                            aria-label="Remove product"
                          >
                            ×
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Selection Dialog */}
        <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Select Products for Booth</DialogTitle>
              <DialogDescription>
                Currently selected: {selectedProducts.length} product(s)
              </DialogDescription>
            </DialogHeader>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, SKU or description..."
                className="pl-9"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingProducts && products.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : availableProducts.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                  {productSearch
                    ? "No products match your search"
                    : "No products available"}
                </p>
              ) : (
                <div className="space-y-2">
                  {availableProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => toggleProduct(product.id)}
                    >
                      <Checkbox checked={false} readOnly />
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          SKU: {product.sku} {product.category && `• ${product.category.name}`}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Infinite scroll sentry */}
                  {hasMore && (
                    <div ref={sentryRef} className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsProductDialogOpen(false)}>
                Done ({selectedProducts.length} selected)
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}