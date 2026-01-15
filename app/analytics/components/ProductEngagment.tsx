"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function ProductEngagement() {
  const product = {
    id: 123,
    name: "Product Name",
  }

  const engagement = {
    avg_time_on_page: 145.5,
    avg_scroll_depth: 68.2,
    bounce_rate: 35.5,
  }

  const timeInMinutes = (engagement.avg_time_on_page / 60).toFixed(1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name} – Engagement</CardTitle>
        <CardDescription>User behavior on product page</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Avg Time on Page */}
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-sm text-muted-foreground">Avg Time on Page</p>
          <p className="text-3xl font-bold mt-1">
            {timeInMinutes} min
          </p>
          <p className="text-xs text-muted-foreground">
            {engagement.avg_time_on_page} seconds
          </p>
        </div>

        {/* Scroll Depth */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Avg Scroll Depth</span>
            <span className="font-medium">{engagement.avg_scroll_depth}%</span>
          </div>
          <Progress value={engagement.avg_scroll_depth} />
        </div>

        {/* Bounce Rate */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Bounce Rate</span>
            <span className="font-medium">{engagement.bounce_rate}%</span>
          </div>
          <Progress value={engagement.bounce_rate} />
          <p className="text-xs text-muted-foreground">
            Lower is better
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
