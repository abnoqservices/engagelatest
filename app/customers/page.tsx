"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Download, Mail, Phone, MapPin, Calendar, Tag, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react'

// Mock data
const customers = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 234 567 8900",
    city: "San Francisco",
    persona: "Tech Enthusiast",
    leadScore: 85,
    lastActive: "2 hours ago",
    tags: ["Premium", "VIP"],
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 234 567 8901",
    city: "New York",
    persona: "Business Professional",
    leadScore: 72,
    lastActive: "1 day ago",
    tags: ["Enterprise"],
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "m.chen@example.com",
    phone: "+1 234 567 8902",
    city: "Austin",
    persona: "Early Adopter",
    leadScore: 91,
    lastActive: "5 hours ago",
    tags: ["Premium", "Beta Tester"],
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    email: "emily.r@example.com",
    phone: "+1 234 567 8903",
    city: "Seattle",
    persona: "Price Conscious",
    leadScore: 56,
    lastActive: "3 days ago",
    tags: ["Newsletter"],
  },
]

const personas = [
  { name: "Tech Enthusiast", count: 234, color: "bg-blue-100 text-blue-700" },
  { name: "Business Professional", count: 189, color: "bg-purple-100 text-purple-700" },
  { name: "Early Adopter", count: 156, color: "bg-green-100 text-green-700" },
  { name: "Price Conscious", count: 98, color: "bg-orange-100 text-orange-700" },
]

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCustomer, setSelectedCustomer] = React.useState<typeof customers[0] | null>(null)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Customers</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage customer relationships and personas
            </p>
          </div>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export List
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">Customer List</TabsTrigger>
            <TabsTrigger value="personas">Personas</TabsTrigger>
          </TabsList>

          {/* Customer List Tab */}
          <TabsContent value="list" className="space-y-6">
            {/* Filters Bar */}
            <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Persona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Personas</SelectItem>
                    <SelectItem value="tech">Tech Enthusiast</SelectItem>
                    <SelectItem value="business">Business Pro</SelectItem>
                    <SelectItem value="early">Early Adopter</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    <SelectItem value="sf">San Francisco</SelectItem>
                    <SelectItem value="ny">New York</SelectItem>
                    <SelectItem value="austin">Austin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Customers Table */}
            <div className="rounded-xl border border-border bg-card shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Persona</TableHead>
                    <TableHead>Lead Score</TableHead>
                    <TableHead>Last Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow
                      key={customer.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <div className="flex gap-1 mt-1">
                            {customer.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span>{customer.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span>{customer.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span>{customer.city}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{customer.persona}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[100px] h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${customer.leadScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{customer.leadScore}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {customer.lastActive}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-border px-6 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">1-4</span> of{" "}
                  <span className="font-medium text-foreground">677</span> customers
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="10">
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 / page</SelectItem>
                      <SelectItem value="20">20 / page</SelectItem>
                      <SelectItem value="50">50 / page</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-1">
                    <Button variant="outline" size="icon" disabled>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Personas Tab */}
          <TabsContent value="personas" className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {personas.map((persona) => (
                <div
                  key={persona.name}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={persona.color}>{persona.name}</Badge>
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{persona.count}</p>
                  <p className="text-sm text-muted-foreground mt-1">Total Customers</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Persona Scoring Rules</h3>
              <div className="space-y-4">
                {personas.map((persona) => (
                  <div key={persona.name} className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{persona.name}</p>
                      <Button variant="outline" size="sm">Edit Rules</Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Based on: Product interactions, engagement frequency, purchase history
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Customer Detail Slide-over */}
      <Sheet open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          {selectedCustomer && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedCustomer.name}</SheetTitle>
                <SheetDescription>Customer profile and activity</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedCustomer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedCustomer.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Last active: {selectedCustomer.lastActive}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Lead Score</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${selectedCustomer.leadScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold">{selectedCustomer.leadScore}/100</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Persona</p>
                  <Badge variant="outline">{selectedCustomer.persona}</Badge>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCustomer.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Button className="w-full">Send Campaign</Button>
                  <Button variant="outline" className="w-full">View Activity</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  )
}
