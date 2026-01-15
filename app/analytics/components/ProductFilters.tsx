"use client"

import { useState, useEffect } from "react"
import axiosClient from "@/lib/axiosClient"
import { showToast } from "@/lib/showToast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface Event {
  id: number
  name: string
  location: string
  start_date: string
  end_date: string
  is_active: boolean
}

interface Product {
  id: number
  name: string
  sku: string
}

interface ProductFiltersProps {
  onFilterChange: (filters: {
    productId: string
    dateRange: string
    eventId: string
  }) => void
}

export default function ProductFilters({ onFilterChange }: ProductFiltersProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [events, setEvents] = useState<Event[]>([])

  const [productId, setProductId] = useState("all")
  const [dateRange, setDateRange] = useState("today")
  const [eventId, setEventId] = useState("all")

  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadingEvents, setLoadingEvents] = useState(true)

  // Fetch products (published + active)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true)
        const response = await axiosClient.get("/products", {
          params: {
            per_page: 100,
            status: "published",
            is_active: true,
          },
        })

        if (response.data.success) {
          setProducts(response.data.data.data || [])
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        showToast("Failed to load products", "error")
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchProducts()
  }, [])

  // Fetch ALL events (active + inactive)
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true)
        const response = await axiosClient.get("/events")

        if (response.data.success) {
          const allEvents = response.data.data || []
          setEvents(allEvents)

          // Auto-select first active event if exists
          const firstActive = allEvents.find((e: Event) => e.is_active)
          if (firstActive) {
            setEventId(firstActive.id.toString())
          }
        }
      } catch (error) {
        console.error("Error fetching events:", error)
        showToast("Failed to load events", "error")
      } finally {
        setLoadingEvents(false)
      }
    }

    fetchEvents()
  }, [])

  // Notify parent component when filters actually change
  useEffect(() => {
    // Prevent calling before data is ready
    if (loadingProducts || loadingEvents) return

    onFilterChange({
      productId,
      dateRange,
      eventId,
    })
  }, [productId, dateRange, eventId, loadingProducts, loadingEvents, onFilterChange])

  return (
    <div className="flex flex-wrap gap-4">
      {/* Product Select */}
      <Select value={productId} onValueChange={setProductId}>
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="Select product" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Products</SelectItem>

          {loadingProducts ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              No products found
            </div>
          ) : (
            products.map((product) => (
              <SelectItem key={product.id} value={product.id.toString()}>
                {product.name} {product.sku && `(${product.sku})`}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {/* Date Range Select */}
      <Select value={dateRange} onValueChange={setDateRange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Date range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="7days">Last 7 days</SelectItem>
          <SelectItem value="30days">Last 30 days</SelectItem>
          <SelectItem value="90days">Last 90 days</SelectItem>
        </SelectContent>
      </Select>

      {/* Event Select - all events, default first active */}
      <Select value={eventId} onValueChange={setEventId}>
        <SelectTrigger className="w-[260px]">
          <SelectValue placeholder="Select event" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Events</SelectItem>

          {loadingEvents ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading events...
            </div>
          ) : events.length === 0 ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              No events found
            </div>
          ) : (
            events.map((event) => (
              <SelectItem
                key={event.id}
                value={event.id.toString()}
                className={event.is_active ? "" : "text-muted-foreground italic"}
              >
                {event.name}
                <span className="text-xs text-muted-foreground ml-1.5">
                  ({event.location})
                  {!event.is_active && " • Inactive"}
                </span>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  )
}