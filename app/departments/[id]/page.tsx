"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Users,
  Shield,
  Edit,
  Trash2,
  UserPlus,
  ArrowLeft,
  Settings,
  Mail,
} from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

interface DepartmentUser {
  id: number;
  name: string;
  email: string;
  role: string;
  department_role?: {
    id: number;
    name: string;
    slug: string;
    type: string;
  };
}

interface Role {
  id: number;
  name: string;
  slug: string;
  description: string;
  type: "system" | "custom";
  is_active: boolean;
  permissions?: Permission[];
}

interface Permission {
  id: number;
  name: string;
  slug: string;
  resource: string;
  action: string;
}

export default function DepartmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const departmentId = params.id as string;

  const [department, setDepartment] = React.useState<any>(null);
  const [users, setUsers] = React.useState<DepartmentUser[]>([]);
  const [roles, setRoles] = React.useState<{ system_roles: Role[]; custom_roles: Role[] }>({
    system_roles: [],
    custom_roles: [],
  });
  const [permissions, setPermissions] = React.useState<Record<string, Permission[]>>({});
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("users");

  // Dialog states
  const [inviteDialogOpen, setInviteDialogOpen] = React.useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = React.useState(false);
  const [editingRole, setEditingRole] = React.useState<Role | null>(null);

  // Form states
  const [inviteForm, setInviteForm] = React.useState({
    invitations: [{ email: "", role_id: null as string | null }] as Array<{ email: string; role_id: string | null }>,
  });
  const [pendingInvitations, setPendingInvitations] = React.useState<any[]>([]);
  const [roleForm, setRoleForm] = React.useState({
    name: "",
    description: "",
    permission_ids: [] as number[],
  });

  React.useEffect(() => {
    if (departmentId) {
      loadAllData();
    }
  }, [departmentId]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadDepartment(),
        loadUsers(),
        loadRoles(),
        loadPermissions(),
        loadPendingInvitations(),
      ]);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingInvitations = async () => {
    try {
      const res = await axiosClient.get(`/departments/${departmentId}/pending-invitations`);
      if (res.data.success) {
        setPendingInvitations(res.data.data);
      }
    } catch (err: any) {
      console.error("Failed to load pending invitations:", err);
    }
  };

  const loadDepartment = async () => {
    try {
      const res = await axiosClient.get(`/departments/${departmentId}`);
      if (res.data.success) {
        setDepartment(res.data.data);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to load department",
        variant: "destructive",
      });
      throw err;
    }
  };

  const loadUsers = async () => {
    try {
      const res = await axiosClient.get(`/departments/${departmentId}/users`);
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to load users",
        variant: "destructive",
      });
      throw err;
    }
  };

  const loadRoles = async () => {
    try {
      const res = await axiosClient.get(`/departments/${departmentId}/roles`);
      if (res.data.success) {
        setRoles(res.data.data);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to load roles",
        variant: "destructive",
      });
      throw err;
    }
  };

  const loadPermissions = async () => {
    try {
      const res = await axiosClient.get("/permissions");
      if (res.data.success) {
        setPermissions(res.data.data);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to load permissions",
        variant: "destructive",
      });
      throw err;
    }
  };

  const handleInviteUsers = async () => {
    try {
      // Filter out empty invitations
      const validInvitations = inviteForm.invitations.filter(inv => inv.email.trim() !== "");
      
      if (validInvitations.length === 0) {
        toast({
          title: "Error",
          description: "Please enter at least one email address",
          variant: "destructive",
        });
        return;
      }

      // Validate all emails
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      for (const inv of validInvitations) {
        if (!emailRegex.test(inv.email.trim())) {
          toast({
            title: "Error",
            description: `Invalid email: ${inv.email}`,
            variant: "destructive",
          });
          return;
        }
      }

      const res = await axiosClient.post(`/departments/${departmentId}/invite-users`, {
        invitations: validInvitations.map(inv => ({
          email: inv.email.trim(),
          role_id: inv.role_id || null,
        })),
      });

      if (res.data.success) {
        if (res.data.data.errors && res.data.data.errors.length > 0) {
          toast({
            title: "Partial Success",
            description: `Some invitations failed: ${res.data.data.errors.join(", ")}`,
            variant: "default",
          });
        } else {
          toast({
            title: "Success",
            description: "Invitations sent successfully",
          });
        }
        setInviteDialogOpen(false);
        setInviteForm({ invitations: [{ email: "", role_id: null }] });
        await Promise.all([loadUsers(), loadPendingInvitations()]);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to invite users",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUserRole = async (userId: number, roleId: string | null) => {
    try {
      const res = await axiosClient.put(
        `/departments/${departmentId}/users/${userId}/role`,
        { role_id: roleId ? parseInt(roleId) : null }
      );

      if (res.data.success) {
        toast({
          title: "Success",
          description: "User role updated successfully",
        });
        await loadUsers();
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const handleSaveRole = async () => {
    try {
      if (editingRole) {
        // Update existing role
        const res = await axiosClient.put(
          `/departments/${departmentId}/roles/${editingRole.id}`,
          roleForm
        );
        if (res.data.success) {
          toast({
            title: "Success",
            description: "Role updated successfully",
          });
          setRoleDialogOpen(false);
          setEditingRole(null);
          setRoleForm({ name: "", description: "", permission_ids: [] });
          await loadRoles();
        }
      } else {
        // Create new role
        const res = await axiosClient.post(`/departments/${departmentId}/roles`, roleForm);
        if (res.data.success) {
          toast({
            title: "Success",
            description: "Role created successfully",
          });
          setRoleDialogOpen(false);
          setRoleForm({ name: "", description: "", permission_ids: [] });
          await loadRoles();
        }
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to save role",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRole = async (roleId: number) => {
    if (!confirm("Are you sure you want to delete this role?")) return;

    try {
      const res = await axiosClient.delete(`/departments/${departmentId}/roles/${roleId}`);
      if (res.data.success) {
        toast({
          title: "Success",
          description: "Role deleted successfully",
        });
        await loadRoles();
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to delete role",
        variant: "destructive",
      });
    }
  };

  const openEditRole = (role: Role) => {
    setEditingRole(role);
    setRoleForm({
      name: role.name,
      description: role.description || "",
      permission_ids: role.permissions?.map((p) => p.id) || [],
    });
    setRoleDialogOpen(true);
  };

  const allRoles = [...roles.system_roles, ...roles.custom_roles];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!department) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/departments">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Department Not Found</h1>
              <p className="text-muted-foreground mt-1">
                The department you're looking for doesn't exist or you don't have access to it.
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/departments">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{department.name}</h1>
              <p className="text-muted-foreground mt-1">{department.description || "No description"}</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="roles">
              <Shield className="h-4 w-4 mr-2" />
              Roles & Permissions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Department Members</CardTitle>
                    <CardDescription>Manage users and their roles in this department</CardDescription>
                  </div>
                  <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite Users
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Invite Users to Department</DialogTitle>
                        <DialogDescription>
                          Enter email addresses and assign roles. Invitation links will be sent via email.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        {inviteForm.invitations.map((inv, index) => (
                          <div key={index} className="flex gap-2 items-end">
                            <div className="flex-1 space-y-2">
                              <Label>Email</Label>
                              <Input
                                type="email"
                                placeholder="user@example.com"
                                value={inv.email}
                                onChange={(e) => {
                                  const newInvitations = [...inviteForm.invitations];
                                  newInvitations[index].email = e.target.value;
                                  setInviteForm({ ...inviteForm, invitations: newInvitations });
                                }}
                              />
                            </div>
                            <div className="w-48 space-y-2">
                              <Label>Role (Optional)</Label>
                              <Select
                                value={inv.role_id || "none"}
                                onValueChange={(value) => {
                                  const newInvitations = [...inviteForm.invitations];
                                  newInvitations[index].role_id = value === "none" ? null : value;
                                  setInviteForm({ ...inviteForm, invitations: newInvitations });
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">No Role</SelectItem>
                                  {allRoles.map((role) => (
                                    <SelectItem key={role.id} value={role.id.toString()}>
                                      {role.name} {role.type === "system" && "(System)"}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            {inviteForm.invitations.length > 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const newInvitations = inviteForm.invitations.filter((_, i) => i !== index);
                                  setInviteForm({ ...inviteForm, invitations: newInvitations });
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => {
                            setInviteForm({
                              ...inviteForm,
                              invitations: [...inviteForm.invitations, { email: "", role_id: null }],
                            });
                          }}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Another Email
                        </Button>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => {
                          setInviteDialogOpen(false);
                          setInviteForm({ invitations: [{ email: "", role_id: null }] });
                        }}>
                          Cancel
                        </Button>
                        <Button onClick={handleInviteUsers}>Send Invitations</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {pendingInvitations.length > 0 && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Pending Invitations ({pendingInvitations.length})
                    </h3>
                    <div className="space-y-2">
                      {pendingInvitations.map((invitation) => (
                        <div key={invitation.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{invitation.email}</span>
                            {invitation.role && (
                              <Badge variant="secondary">{invitation.role.name}</Badge>
                            )}
                            <span className="text-muted-foreground text-xs">
                              Expires {new Date(invitation.expires_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Select
                            value={user.department_role?.id.toString() || "none"}
                            onValueChange={(value) =>
                              handleUpdateUserRole(user.id, value === "none" ? null : value)
                            }
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="No role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No Role</SelectItem>
                              {allRoles.map((role) => (
                                <SelectItem key={role.id} value={role.id.toString()}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              // TODO: Implement remove user
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Roles & Permissions</CardTitle>
                    <CardDescription>
                      Manage roles and their permissions for this department
                    </CardDescription>
                  </div>
                  <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => {
                        setEditingRole(null);
                        setRoleForm({ name: "", description: "", permission_ids: [] });
                      }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Custom Role
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {editingRole ? "Edit Role" : "Create Custom Role"}
                        </DialogTitle>
                        <DialogDescription>
                          Define a custom role with specific permissions
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Role Name</Label>
                          <Input
                            value={roleForm.name}
                            onChange={(e) =>
                              setRoleForm({ ...roleForm, name: e.target.value })
                            }
                            placeholder="e.g., Content Manager"
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={roleForm.description}
                            onChange={(e) =>
                              setRoleForm({ ...roleForm, description: e.target.value })
                            }
                            placeholder="Describe what this role can do..."
                          />
                        </div>
                        <div>
                          <Label>Permissions</Label>
                          <div className="space-y-4 mt-2 max-h-96 overflow-y-auto border rounded-md p-4">
                            {Object.entries(permissions).map(([resource, perms]) => (
                              <div key={resource} className="space-y-2">
                                <h4 className="font-medium capitalize">{resource}</h4>
                                <div className="grid grid-cols-2 gap-2 ml-4">
                                  {perms.map((perm) => (
                                    <div key={perm.id} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`perm-${perm.id}`}
                                        checked={roleForm.permission_ids.includes(perm.id)}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            setRoleForm({
                                              ...roleForm,
                                              permission_ids: [...roleForm.permission_ids, perm.id],
                                            });
                                          } else {
                                            setRoleForm({
                                              ...roleForm,
                                              permission_ids: roleForm.permission_ids.filter(
                                                (id) => id !== perm.id
                                              ),
                                            });
                                          }
                                        }}
                                      />
                                      <Label
                                        htmlFor={`perm-${perm.id}`}
                                        className="text-sm font-normal cursor-pointer"
                                      >
                                        {perm.action}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setRoleDialogOpen(false);
                            setEditingRole(null);
                            setRoleForm({ name: "", description: "", permission_ids: [] });
                          }}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleSaveRole}>Save Role</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">System Roles</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {roles.system_roles.map((role) => (
                        <Card key={role.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">{role.name}</CardTitle>
                              <Badge variant="secondary">System</Badge>
                            </div>
                            <CardDescription className="text-sm">
                              {role.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-sm text-muted-foreground">
                              {role.permissions?.length || 0} permissions
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Custom Roles</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {roles.custom_roles.map((role) => (
                        <Card key={role.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">{role.name}</CardTitle>
                              <Badge>Custom</Badge>
                            </div>
                            <CardDescription className="text-sm">
                              {role.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-muted-foreground">
                                {role.permissions?.length || 0} permissions
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditRole(role)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteRole(role.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
