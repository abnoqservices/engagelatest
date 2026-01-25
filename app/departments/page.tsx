"use client";

import * as React from "react";
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
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Shield, Edit, Trash2, UserPlus, ArrowUpRight } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Department {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  users?: Array<{
    id: number;
    name: string;
    email: string;
    department_role?: {
      id: number;
      name: string;
      slug: string;
    };
  }>;
}

export default function DepartmentsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = React.useState(false);
  const [planLimitInfo, setPlanLimitInfo] = React.useState<{
    current: number;
    limit: number;
    remaining: number;
  } | null>(null);
  const [createForm, setCreateForm] = React.useState({
    name: "",
    description: "",
  });
  const [creating, setCreating] = React.useState(false);

  React.useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/departments");
      if (res.data.success) {
        setDepartments(res.data.data);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to load departments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDepartment = async () => {
    if (!createForm.name.trim()) {
      toast({
        title: "Error",
        description: "Department name is required",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      const res = await axiosClient.post("/departments", {
        name: createForm.name.trim(),
        description: createForm.description.trim() || null,
        is_active: true,
      });

      if (res.data.success) {
        toast({
          title: "Success",
          description: "Department created successfully",
        });
        setCreateDialogOpen(false);
        setCreateForm({ name: "", description: "" });
        await loadDepartments();
      }
    } catch (err: any) {
      // Check if it's a plan limit error
      if (
        err.response?.data?.usage &&
        err.response?.data?.usage.allowed === false &&
        err.response?.data?.message?.includes("Department limit reached")
      ) {
        // Show upgrade dialog
        setPlanLimitInfo({
          current: err.response.data.usage.current,
          limit: err.response.data.usage.limit,
          remaining: err.response.data.usage.remaining,
        });
        setCreateDialogOpen(false);
        setUpgradeDialogOpen(true);
      } else {
        toast({
          title: "Error",
          description: err.response?.data?.message || "Failed to create department",
          variant: "destructive",
        });
      }
    } finally {
      setCreating(false);
    }
  };

  const handleUpgrade = () => {
    setUpgradeDialogOpen(false);
    router.push("/plans");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading departments...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Departments</h1>
            <p className="text-muted-foreground mt-1">
              Manage departments, users, and roles
            </p>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Department</DialogTitle>
                <DialogDescription>
                  Create a new department for your organization
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Sales"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Sales department"
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateDepartment} disabled={creating}>
                  {creating ? "Creating..." : "Create Department"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Upgrade Dialog */}
        <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Upgrade Required</DialogTitle>
              <DialogDescription className="text-base">
                You've reached your department limit
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Current Usage:</span>
                    <span className="font-semibold">
                      {planLimitInfo?.current || 0} / {planLimitInfo?.limit || 0} departments
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Remaining:</span>
                    <span className="font-semibold text-amber-600">
                      {planLimitInfo?.remaining || 0} departments
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                To create more departments, please upgrade your plan to access higher limits.
              </p>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setUpgradeDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button onClick={handleUpgrade} className="w-full sm:w-auto">
                Upgrade Plan
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => (
            <Card key={dept.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{dept.name}</CardTitle>
                  <Badge variant={dept.is_active ? "default" : "secondary"}>
                    {dept.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <CardDescription>{dept.description || "No description"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {dept.users?.length || 0} members
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/departments/${dept.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        <Shield className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
