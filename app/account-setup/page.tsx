"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  CheckCircle2,
  Upload,
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Building2,
  Users,
  Tag,
  Check,
  Globe,
  Image as ImageIcon,
  Rocket,
  PartyPopper,
  Mail,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import axiosClient from "@/lib/axiosClient";
import { showToast } from "@/lib/showToast";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import SittingMascot from "@/public/mascot/mascot_sitting.png";

const steps = [
  {
    id: 1,
    title: "Your Workspace",
    description: "Create a unique identifier for your organization",
    icon: Globe,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "Your Team",
    description: "Set up your first department",
    icon: Users,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    title: "Invite Members",
    description: "Invite team members to your department",
    icon: Mail,
    color: "from-indigo-500 to-blue-500",
  },
  {
    id: 4,
    title: "Your Products",
    description: "Create your first product category",
    icon: Tag,
    color: "from-orange-500 to-red-500",
  },
];

export default function AccountSetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [checkingStatus, setCheckingStatus] = React.useState(true);
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const [organizationName, setOrganizationName] = React.useState("");
  const [isGoogleUser, setIsGoogleUser] = React.useState(false);
  const [slug, setSlug] = React.useState("");
  const [slugChecking, setSlugChecking] = React.useState(false);
  const [slugAvailable, setSlugAvailable] = React.useState<boolean | null>(null);
  const [slugDebounceTimer, setSlugDebounceTimer] = React.useState<NodeJS.Timeout | null>(null);

  const [departmentName, setDepartmentName] = React.useState("");
  const [departmentId, setDepartmentId] = React.useState<number | null>(null);
  const [industry, setIndustry] = React.useState("");
  const [logoFile, setLogoFile] = React.useState<File | null>(null);
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
  const [industries, setIndustries] = React.useState<Array<{ id: number; name: string }>>([]);
  const [loadingIndustries, setLoadingIndustries] = React.useState(false);
  
  const [invitations, setInvitations] = React.useState<Array<{ email: string; role_id: string | null }>>([{ email: "", role_id: null }]);
  const [roles, setRoles] = React.useState<Array<{ id: number; name: string; slug: string }>>([]);
  const [loadingRoles, setLoadingRoles] = React.useState(false);
  
  const [categoryName, setCategoryName] = React.useState("");
  const [categoryDescription, setCategoryDescription] = React.useState("");

  // Check setup status on mount
  React.useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await axiosClient.get("/account-setup/status");
        if (res.data.success) {
          const data = res.data.data;
          
          // Skip email verification check for Google users
          if (data.is_google_user) {
            setIsGoogleUser(true);
          } else if (data.email_verified === false) {
            // Redirect to verify-email page instead of showing error
            router.replace("/verify-email");
            return;
          }
          
          if (data.is_account_set_up) {
            router.replace("/dashboard");
            return;
          }

          if (data.organization) {
            setOrganizationName(data.organization.name || "");
            if (data.organization.slug) {
              setSlug(data.organization.slug);
              setCompletedSteps([1]);
            }
          }

          if (data.has_category) {
            setCurrentStep(4);
            setCompletedSteps([1, 2, 3, 4]);
          } else if (data.has_department) {
            setCurrentStep(3);
            setCompletedSteps([1, 2]);
          }
        }
      } catch (error: any) {
        console.error("Failed to check setup status:", error);
        if (error.response?.status === 403 && error.response?.data?.message?.includes("email")) {
          // Redirect to verify-email page instead of showing error
          router.replace("/verify-email");
          return;
        }
      } finally {
        setCheckingStatus(false);
      }
    };

    checkStatus();
  }, [router]);

  // Fetch industries on mount
  React.useEffect(() => {
    const fetchIndustries = async () => {
      setLoadingIndustries(true);
      try {
        const res = await axiosClient.get("/industries");
        if (res.data.success) {
          setIndustries(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch industries:", error);
      } finally {
        setLoadingIndustries(false);
      }
    };

    fetchIndustries();
  }, []);

  // Check slug availability
  const checkSlugAvailability = React.useCallback(async (slugToCheck: string) => {
    if (!slugToCheck || slugToCheck.length < 3) {
      setSlugAvailable(null);
      return;
    }

    setSlugChecking(true);
    try {
      const res = await axiosClient.post("/account-setup/check-slug", { slug: slugToCheck });
      if (res.data.success) {
        setSlugAvailable(res.data.data.available);
      }
    } catch (error: any) {
      console.error("Failed to check slug:", error);
      setSlugAvailable(false);
    } finally {
      setSlugChecking(false);
    }
  }, []);

  // Handle slug change with debounce
  const handleSlugChange = (value: string) => {
    const formattedSlug = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSlug(formattedSlug);
    setSlugAvailable(null);

    if (slugDebounceTimer) {
      clearTimeout(slugDebounceTimer);
    }

    const timer = setTimeout(() => {
      if (formattedSlug.length >= 3) {
        checkSlugAvailability(formattedSlug);
      }
    }, 500);

    setSlugDebounceTimer(timer);
  };

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast("Please select an image file", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Image size should be less than 5MB", "error");
      return;
    }

    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleStep1Next = async () => {
    if (isGoogleUser && !organizationName) {
      showToast("Please enter organization name", "error");
      return;
    }

    if (!slug || slug.length < 3) {
      showToast("Please enter a valid slug (at least 3 characters)", "error");
      return;
    }

    if (slugAvailable === false) {
      showToast("This slug is already taken. Please choose another one.", "error");
      return;
    }

    if (slugAvailable === null && !slugChecking) {
      await checkSlugAvailability(slug);
      return;
    }

    setLoading(true);
    try {
      const payload: any = { slug };
      if (isGoogleUser) {
        payload.name = organizationName;
      }
      await axiosClient.post("/account-setup/update-organization", payload);
      setCompletedSteps([...completedSteps, 1]);
      setCurrentStep(2);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to update organization", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Next = async () => {
    if (!departmentName) {
      showToast("Please enter department name", "error");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", departmentName);
      if (industry) {
        formData.append("industry", industry);
      }
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const deptRes = await axiosClient.post("/account-setup/create-department", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!deptRes.data.success) {
        throw new Error(deptRes.data.message || "Failed to create department");
      }

      // Store department ID for invitation step
      if (deptRes.data.data?.id) {
        setDepartmentId(deptRes.data.data.id);
        // Load roles for this department
        loadRoles(deptRes.data.data.id);
      }

      setCompletedSteps([...completedSteps, 2]);
      setCurrentStep(3);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.name?.[0] ||
                          error.message || 
                          "Failed to create department. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // Load roles for a department
  const loadRoles = async (deptId: number) => {
    setLoadingRoles(true);
    try {
      const res = await axiosClient.get(`/departments/${deptId}/roles`);
      if (res.data.success) {
        const allRoles = [
          ...(res.data.data.system_roles || []),
          ...(res.data.data.custom_roles || []),
        ];
        setRoles(allRoles);
      }
    } catch (error) {
      console.error("Failed to load roles:", error);
    } finally {
      setLoadingRoles(false);
    }
  };

  const handleStep3Next = async () => {
    if (!departmentId) {
      showToast("Department ID is missing", "error");
      return;
    }

    // Filter out empty invitations
    const validInvitations = invitations.filter(inv => inv.email.trim() !== "");
    
    if (validInvitations.length === 0) {
      // Skip invitation step if no invitations
      setCurrentStep(4);
      return;
    }

    // Validate all emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const inv of validInvitations) {
      if (!emailRegex.test(inv.email.trim())) {
        showToast(`Invalid email: ${inv.email}`, "error");
        return;
      }
    }

    setLoading(true);
    try {
      const res = await axiosClient.post("/account-setup/send-invitations", {
        department_id: departmentId,
        invitations: validInvitations.map(inv => ({
          email: inv.email.trim(),
          role_id: inv.role_id || null,
        })),
      });

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to send invitations");
      }

      if (res.data.data.errors && res.data.data.errors.length > 0) {
        showToast(`Some invitations failed: ${res.data.data.errors.join(", ")}`, "warning");
      } else {
        showToast("Invitations sent successfully!", "success");
      }

      setCompletedSteps([...completedSteps, 3]);
      setCurrentStep(4);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to send invitations", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStep4Next = async () => {
    if (!categoryName) {
      showToast("Please enter category name", "error");
      return;
    }

    setLoading(true);
    try {
      const categoryRes = await axiosClient.post("/account-setup/create-category", {
        name: categoryName,
        description: categoryDescription || null,
      });

      if (!categoryRes.data.success) {
        throw new Error(categoryRes.data.message || "Failed to create category");
      }

      const completeRes = await axiosClient.post("/account-setup/complete");
      
      if (!completeRes.data.success) {
        throw new Error(completeRes.data.message || "Failed to complete setup");
      }
      
      setCompletedSteps([...completedSteps, 4]);
      setShowSuccess(true);
      
      setTimeout(() => {
        router.push("/plans");
      }, 2500);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.name?.[0] ||
                          error.message || 
                          "Failed to create category. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Preparing your workspace...</p>
        </motion.div>
      </div>
    );
  }

  // Removed email verification error display - now redirects to verify-email page

  if (showSuccess) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg"
          >
            <PartyPopper className="h-12 w-12 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            You're All Set! 🎉
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-muted-foreground mb-6"
          >
            Your workspace is ready. Let's choose a plan and get started!
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Rocket className="h-8 w-8 text-blue-600 mx-auto animate-bounce" />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const currentStepData = steps[currentStep - 1];
  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <Image src={SittingMascot} alt="EngageIQ" width={80} height={80} className="rounded-full mx-auto" />
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to Pexifly
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Let's set up your workspace in just a few steps
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Vertical Steps */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border bg-white sticky top-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Setup Progress</CardTitle>
                <Progress value={progress} className="h-1 mt-2" />
              </CardHeader>
              <CardContent className="space-y-0">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = completedSteps.includes(step.id);
                  const isCurrent = currentStep === step.id;
                  const isPast = currentStep > step.id;

                  return (
                    <React.Fragment key={step.id}>
                      <div className="flex items-start gap-3">
                        {/* Step Circle */}
                        <div className="flex flex-col items-center pt-1">
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 shrink-0 ${
                              isCompleted
                                ? "bg-gradient-to-br from-green-400 to-emerald-500 border-green-500 text-white shadow-md"
                                : isCurrent
                                ? `bg-gradient-to-br ${step.color} border-blue-500 text-white shadow-md scale-110`
                                : "bg-white border-gray-200 text-gray-400"
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Icon className="h-4 w-4" />
                            )}
                            {isCurrent && (
                              <motion.div
                                className="absolute inset-0 rounded-full bg-blue-500 opacity-20"
                                animate={{ scale: [1, 1.15, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                              />
                            )}
                          </motion.div>
                          {index < steps.length - 1 && (
                            <div className="w-0.5 h-full min-h-[40px] bg-gray-200 rounded-full overflow-hidden mt-2">
                              <motion.div
                                className={`w-full rounded-full ${
                                  isPast || isCompleted
                                    ? "bg-gradient-to-b from-green-400 to-emerald-500"
                                    : "bg-gray-200"
                                }`}
                                initial={{ height: 0 }}
                                animate={{
                                  height: isPast || isCompleted ? "100%" : "0%",
                                }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Step Content */}
                        <div className="flex-1 pb-4">
                          <p className={`text-xs font-medium ${isCurrent ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-400"}`}>
                            {step.title}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Right: Form Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-lg border bg-white">
            <CardHeader className="text-center pb-4">
              <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${currentStepData.color} shadow-md`}>
                {React.createElement(currentStepData.icon, { className: "h-6 w-6 text-white" })}
              </div>
              <CardTitle className="text-xl font-semibold mb-1">{currentStepData.title}</CardTitle>
              <CardDescription className="text-sm">
                {currentStepData.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 px-6 pb-6">
              <AnimatePresence mode="wait">
                {/* Step 1: Organization Name & Slug */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    {isGoogleUser && (
                      <div className="space-y-1.5">
                        <Label htmlFor="organization_name" className="text-sm font-medium">
                          Organization Name <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <Input
                            id="organization_name"
                            placeholder="Acme Corporation"
                            value={organizationName}
                            onChange={(e) => setOrganizationName(e.target.value)}
                            className="pl-9 h-9 text-sm"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Enter your organization's name
                        </p>
                      </div>
                    )}
                    {!isGoogleUser && organizationName && (
                      <div className="space-y-1.5">
                        <Label htmlFor="organization_name" className="text-sm font-medium">
                          Organization Name
                        </Label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <Input
                            id="organization_name"
                            placeholder="Acme Corporation"
                            value={organizationName}
                            onChange={(e) => setOrganizationName(e.target.value)}
                            className="pl-9 h-9 text-sm"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          You can update your organization name
                        </p>
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <Label htmlFor="slug" className="text-sm font-medium">
                        Organization Slug <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <Globe className="h-4 w-4" />
                        </div>
                        <Input
                          id="slug"
                          placeholder="acme-corp"
                          value={slug}
                          onChange={(e) => handleSlugChange(e.target.value)}
                          className={`pl-9 h-9 text-sm ${
                            slugAvailable === false
                              ? "border-red-500 focus:border-red-500"
                              : slugAvailable === true
                              ? "border-green-500 focus:border-green-500"
                              : ""
                          }`}
                        />
                      </div>
                      <div className="flex items-center gap-2 text-xs min-h-[20px]">
                        {slugChecking && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2"
                          >
                            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                            <span className="text-muted-foreground">Checking availability...</span>
                          </motion.div>
                        )}
                        {!slugChecking && slugAvailable === true && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2"
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="text-green-600 font-medium">✓ Available!</span>
                          </motion.div>
                        )}
                        {!slugChecking && slugAvailable === false && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2"
                          >
                            <X className="h-4 w-4 text-red-600" />
                            <span className="text-red-600">This slug is already taken</span>
                          </motion.div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        This will be part of your organization's URL. Only lowercase letters, numbers, and hyphens are allowed.
                      </p>
                    </div>

                    <Button
                      onClick={handleStep1Next}
                      disabled={loading || slugChecking || !slug || slug.length < 3 || slugAvailable === false || (isGoogleUser && !organizationName)}
                      className="w-full h-9 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          Continue to Team Setup
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}

                {/* Step 2: Create Department */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-1.5">
                      <Label htmlFor="department_name" className="text-sm font-medium">
                        Department Name <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <Input
                          id="department_name"
                          placeholder="Sales, Marketing, Operations..."
                          value={departmentName}
                          onChange={(e) => setDepartmentName(e.target.value)}
                          className="pl-9 h-9 text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="industry" className="text-sm font-medium">
                        Industry <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                      </Label>
                      <Select value={industry || undefined} onValueChange={(value) => setIndustry(value || "")}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingIndustries ? (
                            <div className="px-2 py-1.5 text-xs text-muted-foreground flex items-center gap-2">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Loading industries...
                            </div>
                          ) : (
                            industries.map((ind) => (
                              <SelectItem key={ind.id} value={ind.name} className="text-sm">
                                {ind.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="logo" className="text-sm font-medium">
                        Department Logo <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                      </Label>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <label
                            htmlFor="logo"
                            className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex flex-col items-center justify-center pt-3 pb-3">
                              <ImageIcon className="h-6 w-6 text-gray-400 mb-1" />
                              <p className="mb-1 text-xs text-gray-500">
                                <span className="font-medium">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-[10px] text-gray-500">PNG, JPG, GIF up to 5MB</p>
                            </div>
                            <Input
                              id="logo"
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                        {logoPreview && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative"
                          >
                            <img
                              src={logoPreview}
                              alt="Logo preview"
                              className="h-24 w-24 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setLogoFile(null);
                                setLogoPreview(null);
                              }}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                        className="flex-1 h-9 text-sm"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        onClick={handleStep2Next}
                        disabled={loading || !departmentName}
                        className="flex-1 h-9 text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            Continue to Products
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Invite Members */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">
                          Invite Team Members <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setInvitations([...invitations, { email: "", role_id: null }])}
                          className="h-7 text-xs"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add More
                        </Button>
                      </div>
                      {invitations.map((inv, index) => (
                        <div key={index} className="flex gap-2 items-start">
                          <div className="flex-1 space-y-2">
                            <Input
                              placeholder="email@example.com"
                              value={inv.email}
                              onChange={(e) => {
                                const newInvitations = [...invitations];
                                newInvitations[index].email = e.target.value;
                                setInvitations(newInvitations);
                              }}
                              className="h-9 text-sm"
                              type="email"
                            />
                            <Select
                              value={inv.role_id || "none"}
                              onValueChange={(value) => {
                                const newInvitations = [...invitations];
                                newInvitations[index].role_id = value === "none" ? null : value;
                                setInvitations(newInvitations);
                              }}
                            >
                              <SelectTrigger className="h-9 text-sm">
                                <SelectValue placeholder="Select role (optional)" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">No Role</SelectItem>
                                {loadingRoles ? (
                                  <div className="px-2 py-1.5 text-xs text-muted-foreground flex items-center gap-2">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    Loading roles...
                                  </div>
                                ) : (
                                  roles.map((role) => (
                                    <SelectItem key={role.id} value={role.id.toString()}>
                                      {role.name}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                          {invitations.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newInvitations = invitations.filter((_, i) => i !== index);
                                setInvitations(newInvitations);
                              }}
                              className="h-9 w-9 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <p className="text-xs text-muted-foreground">
                        Invited members will receive an email with a link to join your organization and department.
                      </p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(2)}
                        className="flex-1 h-9 text-sm"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        onClick={handleStep3Next}
                        disabled={loading}
                        className="flex-1 h-9 text-sm font-medium bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Continue to Products
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Create Product Category */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-1.5">
                      <Label htmlFor="category_name" className="text-sm font-medium">
                        Product Category Name <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <Tag className="h-4 w-4" />
                        </div>
                        <Input
                          id="category_name"
                          placeholder="Electronics, Clothing, Books, Software..."
                          value={categoryName}
                          onChange={(e) => setCategoryName(e.target.value)}
                          className="pl-9 h-9 text-sm"
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Create your first product category to organize your products
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="category_description" className="text-sm font-medium">
                        Description <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                      </Label>
                      <Textarea
                        id="category_description"
                        placeholder="Brief description of this product category..."
                        value={categoryDescription}
                        onChange={(e) => setCategoryDescription(e.target.value)}
                        rows={3}
                        className="text-sm resize-none"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(3)}
                        className="flex-1 h-9 text-sm"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        onClick={handleStep4Next}
                        disabled={loading || !categoryName}
                        className="flex-1 h-9 text-sm font-medium bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Completing...
                          </>
                        ) : (
                          <>
                            Complete Setup
                            <Rocket className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-4 text-xs text-muted-foreground"
        >
          <p>Step {currentStep} of {steps.length} • {Math.round(progress)}% Complete</p>
        </motion.div>
      </div>
    </div>
  );
}
