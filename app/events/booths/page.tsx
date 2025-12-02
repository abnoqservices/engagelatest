import { DashboardLayout } from "@/components/dashboard/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Plus, QrCode, BarChart3, MapPin } from 'lucide-react'

export default function BoothsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Event Booths</h1>
            <p className="text-muted-foreground mt-2">
              Manage booths across all your events
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Booth
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search booths..." className="pl-9" />
          </div>
          <Button variant="outline">All Events</Button>
          <Button variant="outline">All Zones</Button>
        </div>

        {/* Booths Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Booth A1", event: "Tech Expo 2025", zone: "Main Hall", products: 8, scans: 234 },
            { name: "Booth B5", event: "Tech Expo 2025", zone: "Innovation Wing", products: 12, scans: 189 },
            { name: "Booth C2", event: "Product Launch", zone: "Central Area", products: 6, scans: 156 },
            { name: "Booth D3", event: "Innovation Fair", zone: "North Wing", products: 10, scans: 145 },
            { name: "Booth A7", event: "Tech Expo 2025", zone: "Main Hall", products: 15, scans: 123 },
            { name: "Booth E1", event: "Product Launch", zone: "VIP Section", products: 5, scans: 98 },
          ].map((booth, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{booth.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {booth.zone}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{booth.event}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Products</p>
                    <p className="text-2xl font-bold">{booth.products}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Scans</p>
                    <p className="text-2xl font-bold">{booth.scans}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <QrCode className="h-4 w-4 mr-1" />
                    QR Code
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
