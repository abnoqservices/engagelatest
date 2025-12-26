"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { QrCode, Users, MousePointerClick, Eye, Package, Download, Calendar } from 'lucide-react'
import axiosClient from "@/lib/axiosClient"

import { showToast } from "@/lib/showToast"
import { format } from "date-fns"
import { useParams, useRouter } from "next/navigation"
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
    const eventId = params.id || params.slug
  
    const [eventData, setEventData] = React.useState<EventSummary | null>(null)
    const [productData, setProductData] = React.useState<ProductAnalytics | null>(null)
    const [loading, setLoading] = React.useState(true)
  
    const fetchAnalytics = async () => {
      setLoading(true)
      try {
        const [eventRes, productRes] = await Promise.all([
          axiosClient.get(`/analytics/events/${eventId}`),
          axiosClient.get(`/analytics/events/${eventId}/products`)
        ])
  
        setEventData(eventRes.data.data)
        setProductData(productRes.data.data)
      } catch (error: any) {
        const msg = error.response?.data?.message || "Failed to load analytics"
        showToast(msg, "error")
        if (error.response?.status === 404) {
          router.push("/events")
        }
      } finally {
        setLoading(false)
      }
    }
  
    React.useEffect(() => {
      if (eventId) fetchAnalytics()
    }, [eventId])
  
    // ← MOVE useMemo HERE, before any early returns!
    const dailyData = React.useMemo(() => {
      // Safely handle null/undefined analytics
      const analytics = eventData?.analytics ?? []
  
      const map = new Map<string, { date: string; qr_scan: number; cta_click: number; page_view: number }>()
  
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
  
      return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date))
    }, [eventData?.analytics]) // recompute only when analytics change
  
    // Now safe to do early returns
    if (loading) {
        return (
          <DashboardLayout>
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          </DashboardLayout>
        )
      }
    
      if (!eventData) {
        return (
          <DashboardLayout>
            <div className="max-w-4xl mx-auto py-16 text-center">
              <p className="text-muted-foreground text-lg">No analytics data available for this event.</p>
            </div>
          </DashboardLayout>
        )
      }
    
      // ← NOW SAFE TO DESTRUCTURE
      const { event, summary, analytics } = eventData
    
      // Optional: Provide safe defaults in case summary fields are missing
      const safeSummary = {
        qr_scan: summary?.qr_scan ?? 0,
        cta_click: summary?.cta_click ?? 0,
        page_view: summary?.page_view ?? 0,
      }
    
      const topProducts = productData?.product_summary
        ?.sort((a, b) => b.total_events - a.total_events)
        .slice(0, 10) ?? []
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 py-8 px-4">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <QrCode className="h-8 w-8" />
              {event.name} - Analytics
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-muted-foreground">
                Event ID: <span className="font-medium">#{event.id}</span>
              </p>
              {event.is_active && <Badge>Active Event</Badge>}
            </div>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Key Metrics */}
      {/* Key Metrics */}
<div className="grid gap-6 md:grid-cols-3">
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">QR Scans</CardTitle>
      <QrCode className="h-5 w-5 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{safeSummary.qr_scan.toLocaleString()}</div>
      <p className="text-xs text-muted-foreground">Total booth QR scans</p>
    </CardContent>
  </Card>

  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">CTA Clicks</CardTitle>
      <MousePointerClick className="h-5 w-5 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{safeSummary.cta_click.toLocaleString()}</div>
      <p className="text-xs text-muted-foreground">Call-to-action interactions</p>
    </CardContent>
  </Card>

  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Page Views</CardTitle>
      <Eye className="h-5 w-5 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{safeSummary.page_view.toLocaleString()}</div>
      <p className="text-xs text-muted-foreground">Total product page visits</p>
    </CardContent>
  </Card>
</div>

        {/* Tabs */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList>
            <TabsTrigger value="trends">Activity Trends</TabsTrigger>
            <TabsTrigger value="products">Product Interest</TabsTrigger>
          </TabsList>

          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>Daily Activity</CardTitle>
                <CardDescription>QR scans, CTA clicks, and page views over time</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                {dailyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="qr_scan" stroke="#8884d8" name="QR Scans" strokeWidth={2} />
                      <Line type="monotone" dataKey="cta_click" stroke="#82ca9d" name="CTA Clicks" strokeWidth={2} />
                      <Line type="monotone" dataKey="page_view" stroke="#ffc658" name="Page Views" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No activity data available yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Top Products by Engagement</CardTitle>
                <CardDescription>Products with highest total interactions (scans + clicks + views)</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead className="text-right">Total Interactions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.length > 0 ? (
                      topProducts.map((item, index) => (
                        <TableRow key={item.product_id}>
                          <TableCell className="font-medium">#{index + 1}</TableCell>
                          <TableCell className="font-medium">{item.product.name}</TableCell>
                          <TableCell className="text-right font-semibold">
                            {item.total_events.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                          No product interaction data yet
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