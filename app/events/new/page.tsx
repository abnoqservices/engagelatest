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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Plus, Search, Package, CalendarIcon, MapPin, Loader2, Check, CheckCircle2, Trash2 } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import axiosClient from "@/lib/axiosClient"
import { useRouter, useParams } from "next/navigation"
import { showToast } from "@/lib/showToast"
import useInfiniteScroll from "react-infinite-scroll-hook"

type ProductCategory = {
  id: number
  name: string
  slug: string
  parent_id: number | null
  children: ProductCategory[]
  // ... other fields if needed
}

type Product = {
  id: number
  name: string
  sku: string
  url_slug: string
  category?: ProductCategory
  primary_image?: string
}

type BoothProduct = {
  id: number
  name: string
  url_slug: string
}

type Booth = {
  id: number
  booth_name: string
  booth_code: string | null
  products: BoothProduct[]
}

type EventData = {
  id: number
  name: string
  location: string | null
  start_date: string | null
  end_date: string | null
  is_active: boolean
  booth: Booth | null
}

export default function EventFormPage() {
  const router = useRouter()
  const params = useParams()
  const eventId = params.id ? Number(params.id) : null
  const isEditMode = !!eventId

  // Form states
  const [name, setName] = React.useState("")
  const [location, setLocation] = React.useState("")
  const [startDate, setStartDate] = React.useState<Date | undefined>()
  const [endDate, setEndDate] = React.useState<Date | undefined>()
  const [isActive, setIsActive] = React.useState(false)
  const [boothName, setBoothName] = React.useState("")
  const [boothCode, setBoothCode] = React.useState("")

  const [selectedProductIds, setSelectedProductIds] = React.useState<number[]>([])

  // UI states
  const [loading, setLoading] = React.useState(false)
  const [pageLoading, setPageLoading] = React.useState(isEditMode)

  // Product dialog states
  const [isProductDialogOpen, setIsProductDialogOpen] = React.useState(false)
  const [products, setProducts] = React.useState<Product[]>([])
  const [productSearch, setProductSearch] = React.useState("")
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<number | undefined>(undefined)
  const [categories, setCategories] = React.useState<ProductCategory[]>([])
  const [categoriesLoaded, setCategoriesLoaded] = React.useState(false)
  const [loadingCategories, setLoadingCategories] = React.useState(false)
  const [hasMore, setHasMore] = React.useState(true)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [loadingProducts, setLoadingProducts] = React.useState(false)

  const perPage = 20

  // ─── Fetch root categories ────────────────────────────────────────
  const fetchCategories = React.useCallback(async () => {
    if (categoriesLoaded || loadingCategories) return

    setLoadingCategories(true)
    try {
      const params = new URLSearchParams({ parent_id: 'null' })
      const res = await axiosClient.get(`/product-categories?${params}`)
      const data = res.data.data || []
      setCategories(data)
      setCategoriesLoaded(true)
    } catch (err: any) {
      console.error("Categories fetch failed:", err)
      showToast("Failed to load product categories", "error")
      setCategories([])
    } finally {
      setLoadingCategories(false)
    }
  }, [categoriesLoaded, loadingCategories])

  // ─── Fetch products ───────────────────────────────────────────────
  const fetchProducts = async (page: number) => {
    setLoadingProducts(true)
    try {
      const params = new URLSearchParams({
        per_page: perPage.toString(),
        page: page.toString(),
        ...(productSearch && { search: productSearch }),
        ...(selectedCategoryId && { category_id: selectedCategoryId.toString() }),
        is_active: "true",
        with: "images,category",
      })

      const res = await axiosClient.get(`/products?${params}`)
      const newProducts = res.data.data.data || []

      const productsWithImage = newProducts.map((p: any) => {
        let primaryUrl: string | undefined
        if (p.images?.length > 0) {
          const sorted = [...p.images].sort((a: any, b: any) => (a.position || 999) - (b.position || 999))
          primaryUrl = sorted[0]?.url
        }
        return { ...p, primary_image: primaryUrl }
      })

      setProducts(prev => page === 1 ? productsWithImage : [...prev, ...productsWithImage])

      const total = res.data.data.total || 0
      setHasMore(page * perPage < total)
    } catch (err) {
      console.error("Products fetch failed:", err)
      showToast("Failed to load products", "error")
      setHasMore(false)
    } finally {
      setLoadingProducts(false)
    }
  }

  // ─── Dialog open → load categories + products ─────────────────────
  React.useEffect(() => {
    if (!isProductDialogOpen) return

    fetchCategories()

    setCurrentPage(1)
    setProducts([])
    setHasMore(true)
    fetchProducts(1)
  }, [isProductDialogOpen, fetchCategories])

  // ─── Search / category change → reset & refetch ───────────────────
  React.useEffect(() => {
    if (!isProductDialogOpen) return

    setCurrentPage(1)
    setProducts([])
    setHasMore(true)
    fetchProducts(1)
  }, [productSearch, selectedCategoryId, isProductDialogOpen])

  const [sentryRef] = useInfiniteScroll({
    loading: loadingProducts,
    hasNextPage: hasMore,
    onLoadMore: () => {
      if (!loadingProducts && hasMore) {
        const nextPage = currentPage + 1
        setCurrentPage(nextPage)
        fetchProducts(nextPage)
      }
    },
    disabled: !isProductDialogOpen,
    rootMargin: "0px 0px 200px 0px",
  })

  const toggleProduct = (productId: number) => {
    setSelectedProductIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  // ─── Load event in edit mode ──────────────────────────────────────
  React.useEffect(() => {
    if (!isEditMode || !eventId) return

    const loadEvent = async () => {
      setPageLoading(true)
      try {
        const res = await axiosClient.get(`/events/${eventId}`)
        const event: EventData = res.data.data

        setName(event.name)
        setLocation(event.location || "")
        setStartDate(event.start_date ? new Date(event.start_date) : undefined)
        setEndDate(event.end_date ? new Date(event.end_date) : undefined)
        setIsActive(event.is_active)

        if (event.booth) {
          setBoothName(event.booth.booth_name)
          setBoothCode(event.booth.booth_code || "")
          setSelectedProductIds(event.booth.products.map(p => p.id))
        }
      } catch (err: any) {
        showToast(err.response?.data?.message || "Failed to load event", "error")
      } finally {
        setPageLoading(false)
      }
    }

    loadEvent()
  }, [isEditMode, eventId])

  // ─── Submit ───────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!name.trim()) return showToast("Event name is required", "error")

    setLoading(true)
    try {
      let currentEventId = eventId

      // Create or Update event
      if (isEditMode) {
        await axiosClient.put(`/events/${eventId}`, {
          name,
          location: location || null,
          start_date: startDate ? format(startDate, "yyyy-MM-dd") : null,
          end_date: endDate ? format(endDate, "yyyy-MM-dd") : null,
          is_active: isActive,
        })
      } else {
        const res = await axiosClient.post("/events", {
          name,
          location: location || null,
          start_date: startDate ? format(startDate, "yyyy-MM-dd") : null,
          end_date: endDate ? format(endDate, "yyyy-MM-dd") : null,
          is_active: isActive,
        })
        currentEventId = res.data.data.id
      }

      // Booth
      if (boothName.trim() && currentEventId) {
        try {
          if (isEditMode) {
            await axiosClient.put(`/events/${currentEventId}/booth`, {
              booth_name: boothName,
              booth_code: boothCode || null,
            })
          } else {
            await axiosClient.post(`/events/${currentEventId}/booth`, {
              booth_name: boothName,
              booth_code: boothCode || null,
            })
          }
        } catch (e: any) {
          if (isEditMode && e.response?.status === 404) {
            await axiosClient.post(`/events/${currentEventId}/booth`, {
              booth_name: boothName,
              booth_code: boothCode || null,
            })
          } else {
            throw e
          }
        }
      }

      // Products sync (simple: clear + re-add)
      if (currentEventId) {
        try { await axiosClient.delete(`/events/${currentEventId}/products`) } catch {}
        for (const pid of selectedProductIds) {
          try {
            await axiosClient.post(`/events/${currentEventId}/products`, { product_id: pid })
          } catch (e: any) {
            if (!e.response?.data?.message?.includes("already")) console.warn(e)
          }
        }
      }

      // Activate if needed
      if (isActive && currentEventId) {
        await axiosClient.patch(`/events/${currentEventId}/activate`)
      }

      showToast(isEditMode ? "Event updated" : "Event created", "success")
      router.push("/events")
    } catch (err: any) {
      showToast(err.response?.data?.message || "Save failed", "error")
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{isEditMode ? "Edit Event" : "Create New Event"}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isEditMode ? "Update event, booth & products" : "Configure your event and booth"}
            </p>
          </div>
          <Button onClick={handleSubmit} disabled={loading} className="min-w-36 gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {loading ? "Saving..." : isEditMode ? "Save Changes" : "Create Event"}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>
              {isEditMode ? "Modify event information" : "Only one event can be active at a time."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            <div className="flex items-center space-x-2">
              <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="active">
                {isEditMode ? "Keep event active" : "Activate immediately"}
              </Label>
            </div>

            <div className="space-y-2">
              <Label required>Event Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Tech Expo 2026" />
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" value={location} onChange={e => setLocation(e.target.value)} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start", !startDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start", !endDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label >Hall / Booth Name</Label>
                <Input value={boothName} onChange={e => setBoothName(e.target.value)} placeholder="e.g. Hall 5 - B42" />
              </div>
              <div className="space-y-2">
                <Label>Booth Code</Label>
                <Input value={boothCode} onChange={e => setBoothCode(e.target.value)} placeholder="e.g. H5-B42" />
              </div>
            </div>

            {/* Products section */}
            <div className="pt-6 border-t">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <Label>Showcased Products</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedProductIds.length} product{selectedProductIds.length !== 1 ? "s" : ""} selected
                  </p>
                </div>
                <Button variant="outline" onClick={() => setIsProductDialogOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Manage Products
                </Button>
              </div>

              {selectedProductIds.length > 0 && (
  <div className="
    flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory
    scrollbar-thin scrollbar-thumb-muted-foreground/40
  ">
    {selectedProductIds.length > 0 && (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
    {selectedProductIds.map((id) => {
      const product = products.find((p) => p.id === id) || {
        id,
        name: `Product #${id}`,
        sku: "—",
        primary_image: undefined,
        category: { name: "Uncategorized" },
      }

      return (
        <div
          key={id}
          className={cn(
            "group relative border rounded-xl overflow-hidden bg-card",
            "hover:shadow-md hover:border-primary/50 transition-all",
            "cursor-pointer"
          )}
          onClick={() => toggleProduct(id)}
        >
          {/* Fixed aspect ratio thumbnail */}
          <div className="aspect-square relative bg-muted">
            {product.primary_image ? (
              <img
                src={product.primary_image}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/50" />
              </div>
            )}

            {/* Small remove button – top right corner */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation() // prevent card click from triggering
                toggleProduct(id)
              }}
              className={cn(
                "absolute top-2 right-2 z-10",
                "h-7 w-7 rounded-full bg-background/90 backdrop-blur-sm shadow-sm border",
                "flex items-center justify-center text-muted-foreground",
                "hover:bg-destructive/10 hover:text-destructive transition-colors",
                "opacity-80 group-hover:opacity-100 focus:opacity-100"
              )}
              aria-label="Remove product"
            >
             x
            </button>
          </div>

          {/* Title + info below image */}
          <div className="p-2.5 text-center">
            <p className="font-medium text-sm line-clamp-2 leading-snug">
              {product.name}
            </p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
              {product.sku ? `SKU: ${product.sku}` : "—"}
            </p>
          </div>
        </div>
      )
    })}
  </div>
)}
  </div>
)}
            </div>
          </CardContent>
        </Card>

        {/* ─── Product Selection Dialog ──────────────────────────────────────── */}
        <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
          <DialogContent className="!max-w-6xl w-[95vw] !max-h-[92vh] p-0 flex flex-col">
            <div className="p-6 border-b">
              <DialogHeader className="mb-5">
                <DialogTitle>Select Products</DialogTitle>
                <DialogDescription>
                  Choose which products will be showcased at this event booth.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or SKU..."
                    className="pl-10"
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                  />
                </div>

                <Select
                  value={selectedCategoryId?.toString() ?? "all"}
                  onValueChange={v => setSelectedCategoryId(v === "all" ? undefined : Number(v))}
                  disabled={loadingCategories || categories.length === 0}
                >
                  <SelectTrigger className="w-full sm:w-64">
                    <SelectValue placeholder={
                      loadingCategories
                        ? "Loading categories..."
                        : categories.length === 0
                          ? "No categories"
                          : "All Categories"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loadingProducts && products.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-10 w-10 animate-spin" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  {productSearch || selectedCategoryId
                    ? "No matching products found"
                    : "No products available"}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {products.map(product => {
                    const isSelected = selectedProductIds.includes(product.id)
                    return (
                      <div
                        key={product.id}
                        className={cn(
                          "group relative border rounded-xl overflow-hidden cursor-pointer transition-all",
                          "hover:border-primary/50 hover:shadow-md",
                          isSelected && "border-primary shadow-sm bg-primary/5"
                        )}
                        onClick={() => toggleProduct(product.id)}
                      >
                        <div className="absolute top-3 right-3 z-10 pointer-events-none">
                          <Checkbox
                            checked={isSelected}
                            className={cn(
                              "h-8 w-8 rounded-full border-2 shadow",
                              isSelected ? "bg-primary border-primary" : "bg-background/80 border-muted"
                            )}
                          />
                        </div>

                        <div className="aspect-square bg-muted relative">
                          {product.primary_image ? (
                            <img
                              src={product.primary_image}
                              alt={product.name}
                              className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                          ) : (
                            <Package className="absolute inset-0 m-auto h-12 w-12 text-muted-foreground/40" />
                          )}
                        </div>

                        <div className="p-3">
                          <p className="font-medium text-sm line-clamp-2">{product.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {product.sku ? `SKU: ${product.sku}` : "—"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {product.category?.name ?? "Uncategorized"}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {hasMore && (
                <div ref={sentryRef} className="py-10 flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
            </div>

            <div className="border-t px-6 py-4 bg-muted/40">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">
                  {selectedProductIds.length} product{selectedProductIds.length !== 1 ? "s" : ""} selected
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsProductDialogOpen(false)}>
                    Done
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}