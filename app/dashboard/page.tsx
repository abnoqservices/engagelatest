"use client"

import * as React from "react"
import { Package, Calendar, QrCode, UserCheck, Eye, TrendingUp, Download, BarChart3, Users, Megaphone, CalendarPlus, Sparkles } from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/dashboard/layout"

// Mock data
const qrScanData = [
  { date: "Jan 1", scans: 1200 },
  { date: "Jan 8", scans: 1900 },
  { date: "Jan 15", scans: 1600 },
  { date: "Jan 22", scans: 2400 },
  { date: "Jan 29", scans: 2100 },
  { date: "Feb 5", scans: 2800 },
  { date: "Feb 12", scans: 3200 },
]

const topProductsData = [
  { name: "iPhone 15 Pro", scans: 3240 },
  { name: "MacBook Pro M3", scans: 2890 },
  { name: "AirPods Pro", scans: 2340 },
  { name: "iPad Air", scans: 1980 },
  { name: "Apple Watch", scans: 1560 },
]

const funnelData = [
  { stage: "QR Scans", count: 12500, percentage: 100 },
  { stage: "Product Views", count: 8900, percentage: 71 },
  { stage: "Form Opens", count: 5200, percentage: 42 },
  { stage: "Form Submits", count: 2890, percentage: 23 },
  { stage: "Qualified Leads", count: 890, percentage: 7 },
]

const eventHeatmap = [
  { booth: "A1", Mon: 45, Tue: 52, Wed: 48, Thu: 61, Fri: 58 },
  { booth: "A2", Mon: 38, Tue: 44, Wed: 41, Thu: 49, Fri: 52 },
  { booth: "B1", Mon: 62, Tue: 58, Wed: 65, Thu: 72, Fri: 68 },
  { booth: "B2", Mon: 41, Tue: 47, Wed: 43, Thu: 52, Fri: 49 },
  { booth: "C1", Mon: 55, Tue: 61, Wed: 58, Thu: 64, Fri: 71 },
]

const engagementTrendData = [
  { month: "Jan", scans: 1200, views: 1800, leads: 450 },
  { month: "Feb", scans: 1900, views: 2400, leads: 680 },
  { month: "Mar", scans: 1600, views: 2100, leads: 520 },
  { month: "Apr", scans: 2400, views: 3200, leads: 890 },
  { month: "May", scans: 2100, views: 2800, leads: 720 },
  { month: "Jun", scans: 2800, views: 3600, leads: 1100 },
  { month: "Jul", scans: 3200, views: 4200, leads: 1350 },
]

