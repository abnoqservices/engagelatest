"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Users,
  UserPlus,
} from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { useToast } from "@/components/ui/use-toast";

type Department = {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  users?: Array<{ id: number; name: string; email: string }>;
  user_count?: number;
};

type User = {
  id: number;
  name: string;
  email: string;
  role?: string;
};

export default function DepartmentsPage() {
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = React.useState(false);
  const [isUsersDialogOpen, setIsUsersDialogOpen] = React.useState(false);
  const [editingDepartment, setEditingDepartment] = React.useState<Department | null>(null);
  const [selectedDepartment, setSelectedDepartment] = React.useState<Department | null>(null);
  const [allUsers, setAllUsers] = React.useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = React.useState<number[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isInviting, setIsInviting] = React.useState(false);

  const { toast } = useToast();

  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    is_active: true,
  });

  // Fetch Departments
  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await axiosClient.get("/departments", { params });

      if (res.data.success) {
        const departmentData: Department[] = (res.data.data || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          is_active: item.is_active ?? true,
          users: item.users || [],
          user_count: item.users?.length || 0,
        }));
        setDepartments(departmentData);
      }
    } catch (e: any) {
      console.error("Failed to fetch departments", e);
      toast({
        title: "Error",
        description: e.response?.data?.message || "Failed to load departments",
        variant: "destructive",
      });
      setDepartments([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all users for invitation
  const fetchAllUsers = async () => {
    try {
      // We'll need to get users from the organization
      // For now, we'll use the auth/me endpoint and potentially add a users endpoint
      const res = await axiosClient.get("/auth/me");
      // This is a placeholder - you may need to create a users endpoint
      // For now, we'll show a message that users need to be fetched differently
    } catch (e: any) {
      console.error("Failed to fetch users", e);
    }
  };

  React.useEffect(() => {
    fetchDepartments();
  }, [searchQuery]);

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Department name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const res = await axiosClient.post("/departments", formData);
      if (res.data.success) {
        toast({
          title: "Success",
          description: "Department created successfully",
        });
        setIsCreateDialogOpen(false);
        setFormData({ name: "", description: "", is_active: true });
        fetchDepartments();
      }
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.response?.data?.message || "Failed to create department",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!editingDepartment || !formData.name.trim()) {
      toast({
        title: "Error",
        description: "Department name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const res = await axiosClient.put(`/departments/${editingDepartment.id}`, formData);
      if (res.data.success) {
        toast({
          title: "Success",
          description: "Department updated successfully",
        });
        setIsEditDialogOpen(false);
        setEditingDepartment(null);
        setFormData({ name: "", description: "", is_active: true });
        fetchDepartments();
      }
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.response?.data?.message || "Failed to update department",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (department: Department) => {
    if (!confirm(`Are you sure you want to delete "${department.name}"?`)) {
      return;
    }

    try {
      const res = await axiosClient.delete(`/departments/${department.id}`);
      if (res.data.success) {
        toast({
          title: "Success",
          description: "Department deleted successfully",
        });
        fetchDepartments();
      }
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.response?.data?.message || "Failed to delete department",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (department: Department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      description: department.description || "",
      is_active: department.is_active,
    });
    setIsEditDialogOpen(true);
  };

  const openInviteDialog = async (department: Department) => {
    setSelectedDepartment(department);
    setSelectedUserIds([]);
    // Fetch users - you may need to create an endpoint to get all users in the organization
    // For now, we'll show a placeholder
    setIsInviteDialogOpen(true);
  };

  const openUsersDialog = async (department: Department) => {
    setSelectedDepartment(department);
    try {
      const res = await axiosClient.get(`/departments/${department.id}/users`);
      if (res.data.success) {
        setAllUsers(res.data.data || []);
      }
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.response?.data?.message || "Failed to load users",
        variant: "destructive",
      });
    }
    setIsUsersDialogOpen(true);
  };

  const handleInviteUsers = async () => {
    if (!selectedDepartment || selectedUserIds.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one user",
        variant: "destructive",
      });
      return;
    }

    setIsInviting(true);
    try {
      const res = await axiosClient.post(`/departments/${selectedDepartment.id}/invite-users`, {
        user_ids: selectedUserIds,
      });
      if (res.data.success) {
        toast({
          title: "Success",
          description: "Users invited successfully",
        });
        setIsInviteDialogOpen(false);
        setSelectedUserIds([]);
        fetchDepartments();
      }
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.response?.data?.message || "Failed to invite users",
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveUser = async (userId: number) => {
    if (!selectedDepartment) return;

    try {
      const res = await axiosClient.post(`/departments/${selectedDepartment.id}/remove-users`, {
        user_ids: [userId],
      });
      if (res.data.success) {
        toast({
          title: "Success",
          description: "User removed successfully",
        });
        openUsersDialog(selectedDepartment);
        fetchDepartments();
      }
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.response?.data?.message || "Failed to remove user",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Departments</h1>
            <p className="text-muted-foreground">
              Manage departments and invite users to collaborate
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Department
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No departments found
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">{department.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {department.description || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        <Users className="mr-1 h-3 w-3" />
                        {department.user_count || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={department.is_active ? "default" : "secondary"}>
                        {department.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openUsersDialog(department)}>
                            <Users className="mr-2 h-4 w-4" />
                            View Users
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openInviteDialog(department)}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Invite Users
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openEditDialog(department)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(department)}
                            className="text-destructive"
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
        </div>

        {/* Create Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Department</DialogTitle>
              <DialogDescription>
                Create a new department to organize your team
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Department name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Department description"
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Active</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={isSaving}>
                  {isSaving ? "Creating..." : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Department</DialogTitle>
              <DialogDescription>Update department information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Department name"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Department description"
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="edit-is_active">Active</Label>
                <Switch
                  id="edit-is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEdit} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Invite Users Dialog */}
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Users to Department</DialogTitle>
              <DialogDescription>
                Select users to invite to {selectedDepartment?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Note: You'll need to implement a users endpoint to fetch all users in your
                organization. For now, you can manually enter user IDs.
              </div>
              <div>
                <Label>User IDs (comma-separated)</Label>
                <Input
                  placeholder="1, 2, 3"
                  onChange={(e) => {
                    const ids = e.target.value
                      .split(",")
                      .map((id) => parseInt(id.trim()))
                      .filter((id) => !isNaN(id));
                    setSelectedUserIds(ids);
                  }}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInviteUsers} disabled={isInviting}>
                  {isInviting ? "Inviting..." : "Invite"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Users Dialog */}
        <Dialog open={isUsersDialogOpen} onOpenChange={setIsUsersDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Department Users</DialogTitle>
              <DialogDescription>
                Users in {selectedDepartment?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {allUsers.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No users in this department
                </div>
              ) : (
                <div className="space-y-2">
                  {allUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveUser(user.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsUsersDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
