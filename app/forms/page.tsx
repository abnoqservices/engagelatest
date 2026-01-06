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
import { Plus, Search, Edit, Copy, Eye, BarChart3, Trash2, MoreVertical, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import axiosClient from "@/lib/axiosClient"
import { showToast } from "@/lib/showToast"

interface Form {
  id: number
  name: string
  slug: string
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
  // These will come from backend later — for now we'll mock if missing
  submissions?: number
  views?: number
  conversionRate?: number
}

const statusColors = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-700",
}

export default function FormsPage() {
  const [forms, setForms] = React.useState<Form[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")

  React.useEffect(() => {
    loadForms()
  }, [])

  const loadForms = async () => {
    try {
      setLoading(true)
      const res = await axiosClient.get('/forms') // GET /api/forms
      if (res.data.success) {
        setForms(res.data.data || [])
      } else {
        showToast("Failed to load forms", "error")
      }
    } catch (err) {
      showToast("Failed to load forms", "error")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredForms = forms.filter(form =>
    form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (form.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this form? This action cannot be undone.")) return

    try {
      const res = await axiosClient.delete(`/forms/${id}`)
      if (res.data.success) {
        setForms(prev => prev.filter(f => f.id !== id))
        showToast("Form deleted successfully", "success")
      }
    } catch (err) {
      showToast("Failed to delete form", "error")
    }
  }

  // Format relative time (e.g., "2 hours ago")
  const formatLastModified = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = diffInMs / (1000 * 60 * 60)
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`
    if (diffInDays < 7) return `${Math.floor(diffInDays)} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading forms...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header - UNCHANGED */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Forms</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create and manage lead capture forms
            </p>
          </div>
          <Link href="/form-builder">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Form
            </Button>
          </Link>
        </div>

        {/* Stats Cards - UNCHANGED (real data later) */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">Total Forms</p>
            <p className="text-3xl font-bold text-foreground mt-2">{forms.length}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {forms.filter(f => f.is_active).length} active
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
            <p className="text-3xl font-bold text-foreground mt-2">—</p>
            <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">Total Views</p>
            <p className="text-3xl font-bold text-foreground mt-2">—</p>
            <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">Avg Conversion</p>
            <p className="text-3xl font-bold text-foreground mt-2">—</p>
            <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
          </div>
        </div>

        {/* Filters Bar - UNCHANGED */}
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
                <SelectItem value="contact">Contact</SelectItem>
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

        {/* Forms Table - DESIGN EXACTLY THE SAME */}
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
              {filteredForms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    No forms found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredForms.map((form) => (
                  <TableRow key={form.id}>
                    <TableCell className="font-medium">
                      <Link 
                        href={`/forms/${form.id}/edit`}
                        className="hover:text-primary"
                      >
                        {form.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Lead Capture</Badge> {/* You can make dynamic later */}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[form.is_active ? "active" : "inactive"]}>
                        {form.is_active ? "active" : "inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {form.submissions?.toLocaleString() || "—"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {form.views?.toLocaleString() || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-blue-700">
                        {form.conversionRate ? `${form.conversionRate}%` : "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatLastModified(form.updated_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/forms/${form.id}/edit`} className="flex items-center">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a 
                              href={`/forms/${form.slug || form.id}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </a>
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
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(form.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination - UNCHANGED */}
          <div className="flex items-center justify-between border-t border-border px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">1-{filteredForms.length}</span> of{" "}
              <span className="font-medium text-foreground">{forms.length}</span> forms
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