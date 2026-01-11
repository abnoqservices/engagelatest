"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import axiosClient from "@/lib/axiosClient"
import { showToast } from "@/lib/showToast"
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
  SheetFooter,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Tag,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  Save,
  X,
} from 'lucide-react'

// ────────────────────────────────────────────────
// Types
interface Contact {
  id: number
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  company: string | null
  contact_type: string
  contact_source: string
  status: "active" | "archived"
  created_at: string
  updated_at: string
}

interface DetailResponse {
  success: boolean
  data: Contact & {
    notes?: any[]
    custom_field_values?: any[]
    activities?: any[]
  }
}

interface PaginatedResponse {
  success: boolean
  data: {
    current_page: number
    data: Contact[]
    per_page: number
    total: number
  }
}

// ────────────────────────────────────────────────
export default function CustomersPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContact, setSelectedContact] = useState<DetailResponse["data"] | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<Contact>>({})
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(15)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchContacts = async () => {
    setLoading(true)
    try {
      const params: any = { per_page: perPage, page: currentPage }
      if (searchQuery) params.search = searchQuery
      if (statusFilter !== "all") params.status = statusFilter

      const res = await axiosClient.get<PaginatedResponse>("/contacts", { params })
      if (res.data.success) {
        setContacts(res.data.data.data)
        setTotal(res.data.data.total)
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to load contacts", "error")
    } finally {
      setLoading(false)
    }
  }

  const fetchContactDetail = async (id: number) => {
    try {
      const res = await axiosClient.get<DetailResponse>(`/contacts/${id}`)
      if (res.data.success) {
        setSelectedContact(res.data.data)
        setFormData(res.data.data)
        setIsEditing(false)
      }
    } catch {
      showToast("Failed to load contact details", "error")
    }
  }

  const handleUpdate = async () => {
    if (!selectedContact) return
    try {
      const res = await axiosClient.put(`/contacts/${selectedContact.id}`, formData)
      if (res.data.success) {
        showToast("Contact updated successfully", "success")
        setSelectedContact(res.data.data || { ...selectedContact, ...formData })
        setIsEditing(false)
        fetchContacts() // refresh list
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to update contact", "error")
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await axiosClient.delete(`/contacts/${deleteId}`)
      showToast("Contact deleted", "success")
      fetchContacts()
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to delete", "error")
    } finally {
      setDeleteId(null)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [currentPage, perPage, searchQuery, statusFilter])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Customers</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your contacts and relationships
            </p>
          </div>
          <div className="flex gap-3">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Contact
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="list" className="space-y-6">
          {/* <TabsList>
            <TabsTrigger value="list">Contact List</TabsTrigger>
            <TabsTrigger value="personas">Personas</TabsTrigger>
          </TabsList> */}

          <TabsContent value="list" className="space-y-6">
<<<<<<< Updated upstream
            {/* Filters */}
            <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
=======
            {/* Filters Bar */}
            <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4  sm:flex-row sm:items-center sm:justify-between">
>>>>>>> Stashed changes
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search name, email, phone..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={perPage.toString()}
                  onValueChange={(v) => {
                    setPerPage(Number(v))
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 / page</SelectItem>
                    <SelectItem value="15">15 / page</SelectItem>
                    <SelectItem value="25">25 / page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

<<<<<<< Updated upstream
            {/* Table */}
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-12 text-center">Loading...</div>
              ) : contacts.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">No contacts found</div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-16 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts.map((contact) => (
                        <TableRow key={contact.id} className="hover:bg-muted/40">
                          <TableCell
                            className="cursor-pointer font-medium"
                            onClick={() => fetchContactDetail(contact.id)}
                          >
                            {contact.first_name} {contact.last_name}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1 text-sm">
                              {contact.email && (
                                <div className="flex items-center gap-2">
                                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                  {contact.email}
                                </div>
                              )}
                              {contact.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                  {contact.phone}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{contact.company || "—"}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{contact.contact_source}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={contact.status === "active" ? "default" : "secondary"}
                            >
                              {contact.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => fetchContactDetail(contact.id)}
                                  className="gap-2"
                                >
                                  <Eye className="h-4 w-4" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => fetchContactDetail(contact.id)}
                                  className="gap-2"
                                >
                                  <Pencil className="h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive gap-2"
                                  onClick={() => setDeleteId(contact.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
=======
            {/* Customers Table */}
            <div className="rounded-xl border border-border bg-card ">
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
>>>>>>> Stashed changes

                  {/* Pagination */}
                  <div className="flex items-center justify-between border-t px-6 py-4 text-sm text-muted-foreground">
                    <div>
                      Showing {(currentPage - 1) * perPage + 1}–
                      {Math.min(currentPage * perPage, total)} of {total}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={currentPage * perPage >= total}
                        onClick={() => setCurrentPage(p => p + 1)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

<<<<<<< Updated upstream
          <TabsContent value="personas" className="py-12 text-center text-muted-foreground">
            Personas / segmentation view coming soon...
=======
          {/* Personas Tab */}
          <TabsContent value="personas" className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {personas.map((persona) => (
                <div
                  key={persona.name}
                  className="rounded-xl border border-border bg-card p-6  hover: transition-shadow"
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

            <div className="rounded-xl border border-border bg-card p-6 ">
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
>>>>>>> Stashed changes
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation */}
        <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete contact?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Detail / Edit Sheet */}
        <Sheet
          open={!!selectedContact}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedContact(null)
              setIsEditing(false)
            }
          }}
        >
          <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
            {selectedContact && (
              <>
                <SheetHeader className="mb-6">
                  <SheetTitle>
                    {isEditing ? "Edit Contact" : "Contact Details"}
                  </SheetTitle>
                  <SheetDescription>
                    {isEditing ? "Update contact information" : "View and manage contact"}
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-6">
                  {isEditing ? (
                    // ── EDIT FORM ───────────────────────────────────────────────
                    <div className="space-y-5 p-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">First Name</label>
                          <Input
                            value={formData.first_name || ""}
                            onChange={(e) =>
                              setFormData({ ...formData, first_name: e.target.value })
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Last Name</label>
                          <Input
                            value={formData.last_name || ""}
                            onChange={(e) =>
                              setFormData({ ...formData, last_name: e.target.value })
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input
                          type="email"
                          value={formData.email || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Phone</label>
                        <Input
                          value={formData.phone || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Company</label>
                        <Input
                          value={formData.company || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, company: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Status</label>
                        <Select
                          value={formData.status}
                          onValueChange={(v) =>
                            setFormData({ ...formData, status: v as "active" | "archived" })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ) : (
                    // ── VIEW MODE ───────────────────────────────────────────────
                    <div className="space-y-5 p-5">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedContact.email || "—"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedContact.phone || "—"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedContact.company || "—"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            Created: {new Date(selectedContact.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-1.5">Status</p>
                        <Badge
                          variant={selectedContact.status === "active" ? "default" : "secondary"}
                        >
                          {selectedContact.status}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-1.5">Source</p>
                        <Badge variant="outline">
                          {selectedContact.contact_source} • {selectedContact.contact_type}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>

                <SheetFooter className="mt-8 flex justify-end gap-3 sm:justify-end">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={handleUpdate}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" onClick={() => setSelectedContact(null)}>
                        Close
                      </Button>
                      <Button onClick={() => setIsEditing(true)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </>
                  )}
                </SheetFooter>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </DashboardLayout>
  )
}