const metrics = [
  {
    title: "Total Products",
    value: "384",
    change: "+12.5%",
    isPositive: true,
    icon: Package,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
  {
    title: "Live Events",
    value: "23",
    change: "+4",
    isPositive: true,
    icon: Calendar,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
  {
    title: "QR Scans",
    value: "45.2K",
    change: "+18.2%",
    isPositive: true,
    icon: QrCode,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
  {
    title: "Leads Generated",
    value: "2,890",
    change: "+23.1%",
    isPositive: true,
    icon: UserCheck,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
  {
    title: "Page Views",
    value: "124.5K",
    change: "+15.3%",
    isPositive: true,
    icon: Eye,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
  {
    title: "Form Submissions",
    value: "3,247",
    change: "+19.8%",
    isPositive: true,
    icon: TrendingUp,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
]

const quickActions = [
  {
    title: "Generate QR",
    description: "Create QR codes for products",
    icon: QrCode,
    href: "/products/new",
  },
  {
    title: "Create Event",
    description: "Set up a new event",
    icon: CalendarPlus,
    href: "/events/new",
  },
  {
    title: "Send Campaign",
    description: "Launch marketing campaign",
    icon: Megaphone,
    href: "/campaigns/new",
  },
  {
    title: "View Leads",
    description: "See all captured leads",
    icon: Users,
    href: "/customers",
  },
]

export default function DashboardPage() {
  const [timeRange, setTimeRange] = React.useState("7d")

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6 bg-[#F9FAFB] min-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-[#1C2434] tracking-tight">Dashboard</h1>
            <p className="text-sm text-gray-500 font-normal mt-1">Welcome back! Here's what's happening with your engagement platform.</p>
          </div>
          <Button className="bg-[#3C50E0] hover:bg-[#3C50E0]/90 text-white shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {metrics.slice(0, 2).map((metric) => (
            <Card key={metric.title} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-full ${metric.bgColor} flex items-center justify-center`}>
                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                  <h3 className="text-[32px] font-bold text-[#1C2434] leading-none tracking-tight mb-3">{metric.value}</h3>
                  <div className="flex items-center gap-1">
                    <TrendingUp className={`w-4 h-4 ${metric.isPositive ? 'text-green-600' : 'text-red-600 rotate-180'}`} />
                    <span className={`text-sm font-semibold ${metric.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="bg-white border-gray-200 shadow-sm lg:row-span-2 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-3 px-6 pt-6">
              <div>
                <CardTitle className="text-lg font-bold text-[#1C2434] tracking-tight">Active Campaigns</CardTitle>
                <CardDescription className="text-sm text-gray-500 mt-1 font-normal">Running marketing campaigns</CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100">
                <Sparkles className="h-4 w-4 text-gray-500" />
              </Button>
            </CardHeader>
            <CardContent className="pb-6 px-6 space-y-4">
              {/* Campaign Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Megaphone className="h-5 w-5 text-blue-600" />
                    <span className="text-xs font-medium text-blue-600">Email</span>
                  </div>
                  <p className="text-2xl font-bold text-[#1C2434]">12</p>
                  <p className="text-xs text-gray-500 mt-1">Active campaigns</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span className="text-xs font-medium text-purple-600">SMS</span>
                  </div>
                  <p className="text-2xl font-bold text-[#1C2434]">8</p>
                  <p className="text-xs text-gray-500 mt-1">Active campaigns</p>
                </div>
              </div>

              {/* Recent Campaigns */}
              <div className="space-y-3 pt-2">
                <p className="text-sm font-semibold text-gray-700">Recent Campaigns</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Product Launch 2024</p>
                        <p className="text-xs text-gray-500">Email • 2,450 sent</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Event Reminder</p>
                        <p className="text-xs text-gray-500">SMS • 890 sent</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Welcome Series</p>
                        <p className="text-xs text-gray-500">Email • 1,230 sent</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Scheduled</Badge>
                  </div>
                </div>
              </div>

              {/* Performance Summary */}
              <div className="pt-4 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5 font-medium">Open Rate</p>
                    <p className="text-base font-bold text-[#1C2434] flex items-center gap-1">
                      34.5%
                      <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5 font-medium">Click Rate</p>
                    <p className="text-base font-bold text-[#1C2434] flex items-center gap-1">
                      12.8%
                      <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5 font-medium">Conversion</p>
                    <p className="text-base font-bold text-[#1C2434] flex items-center gap-1">
                      5.2%
                      <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {metrics.slice(2).map((metric) => (
            <Card key={metric.title} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-full ${metric.bgColor} flex items-center justify-center`}>
                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                  <h3 className="text-[32px] font-bold text-[#1C2434] leading-none tracking-tight mb-3">{metric.value}</h3>
                  <div className="flex items-center gap-1">
                    <TrendingUp className={`w-4 h-4 ${metric.isPositive ? 'text-green-600' : 'text-red-600 rotate-180'}`} />
                    <span className={`text-sm font-semibold ${metric.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-4 px-6 pt-6">
            <div>
              <CardTitle className="text-lg font-bold text-[#1C2434] tracking-tight">QR Scan Activity</CardTitle>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100">
              <BarChart3 className="h-4 w-4 text-gray-500" />
            </Button>
          </CardHeader>
          <CardContent className="pb-6 px-6">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={qrScanData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF" 
                  style={{ fontSize: '12px', fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  style={{ fontSize: '12px', fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                <Bar dataKey="scans" fill="#3C50E0" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-4 px-6 pt-6">
            <div>
              <CardTitle className="text-lg font-bold text-[#1C2434] tracking-tight">Engagement Statistics</CardTitle>
              <CardDescription className="text-sm text-gray-500 mt-1 font-normal">QR Scans, Page Views, and Leads over time</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant={timeRange === "monthly" ? "secondary" : "ghost"} size="sm" className="h-8 text-xs font-medium hover:bg-gray-100">Monthly</Button>
              <Button variant={timeRange === "quarterly" ? "secondary" : "ghost"} size="sm" className="h-8 text-xs font-medium hover:bg-gray-100">Quarterly</Button>
              <Button variant={timeRange === "yearly" ? "secondary" : "ghost"} size="sm" className="h-8 text-xs font-medium bg-gray-100">Annually</Button>
            </div>
          </CardHeader>
          <CardContent className="pb-6 px-6">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={engagementTrendData}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3C50E0" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3C50E0" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#93C5FD" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#93C5FD" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#A78BFA" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF" 
                  style={{ fontSize: '12px', fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  style={{ fontSize: '12px', fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="scans" 
                  stroke="#3C50E0" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorScans)" 
                  name="QR Scans"
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#93C5FD" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                  name="Page Views"
                />
                <Area 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="#A78BFA" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorLeads)" 
                  name="Leads"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b border-gray-100 pb-4 px-6 pt-6">
              <CardTitle className="text-lg font-bold text-gray-900">QR Scans Trend</CardTitle>
              <CardDescription className="text-sm text-gray-600">Daily scan activity over time</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={qrScanData}>
                  <defs>
                    <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3C50E0" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3C50E0" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="scans"
                    stroke="#3C50E0"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorScans)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b border-gray-100 pb-4 px-6 pt-6">
              <CardTitle className="text-lg font-bold text-gray-900">Top Products</CardTitle>
              <CardDescription className="text-sm text-gray-600">Most scanned this month</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProductsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis type="number" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <YAxis type="category" dataKey="name" stroke="#9ca3af" style={{ fontSize: '12px' }} width={100} />
                  <Tooltip />
                  <Bar dataKey="scans" fill="#a78bfa" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="border-b border-gray-100 pb-4 px-6 pt-6">
            <CardTitle className="text-lg font-bold text-gray-900">Lead Funnel</CardTitle>
            <CardDescription className="text-sm text-gray-600">Conversion stages breakdown</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {funnelData.map((stage, index) => (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{stage.stage}</span>
                    <span className="text-muted-foreground">
                      {stage.count.toLocaleString()} ({stage.percentage}%)
                    </span>
                  </div>
                  <div className="h-8 overflow-hidden rounded-lg bg-muted">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all"
                      style={{ width: `${stage.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="border-b border-gray-100 pb-4 px-6 pt-6">
            <CardTitle className="text-lg font-bold text-gray-900">Event Heatmap</CardTitle>
            <CardDescription className="text-sm text-gray-600">Booth engagement this week</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="grid grid-cols-6 gap-2 text-xs font-medium text-muted-foreground">
                <div>Booth</div>
                <div className="text-center">Mon</div>
                <div className="text-center">Tue</div>
                <div className="text-center">Wed</div>
                <div className="text-center">Thu</div>
                <div className="text-center">Fri</div>
              </div>
              {eventHeatmap.map((row) => (
                <div key={row.booth} className="grid grid-cols-6 gap-2">
                  <div className="flex items-center text-sm font-medium">
                    {row.booth}
                  </div>
                  {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => {
                    const value = row[day as keyof typeof row] as number
                    const intensity = Math.min((value / 80), 1)
                    const rgb = `rgba(167, 139, 250, ${intensity})`
                    return (
                      <div
                        key={day}
                        className="flex h-12 items-center justify-center rounded-md text-xs font-medium"
                        style={{
                          backgroundColor: rgb,
                          color: intensity > 0.5 ? "white" : "hsl(var(--foreground))",
                        }}
                      >
                        {value}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="border-b border-gray-100 pb-4 px-6 pt-6">
            <CardTitle className="text-lg font-bold text-gray-900">Quick Actions</CardTitle>
            <CardDescription className="text-sm text-gray-600">Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action) => (
                <Button
                  key={action.title}
                  variant="outline"
                  className="h-auto flex-col items-start gap-2 p-4"
                  asChild
                >
                  <a href={action.href}>
                    <action.icon className="h-6 w-6 text-primary" />
                    <div className="text-left">
                      <div className="font-semibold">{action.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {action.description}
                      </div>
                    </div>
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
