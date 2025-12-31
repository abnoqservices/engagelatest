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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, Calendar, MapPin, Edit, BarChart3, Trash2, MoreVertical, ChevronLeft, ChevronRight, ToggleRight, ToggleLeft } from 'lucide-react'
import Link from "next/link"
import axiosClient from "@/lib/axiosClient"
import { showToast } from "@/lib/showToast"
import { format } from "date-fns"

interface Booth {
  id: number
  booth_name: string
  booth_code: string | null
}

interface Event {
  id: number
  name: string
  location: string | null
  start_date: string | null
  end_date: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  booth: Booth | null
}

interface EventsResponse {
  success: boolean
  data: Event[]
}

const statusBadge = (isActive: boolean) => {
  return isActive ? (
    <Badge className="bg-green-100 text-green-700">Active</Badge>
  ) : (
    <Badge variant="secondary">Inactive</Badge>
  )
}

export default function EventsPage() {
  const [events, setEvents] = React.useState<Event[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [activeFilter, setActiveFilter] = React.useState<"all" | "true" | "false">("all")
  const [page, setPage] = React.useState(1)
  const [perPage] = React.useState(10)
  const [total, setTotal] = React.useState(0)

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const params: any = {
        page,
        per_page: perPage,
      }
      if (searchQuery) params.search = searchQuery
      if (activeFilter !== "all") params.is_active = activeFilter

      const response = await axiosClient.get<EventsResponse>("/events", { params })
      setEvents(response.data.data || [])
      // Note: If backend supports pagination metadata, extract total here
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to load events", "error")
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchEvents()
  }, [searchQuery, activeFilter, page])

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this event? This cannot be undone.")) return

    try {
      await axiosClient.delete(`/events/${id}`)
      showToast("Event deleted successfully", "success")
      fetchEvents()
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to delete event", "error")
    }
  }

  const handleToggleActive = async (id: number, current: boolean) => {
    try {
      if (!current) {
        await axiosClient.patch(`/events/${id}/activate`)
        showToast("Event activated successfully", "success")
      } else {
        // To deactivate, just update is_active to false (backend will allow only one active)
        await axiosClient.patch(`/events/${id}`, { is_active: false })
        showToast("Event deactivated", "success")
      }
      fetchEvents()
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to update event status", "error")
    }
  }
///events/${event.id}/analytics
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Events</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your exhibitions. Only one event can be active at a time.
            </p>
          </div>
          <Link href="/events/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={activeFilter} onValueChange={(v: any) => setActiveFilter(v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="true">Active Only</SelectItem>
              <SelectItem value="false">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-slate-200 bg-card shadow-sm overflow-hidden p-4">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Event Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Booth</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">Loading events...</TableCell>
                </TableRow>
              ) : events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No events found. Create your first event!
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">
                      <Link href={`/events/${event.id}`} className="hover:text-primary hover:underline">
                        {event.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {event.location ? (
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {event.location}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {event.start_date || event.end_date ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {event.start_date && format(new Date(event.start_date), "MMM d")}
                          {event.end_date && ` - ${format(new Date(event.end_date), "MMM d, yyyy")}`}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {event.booth ? (
                        <Badge variant="outline">{event.booth.booth_name}</Badge>
                      ) : (
                        <span className="text-muted-foreground">No booth</span>
                      )}
                    </TableCell>
                    <TableCell>{statusBadge(event.is_active)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={`/events/${event.id}/edit`}>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          </Link>
                          <Link href={`/`}>
                            <DropdownMenuItem>
                              <BarChart3 className="mr-2 h-4 w-4" />
                              Analytics
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem onSelect={() => handleToggleActive(event.id, event.is_active)}>
                            {event.is_active ? (
                              <>
                                <ToggleLeft className="mr-2 h-4 w-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <ToggleRight className="mr-2 h-4 w-4" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onSelect={() => handleDelete(event.id)}>
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

          {/* Pagination placeholder */}
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {events.length} event(s)
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setPage(p => p + 1)} disabled={events.length < perPage}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}