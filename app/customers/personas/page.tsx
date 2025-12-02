import { DashboardLayout } from "@/components/dashboard/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, TrendingUp } from 'lucide-react'

export default function PersonasPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Customer Personas</h1>
            <p className="text-muted-foreground mt-2">
              AI-powered customer segmentation and scoring
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Persona
          </Button>
        </div>

        {/* Personas Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Hot Lead", score: "90-100", count: 145, color: "bg-red-500" },
            { name: "Decision Maker", score: "80-89", count: 234, color: "bg-orange-500" },
            { name: "Engaged Prospect", score: "70-79", count: 456, color: "bg-amber-500" },
            { name: "Interested Visitor", score: "60-69", count: 789, color: "bg-yellow-500" },
            { name: "Casual Browser", score: "40-59", count: 1234, color: "bg-blue-500" },
            { name: "Low Priority", score: "0-39", count: 567, color: "bg-gray-500" },
          ].map((persona, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{persona.name}</CardTitle>
                    <CardDescription>Score: {persona.score}</CardDescription>
                  </div>
                  <div className={`h-3 w-3 rounded-full ${persona.color}`} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Customers</span>
                    <span className="text-2xl font-bold">{persona.count.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${persona.color}`} style={{ width: `${Math.min(persona.count / 15, 100)}%` }} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Users className="h-4 w-4 mr-1" />
                    View All
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Insights
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Scoring Rules */}
        <Card>
          <CardHeader>
            <CardTitle>Scoring Rules</CardTitle>
            <CardDescription>Configure how customer scores are calculated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Product QR Scan", points: 10 },
                { action: "Landing Page Visit", points: 5 },
                { action: "Demo Video Watch", points: 15 },
                { action: "Form Submission", points: 25 },
                { action: "Email Open", points: 3 },
                { action: "Email Link Click", points: 7 },
              ].map((rule, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                  <span className="font-medium">{rule.action}</span>
                  <Badge variant="secondary">+{rule.points} points</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
