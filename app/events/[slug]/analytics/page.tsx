"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import { 
  QrCode, Users, MousePointerClick, Eye, Package, Download, Calendar 
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

import { DashboardLayout } from "@/components/dashboard/layout"
import axiosClient from "@/lib/axiosClient"
import { showToast } from "@/lib/showToast"

interface EventSummary {
  event: {
    id: number
    name: string
    is_active: boolean
  }
  summary: {
    qr_scan: number
    cta_click: number
    page_view: number
  }
  analytics: Array<{
    event_type: "qr_scan" | "cta_click" | "page_view"
    count: number
    date: string
  }>
}

interface ProductAnalytics {
  product_summary: Array<{
    product_id: number
    total_events: number
    product: {
      id: number
      name: string
      url_slug: string
    }
  }>
  detailed_analytics: Array<{
    product_id: number
    event_type: string
    count: number
    product: {
      id: number
      name: string
      url_slug: string
    }
  }>
}

export default function EventAnalyticsPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id ?? params.slug

  const [eventData, setEventData] = React.useState<EventSummary | null>(null)
  const [productData, setProductData] = React.useState<ProductAnalytics | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [timeRange, setTimeRange] = React.useState("30d")

  const fetchAnalytics = React.useCallback(async () => {
    if (!eventId) return

    setLoading(true)
    try {
      const [eventRes, productRes] = await Promise.all([
        axiosClient.get(`/analytics/events/${eventId}`, {
          params: { range: timeRange }
        }),
        axiosClient.get(`/analytics/events/${eventId}/products`, {
          params: { range: timeRange }
        })
      ])

      setEventData(eventRes.data.data)
      setProductData(productRes.data.data)
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to load analytics"
      showToast(msg, "error")
      
      if (error.response?.status === 404) {
        router.replace("/events")
      }
    } finally {
      setLoading(false)
    }
  }, [eventId, timeRange, router])

  React.useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const dailyData = React.useMemo(() => {
    const analytics = eventData?.analytics ?? []

    const map = new Map<string, {
      date: string
      qr_scan: number
      cta_click: number
      page_view: number
    }>()

    analytics.forEach(item => {
      const formattedDate = format(new Date(item.date), "MMM dd")
      if (!map.has(formattedDate)) {
        map.set(formattedDate, { date: formattedDate, qr_scan: 0, cta_click: 0, page_view: 0 })
      }
      const entry = map.get(formattedDate)!
      
      if (item.event_type === "qr_scan") entry.qr_scan += item.count
      if (item.event_type === "cta_click") entry.cta_click += item.count
      if (item.event_type === "page_view") entry.page_view += item.count
    })

    return Array.from(map.values()).sort((a, b) => 
      a.date.localeCompare(b.date)
    )
  }, [eventData?.analytics])

  const topProducts = React.useMemo(() => 
    productData?.product_summary
      ?.sort((a, b) => b.total_events - a.total_events)
      .slice(0, 10) ?? [],
    [productData?.product_summary]
  )

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!eventData) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto py-16 text-center">
          <p className="text-muted-foreground text-lg">
            No analytics data available for this event yet.
          </p>
        </div>
      </DashboardLayout>
    )
  }

  const { event, summary } = eventData

  const safeSummary = {
    qr_scan: summary?.qr_scan ?? 0,
    cta_click: summary?.cta_click ?? 0,
    page_view: summary?.page_view ?? 0,
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 py-8 px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <QrCode className="h-8 w-8 text-primary" />
              {event.name} Analytics
            </h1>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="text-muted-foreground">
                Event ID: <span className="font-medium text-foreground">#{event.id}</span>
              </span>
              {event.is_active && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Active
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">QR Scans</CardTitle>
              <QrCode className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{safeSummary.qr_scan.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Total booth scans</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">CTA Clicks</CardTitle>
              <MousePointerClick className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{safeSummary.cta_click.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Call-to-action interactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <Eye className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{safeSummary.page_view.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Product page visits</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList>
            <TabsTrigger value="trends">Activity Trends</TabsTrigger>
            <TabsTrigger value="products">Top Products</TabsTrigger>
          </TabsList>

          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>Daily Activity Overview</CardTitle>
                <CardDescription>
                  QR scans, CTA clicks and page views over the selected period
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2 h-[400px]">
                {dailyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#6b7280"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        fontSize={12}
                        tickFormatter={(value) => value.toLocaleString()}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Line 
                        type="monotone" 
                        dataKey="qr_scan" 
                        stroke="#8b5cf6" 
                        name="QR Scans" 
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                        activeDot={{ r: 8 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="cta_click" 
                        stroke="#10b981" 
                        name="CTA Clicks" 
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                        activeDot={{ r: 8 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="page_view" 
                        stroke="#f59e0b" 
                        name="Page Views" 
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No activity data available for the selected period
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Top Products by Engagement</CardTitle>
                <CardDescription>
                  Products with the most total interactions (scans + clicks + views)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Rank</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Total Interactions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.length > 0 ? (
                      topProducts.map((item, index) => (
                        <TableRow 
                          key={item.product_id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => router.push(`/products/${item.product.url_slug}/analytics`)}
                        >
                          <TableCell className="font-medium">#{index + 1}</TableCell>
                          <TableCell className="font-medium">{item.product.name}</TableCell>
                          <TableCell className="text-right font-semibold">
                            {item.total_events.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                          No product interaction data available yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}