"use client"

import * as React from "react"
import Link from "next/link"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, Edit, Copy, Eye, BarChart3, Trash2, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react'

const forms = [
  {
    id: "1",
    name: "Product Interest Form",
    type: "Lead Capture",
    status: "active",
    submissions: 1243,
    views: 4521,
    conversionRate: 27.5,
    lastModified: "2 hours ago",
  },
  {
    id: "2",
    name: "Event Registration",
    type: "Registration",
    status: "active",
    submissions: 567,
    views: 2134,
    conversionRate: 26.6,
    lastModified: "1 day ago",
  },
  {
    id: "3",
    name: "Customer Feedback Survey",
    type: "Survey",
    status: "active",
    submissions: 892,
    views: 3456,
    conversionRate: 25.8,
    lastModified: "3 days ago",
  },
  {
    id: "4",
    name: "Newsletter Signup",
    type: "Lead Capture",
    status: "inactive",
    submissions: 2341,
    views: 8934,
    conversionRate: 26.2,
    lastModified: "1 week ago",
  },
]

const statusColors = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-700",
}

export default function FormsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Forms</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create and manage lead capture forms
            </p>
          </div>
          <Link href="/forms/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Form
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">Total Forms</p>
            <p className="text-3xl font-bold text-foreground mt-2">12</p>
            <p className="text-xs text-muted-foreground mt-1">4 active</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
            <p className="text-3xl font-bold text-foreground mt-2">5,043</p>
            <p className="text-xs text-green-600 mt-1">+12% this month</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">Total Views</p>
            <p className="text-3xl font-bold text-foreground mt-2">19,045</p>
            <p className="text-xs text-green-600 mt-1">+8% this month</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">Avg Conversion</p>
            <p className="text-3xl font-bold text-foreground mt-2">26.5%</p>
            <p className="text-xs text-green-600 mt-1">+2.1% this month</p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search forms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="lead">Lead Capture</SelectItem>
                <SelectItem value="registration">Registration</SelectItem>
                <SelectItem value="survey">Survey</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Forms Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Form Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Submissions</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Conversion Rate</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell className="font-medium">
                    <a href={`/forms/${form.id}`} className="hover:text-primary">
                      {form.name}
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{form.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[form.status as keyof typeof statusColors]}>
                      {form.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {form.submissions.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {form.views.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-blue-700">{form.conversionRate}%</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {form.lastModified}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Analytics
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-border px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">1-4</span> of{" "}
              <span className="font-medium text-foreground">12</span> forms
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
      </div>
    </DashboardLayout>
  )
}
