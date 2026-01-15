"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function ProductMetricChart() {
  const product = {
    id: 123,
    name: "Product Name",
  }

  const metrics = {
    page_views: 450,
    unique_visitors: 320,
    button_clicks: 120,
    form_submissions: 45,
    conversion_rate: 10.0,
    avg_time_on_page: 145.5,
    avg_scroll_depth: 68.2,
  }

  const chartData = [
    { name: "Page Views", value: metrics.page_views },
    { name: "Visitors", value: metrics.unique_visitors },
    { name: "Clicks", value: metrics.button_clicks },
    { name: "Submissions", value: metrics.form_submissions },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name} – Performance</CardTitle>
        <CardDescription>User engagement & conversions</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Chart */}
        <ChartContainer
          config={{
            value: { label: "Count", color: "hsl(220, 90%, 55%)" },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--color-value)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* KPI Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Kpi label="Conversion Rate" value={`${metrics.conversion_rate}%`} />
          <Kpi label="Avg Time on Page" value={`${metrics.avg_time_on_page}s`} />
          <Kpi label="Scroll Depth" value={`${metrics.avg_scroll_depth}%`} />
        </div>
      </CardContent>
    </Card>
  )
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-card p-4 text-center">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  )
}
