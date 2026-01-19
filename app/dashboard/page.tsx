"use client"

import * as React from "react"
import { 
  Package, Calendar, FileText, QrCode, Eye, TrendingUp, 
  Globe, Smartphone, BarChart3, Download, Filter, 
  ArrowUpRight, ArrowDownRight 
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
// ─── Modern Color Palette ────────────────────────────────────────
const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#6366f1']

// ─── Mock Data ───────────────────────────────────────────────────
const summaryMetrics = [
  { title: "Total Products",    value: "384",   change: "+12.5%", isPositive: true,  icon: Package,    trend: [20,35,28,42,38,45,52] },
  { title: "Total Events",      value: "156",   change: "+8.2%",  isPositive: true,  icon: Calendar,   trend: [30,25,35,40,38,42,48] },
  { title: "Form Submissions",  value: "3,247", change: "+19.8%", isPositive: true,  icon: FileText,   trend: [15,25,20,30,35,40,50] },
  { title: "Total QR Scans",    value: "45.2K", change: "+18.2%", isPositive: true,  icon: QrCode,     trend: [25,30,28,35,42,48,55] },
  { title: "Total Page Views",  value: "124.5K",change: "+15.3%", isPositive: true,  icon: Eye,        trend: [40,55,48,62,58,70,82] },
]

const filteredMetrics = [
  { title: "Product Page Views", value: "89.0K", change: "+14.1%", isPositive: true, icon: Eye },
  { title: "Product QR Scans",   value: "32.4K", change: "+16.7%", isPositive: true, icon: QrCode },
  { title: "Form Submissions",   value: "2,890", change: "+23.1%", isPositive: true, icon: FileText },
  { title: "Direct Page Views",  value: "45.6K", change: "+11.9%", isPositive: true, icon: Eye },
]

const utmData = [
  { name: 'Google',   value: 400 },
  { name: 'Facebook', value: 300 },
  { name: 'Direct',   value: 300 },
  { name: 'Email',    value: 200 },
  { name: 'Other',    value: 100 },
]

const deviceData = [
  { name: 'Mobile',  value: 60 },
  { name: 'Desktop', value: 30 },
  { name: 'Tablet',  value: 10 },
]

const timeSeriesData = [
  { date: 'Jan 1',  views: 4200, scans: 1800, subs: 210 },
  { date: 'Jan 8',  views: 3800, scans: 2400, subs: 280 },
  { date: 'Jan 15', views: 5200, scans: 3100, subs: 340 },
  { date: 'Jan 22', views: 4800, scans: 2900, subs: 310 },
  { date: 'Jan 29', views: 6100, scans: 3800, subs: 420 },
  { date: 'Feb 5',  views: 6800, scans: 4500, subs: 510 },
  { date: 'Feb 12', views: 7400, scans: 5200, subs: 580 },
]

// Simple sparkline component
const MiniSparkline = ({ data, color = "#3b82f6" }: { data: number[], color?: string }) => (
  <ResponsiveContainer width="100%" height={36}>
    <AreaChart data={data.map(v => ({ v }))}>
      <defs>
        <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%"  stopColor={color} stopOpacity={0.35}/>
          <stop offset="95%" stopColor={color} stopOpacity={0}/>
        </linearGradient>
      </defs>
      <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#spark-${color})`} />
    </AreaChart>
  </ResponsiveContainer>
)

export default function AnalyticsDashboard() {
  const [product, setProduct] = React.useState("all")
  const [event, setEvent] = React.useState("all")
  const [dateRange, setDateRange] = React.useState("last30")

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 space-y-8">

        {/* Header + Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Analytics Overview</h1>
            <p className="mt-1.5 text-gray-600">Track product performance, traffic sources and user behavior</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" className="gap-2 border-gray-300">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Global Filters - Sticky possible with position: sticky in production */}
      

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {summaryMetrics.map((metric, i) => (
            <Card 
              key={metric.title} 
              className="border-gray-200/70  hover:shadow transition-shadow duration-200"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                    <metric.icon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs font-medium px-2.5 py-0.5 flex items-center gap-1 ${
                      metric.isPositive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}
                  >
                    {metric.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {metric.change}
                  </Badge>
                </div>

                <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                <div className="text-2xl font-bold text-gray-900 mb-3">{metric.value}</div>

                <MiniSparkline data={metric.trend} color={COLORS[i % COLORS.length]} />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Second level filtered metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredMetrics.map((m, i) => (
            <Card key={m.title} className="border border-gray-200/70  hover:shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <m.icon className={`h-5 w-5 ${
                    i === 0 ? 'text-blue-600' :
                    i === 1 ? 'text-purple-600' :
                    i === 2 ? 'text-emerald-600' :
                    'text-amber-600'
                  }`} />
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    {m.change}
                  </span>
                </div>
                <p className="text-sm text-gray-600 font-medium mb-1">{m.title}</p>
                <div className="text-2xl font-bold text-gray-900">{m.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Trends Chart */}
        <Card className="border-gray-200/70 ">
          <CardHeader className="pb-2 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Performance Over Time</CardTitle>
                <CardDescription>Page views, QR scans & form submissions</CardDescription>
              </div>
              <BarChart3 className="h-5 w-5 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={380}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" vertical={false} />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255,255,255,0.98)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: 12 }} iconType="circle" />
                <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2.5} dot={false} name="Page Views" />
                <Line type="monotone" dataKey="scans" stroke="#8b5cf6" strokeWidth={2.5} dot={false} name="QR Scans" />
                <Line type="monotone" dataKey="subs"  stroke="#10b981" strokeWidth={2.5} dot={false} name="Submissions" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* UTM + Device + Country - 3 column layout on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* UTM Pie + simple list */}
          <Card className="border-gray-200/70  lg:col-span-1">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                UTM Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={utmData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {utmData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-6 space-y-2">
                {utmData.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Device Distribution */}
          <Card className="border-gray-200/70  lg:col-span-1">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-purple-600" />
                Devices
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {deviceData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-6 space-y-2">
                {deviceData.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Country Bar Chart */}
          <Card className="border-gray-200/70  lg:col-span-1">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Globe className="h-5 w-5 text-emerald-600" />
                Top Countries
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { name: 'USA', value: 45000 },
                  { name: 'India', value: 32000 },
                  { name: 'UK', value: 18000 },
                  { name: 'Germany', value: 12000 },
                  { name: 'Canada', value: 8000 },
                ]} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    fontSize={13} 
                    width={80}
                  />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </DashboardLayout>
  )
}