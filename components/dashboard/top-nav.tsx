"use client"

import * as React from "react"
import { Bell, Search, Moon, Sun, ChevronDown, User, Settings, LogOut, Mail, Phone, Calendar, Shield, Edit2, X, Check, Upload, Building2, Loader2, Building } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axiosClient from "@/lib/axiosClient"
import { showToast } from "@/lib/showToast"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface TopNavProps {
  onMenuClick: () => void
}

interface Department {
  id: number;
  name: string;
  description?: string;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const [theme, setTheme] = React.useState<"light" | "dark">("light")
  const [userdetail, setUserdetail] = React.useState<any>({})
  const [selectedDepartmentName, setSelectedDepartmentName] = React.useState<string | null>(null)
  const [selectedDepartmentId, setSelectedDepartmentId] = React.useState<number | null>(null)
  const [availableDepartments, setAvailableDepartments] = React.useState<Department[]>([])
  const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] = React.useState(false)
  const [isSwitchingDepartment, setIsSwitchingDepartment] = React.useState(false)
  const [switchingToDepartmentId, setSwitchingToDepartmentId] = React.useState<number | null>(null)
  const [isProfileOpen, setIsProfileOpen] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)
  const [editedName, setEditedName] = React.useState("")
  const [editedAvatar, setEditedAvatar] = React.useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const router = useRouter()

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  const getInitials = (name: string) => {
    if (!name) return "U"
    const parts = name.trim().split(" ")
    return parts.length >= 2 ? parts[0][0] + parts[1][0] : parts[0][0]
  }

  const handleLogout = async () => {
    try {
      // Try to call logout endpoint (even if it fails, we still want to log out locally)
      await axiosClient.post("/auth/logout").catch(() => {
        // silently ignore server logout failure
      });
  
      // Clear both storages completely
      localStorage.clear();
      sessionStorage.clear();
  
      // Very important: Remove Authorization header from axios
      // Prevents old token from being sent in future requests
      delete axiosClient.defaults.headers.common["Authorization"];
  
      showToast("Logged out successfully", "success");
  
      // Use replace instead of push → prevents going back to protected page
      router.replace("/signin");
      
      // Optional: force hard refresh (helps in some stubborn cases)
      // setTimeout(() => window.location.href = "/signin", 100);
    } catch (error) {
      console.error("Logout error:", error);
  
      // Even when something fails → still clean everything
      localStorage.clear();
      sessionStorage.clear();
      delete axiosClient.defaults.headers.common["Authorization"];
  
      showToast("Logged out (with some issues)", "warning");
      router.replace("/signin");
    }
  };

  const fetchAvailableDepartments = async () => {
    try {
      // Try to get departments from /auth/me first
      const res = await axiosClient.get("/auth/me")
      if (res.data?.data?.departments && Array.isArray(res.data.data.departments)) {
        setAvailableDepartments(res.data.data.departments)
        return
      }
      
      // Fallback: try to get from departments endpoint
      const deptRes = await axiosClient.get("/departments")
      if (deptRes.data?.success && deptRes.data?.data) {
        setAvailableDepartments(deptRes.data.data)
      }
    } catch (error: any) {
      console.error("Failed to fetch departments:", error)
      // Try to get from localStorage as last resort
      const loginData = localStorage.getItem("loginData")
      if (loginData) {
        try {
          const data = JSON.parse(loginData)
          if (data.departments && Array.isArray(data.departments)) {
            setAvailableDepartments(data.departments)
          }
        } catch (e) {
          console.error("Error parsing login data:", e)
        }
      }
    }
  }

  const handleSwitchDepartment = async (departmentId: number) => {
    if (isSwitchingDepartment || departmentId === selectedDepartmentId) {
      setIsDepartmentDropdownOpen(false)
      return
    }

    setIsSwitchingDepartment(true)
    setSwitchingToDepartmentId(departmentId)
    try {
      const response = await axiosClient.post("/auth/select-department", {
        department_id: departmentId,
      })

      if (response.data.success) {
        // Update token
        const newToken = response.data.data.access_token
        localStorage.setItem("token", newToken)
        
        // Update department info
        const dept = availableDepartments.find(d => d.id === departmentId)
        if (dept) {
          localStorage.setItem("selectedDepartmentId", departmentId.toString())
          localStorage.setItem("selectedDepartmentName", dept.name)
          setSelectedDepartmentId(departmentId)
          setSelectedDepartmentName(dept.name)
        }
        
        showToast("Department switched successfully", "success")
        setIsDepartmentDropdownOpen(false)
        
        // Reload the page to refresh all data with new department context
        window.location.reload()
      }
    } catch (error: any) {
      console.error("Failed to switch department:", error)
      showToast(
        error.response?.data?.message || "Failed to switch department",
        "error"
      )
      setSwitchingToDepartmentId(null)
    } finally {
      setIsSwitchingDepartment(false)
    }
  }

  const getUser = async () => {
    try {
      const res = await axiosClient.get("/auth/me")
      if (res.data?.data) {
        setUserdetail(res.data.data)
        // Get department name from response or localStorage
        if (res.data.data.department?.name) {
          setSelectedDepartmentName(res.data.data.department.name)
          localStorage.setItem("selectedDepartmentName", res.data.data.department.name)
        } else {
          // Fallback to localStorage
          const deptName = localStorage.getItem("selectedDepartmentName")
          if (deptName) {
            setSelectedDepartmentName(deptName)
          }
        }
        
        // Get selected department ID
        const deptId = localStorage.getItem("selectedDepartmentId")
        if (deptId) {
          setSelectedDepartmentId(parseInt(deptId))
        }
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.clear()
        router.replace("/signin")
      }
    }
  }

  React.useEffect(() => {
    document.documentElement.classList.remove("dark")
    getUser()
    fetchAvailableDepartments()
    // Also check localStorage for department name
    const deptName = localStorage.getItem("selectedDepartmentName")
    if (deptName) {
      setSelectedDepartmentName(deptName)
    }
    const deptId = localStorage.getItem("selectedDepartmentId")
    if (deptId) {
      setSelectedDepartmentId(parseInt(deptId))
    }
  }, [])

  // Start editing
  const startEditing = () => {
    setEditedName(userdetail?.name || "")
    setEditedAvatar(null)
    setAvatarPreview(null)
    setIsEditing(true)
  }

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false)
    setEditedAvatar(null)
    setAvatarPreview(null)
  }

  // Handle avatar change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setEditedAvatar(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Save profile
  const saveProfile = async () => {
    if (!editedName.trim()) {
      showToast("Name is required", "error")
      return
    }

    try {
      const formData = new FormData()
      formData.append("name", editedName)
      if (editedAvatar) {
        formData.append("avatar", editedAvatar)
      }

      const res = await axiosClient.put("/auth/me", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      if (res.data?.data) {
        setUserdetail(res.data.data)
        showToast("Profile updated successfully!", "success")
        setIsEditing(false)
        setEditedAvatar(null)
        setAvatarPreview(null)
      }
    } catch (error: any) {
      console.error("Update failed:", error)
      showToast(
        error.response?.data?.message || "Failed to update profile",
        "error"
      )
    }
  }

  const currentAvatar = avatarPreview || userdetail?.avatar

  return (
    <>
      {/* Your existing header code remains the same until the Sheet */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white dark:bg-gray-950 px-6 justify-between">
        {/* ... Search bar and other buttons ... */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search or type command..."
              className="pl-10 pr-20 bg-gray-50 border-gray-200 focus:bg-white h-10 shadow-none"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded">
              Cmd K
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {selectedDepartmentName && availableDepartments.length > 0 && (
            <DropdownMenu open={isDepartmentDropdownOpen} onOpenChange={setIsDepartmentDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                  disabled={isSwitchingDepartment}
                >
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm font-medium">{selectedDepartmentName}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Switch Department</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {availableDepartments.map((dept) => (
                  <DropdownMenuItem
                    key={dept.id}
                    onClick={() => handleSwitchDepartment(dept.id)}
                    disabled={isSwitchingDepartment || dept.id === selectedDepartmentId}
                    className={dept.id === selectedDepartmentId ? "bg-blue-50" : ""}
                  >
                    <Building2 className="mr-2 h-4 w-4" />
                    <div className="flex-1">
                      <div className="font-medium">{dept.name}</div>
                      {dept.description && (
                        <div className="text-xs text-muted-foreground">{dept.description}</div>
                      )}
                    </div>
                    {dept.id === selectedDepartmentId && (
                      <Check className="ml-2 h-4 w-4 text-blue-600" />
                    )}
                    {switchingToDepartmentId === dept.id && (
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {selectedDepartmentName && availableDepartments.length === 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
              <Building2 className="h-4 w-4" />
              <span className="text-sm font-medium">{selectedDepartmentName}</span>
            </div>
          )}
<TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/scan")}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/10460/10460903.png"
              alt="Scan visiting card"
              className="h-16 w-16 object-contain"
            />
          </Button>
        </TooltipTrigger>

        <TooltipContent side="bottom">
          <span>Scan Visiting Card</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <p className="p-4 text-center text-sm text-gray-500">No new notifications</p>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 gap-2 px-3 rounded-full hover:bg-gray-100">
                <Avatar className="h-9 w-9 border">
                  <AvatarImage src={currentAvatar} />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {getInitials(userdetail?.name || "")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden md:inline">{userdetail?.name || "User"}</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
                <User className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/departments" className="flex items-center">
                  <Building className="mr-2 h-4 w-4" />Create department
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      
      {/* Sliding Profile Sheet with Inline Editor */}
      <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <SheetContent side="right" className="w-96 overflow-y-auto">
          <SheetHeader className="px-6 pt-6">
            <div className="flex items-center justify-between">
              <SheetTitle>{isEditing ? "Edit Profile" : "Profile Details"}</SheetTitle>
              {!isEditing ? (
                <Button size="sm" onClick={startEditing} variant="ghost">
                  <Edit2 className="h-4 w-4 mr-1" /> Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={cancelEditing}>
                    <X className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={saveProfile}>
                    <Check className="h-4 w-4 mr-1" /> Save
                  </Button>
                </div>
              )}
            </div>
            <SheetDescription>
              {isEditing ? "Update your profile information" : "Your account information"}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-8 px-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <Avatar className="h-28 w-28 border-4 border-white shadow-xl">
                  <AvatarImage src={avatarPreview || currentAvatar} />
                  <AvatarFallback className="text-3xl bg-blue-600 text-white">
                    {getInitials(editedName || userdetail?.name || "")}
                  </AvatarFallback>
                </Avatar>

                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Upload className="h-6 w-6 text-white" />
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            {/* Name Field */}
            <div className="mt-6 w-full">
              {isEditing ? (
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="mt-2"
                    placeholder="Enter your name"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="text-2xl font-bold">{userdetail?.name || "—"}</h3>
                  <p className="text-sm text-gray-500 mt-1">{userdetail?.role || "User"}</p>
                </div>
              )}
            </div>
          </div>

          {/* Other Details (Read-only) */}
          <div className="mt-10 px-6 space-y-6">
            <div className="flex items-center gap-4">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{userdetail?.email || "—"}</p>
              </div>
            </div>

            {userdetail?.phone && (
              <div className="flex items-center gap-4">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{userdetail.phone}</p>
                </div>
              </div>
            )}

            {userdetail?.department && (
              <div className="flex items-center gap-4">
                <Shield className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{userdetail.department}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium">
                  {userdetail?.createdAt
                    ? new Date(userdetail.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons (only in edit mode) */}
          {isEditing && (
            <div className="mt-10 px-6 flex gap-3 pb-6">
              <Button variant="outline" className="flex-1" onClick={cancelEditing}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={saveProfile}>
                Update Profile
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}