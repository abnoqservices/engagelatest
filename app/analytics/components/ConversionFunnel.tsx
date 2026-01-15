import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FunnelStage {
  stage: string
  count: number
  percentage: number
  color?: string
}

const STATIC_FUNNEL_DATA: FunnelStage[] = [
  { stage: "Page Views", count: 12450, percentage: 100, color: "bg-blue-500" },
  { stage: "Engaged Users", count: 8920, percentage: 71.6, color: "bg-indigo-500" },
  { stage: "Button Clicks", count: 1840, percentage: 14.8, color: "bg-purple-500" },
  { stage: "Form Submissions", count: 320, percentage: 2.6, color: "bg-green-500" },
]

interface FunnelProps {
  funnel?: {
    page_views?: { count: number; percentage: number }
    engaged_users?: { count: number; percentage: number }
    button_clicks?: { count: number; percentage: number }
    form_submissions?: { count: number; percentage: number }
    [key: string]: any
  }
}

export default function ConversionFunnel({ funnel }: FunnelProps) {
  // For now we use static data (you can remove this later)
  const stages = STATIC_FUNNEL_DATA

  // ── When you're ready to switch to real API data, uncomment this part ──
  /*
  const stages: FunnelStage[] = funnel
    ? [
        {
          stage: "Page Views",
          count: funnel.page_views?.count ?? 0,
          percentage: funnel.page_views?.percentage ?? 100,
        },
        {
          stage: "Engaged Users",
          count: funnel.engaged_users?.count ?? 0,
          percentage: funnel.engaged_users?.percentage ?? 0,
        },
        {
          stage: "Button Clicks",
          count: funnel.button_clicks?.count ?? 0,
          percentage: funnel.button_clicks?.percentage ?? 0,
        },
        {
          stage: "Form Submissions",
          count: funnel.form_submissions?.count ?? 0,
          percentage: funnel.form_submissions?.percentage ?? 0,
        },
      ].filter((s) => s.count > 0) // optional: hide stages with zero count
    : STATIC_FUNNEL_DATA
  */

  // If somehow we have no data at all (very rare case)
  if (stages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent className="py-12 text-center text-muted-foreground">
          No conversion data available yet
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Funnel</CardTitle>
        <CardDescription>Customer journey from view to conversion</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {stages.map((item) => (
            <div key={item.stage} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.stage}</span>
                <span className="text-muted-foreground">
                  {item.count.toLocaleString()} ({item.percentage.toFixed(1)}%)
                </span>
              </div>

              <div className="h-10 rounded-full overflow-hidden bg-muted/40">
                <div
                  className={`h-full ${item.color || "bg-gradient-to-r from-blue-500 to-indigo-600"} transition-all duration-700 flex items-center justify-end pr-3 text-xs font-medium text-white`}
                  style={{ width: `${item.percentage}%` }}
                >
                  {item.percentage > 8 && `${item.percentage.toFixed(1)}%`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}