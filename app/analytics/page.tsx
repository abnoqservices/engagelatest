"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, TrendingDown, Eye, Users, QrCode, ShoppingCart } from 'lucide-react'
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data
const productData = [
  { name: "MacBook Pro", views: 4521, scans: 1243, leads: 89 },
  { name: "iPhone 15", views: 8934, scans: 2156, leads: 156 },
  { name: "AirPods", views: 3421, scans: 876, leads: 67 },
  { name: "Apple Watch", views: 2134, scans: 654, leads: 43 },
  { name: "iPad Pro", views: 4567, scans: 1089, leads: 92 },
]

const timeData = [
  { time: "00:00", scans: 12, views: 45 },
  { time: "04:00", scans: 8, views: 23 },
  { time: "08:00", scans: 45, views: 156 },
  { time: "12:00", scans: 78, views: 289 },
  { time: "16:00", scans: 92, views: 345 },
  { time: "20:00", scans: 56, views: 198 },
]

const funnelData = [
  { stage: "Views", count: 23577, color: "bg-blue-500" },
  { stage: "Scans", count: 6018, color: "bg-indigo-500" },
  { stage: "Leads", count: 447, color: "bg-purple-500" },
  { stage: "Conversions", count: 134, color: "bg-pink-500" },
]

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Deep insights into your engagement metrics
            </p>
          </div>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="product" className="space-y-6">
          <TabsList>
            <TabsTrigger value="product">Product</TabsTrigger>
            <TabsTrigger value="event">Event</TabsTrigger>
            <TabsTrigger value="booth">Booth</TabsTrigger>
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="campaign">Campaign</TabsTrigger>
          </TabsList>

          {/* Product Analytics Tab */}
          <TabsContent value="product" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="mbp">MacBook Pro</SelectItem>
                  <SelectItem value="iphone">iPhone 15</SelectItem>
                  <SelectItem value="airpods">AirPods</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="7days">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="tech">Tech Summit</SelectItem>
                  <SelectItem value="launch">Product Launch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23,577</div>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>+12.5% from last period</span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">QR Scans</CardTitle>
                  <QrCode className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">6,018</div>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>+8.3% from last period</span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Leads Generated</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">447</div>
                  <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                    <TrendingDown className="h-3 w-3" />
                    <span>-2.1% from last period</span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7.43%</div>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>+1.2% from last period</span>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Product Performance</CardTitle>
                  <CardDescription>Views, scans, and leads by product</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      views: { label: "Views", color: "hsl(210, 100%, 50%)" },
                      scans: { label: "Scans", color: "hsl(250, 80%, 60%)" },
                      leads: { label: "Leads", color: "hsl(280, 70%, 55%)" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={productData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="views" fill="var(--color-views)" />
                        <Bar dataKey="scans" fill="var(--color-scans)" />
                        <Bar dataKey="leads" fill="var(--color-leads)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Engagement Heatmap</CardTitle>
                  <CardDescription>Activity by time of day</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      scans: { label: "Scans", color: "hsl(250, 80%, 60%)" },
                      views: { label: "Views", color: "hsl(210, 100%, 50%)" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={timeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="scans" stroke="var(--color-scans)" strokeWidth={2} />
                        <Line type="monotone" dataKey="views" stroke="var(--color-views)" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Conversion Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>Track the customer journey from view to conversion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {funnelData.map((stage, index) => {
                    const percentage = index === 0 ? 100 : ((stage.count / funnelData[0].count) * 100).toFixed(1)
                    return (
                      <div key={stage.stage}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{stage.stage}</span>
                          <span className="text-sm text-muted-foreground">
                            {stage.count.toLocaleString()} ({percentage}%)
                          </span>
                        </div>
                        <div className="h-12 rounded-lg overflow-hidden bg-secondary">
                          <div
                            className={`h-full ${stage.color} flex items-center justify-center text-white font-medium`}
                            style={{ width: `${percentage}%` }}
                          >
                            {stage.count.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs would have similar structure */}
          <TabsContent value="event">
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                Event analytics coming soon...
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="booth">
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                Booth analytics coming soon...
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customer">
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                Customer analytics coming soon...
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaign">
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                Campaign analytics coming soon...
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
