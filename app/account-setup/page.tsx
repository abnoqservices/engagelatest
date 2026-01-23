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
import { Loader2, CheckCircle2, Upload, X, ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosClient from "@/lib/axiosClient";
import { showToast } from "@/lib/showToast";

export default function AccountSetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [checkingStatus, setCheckingStatus] = React.useState(true);

  const [slug, setSlug] = React.useState("");
  const [slugChecking, setSlugChecking] = React.useState(false);
  const [slugAvailable, setSlugAvailable] = React.useState<boolean | null>(null);
  const [slugDebounceTimer, setSlugDebounceTimer] = React.useState<NodeJS.Timeout | null>(null);

  const [departmentName, setDepartmentName] = React.useState("");
  const [industry, setIndustry] = React.useState("");
  const [logoFile, setLogoFile] = React.useState<File | null>(null);
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
  const [industries, setIndustries] = React.useState<Array<{ id: number; name: string }>>([]);
  const [loadingIndustries, setLoadingIndustries] = React.useState(false);
  const [emailVerified, setEmailVerified] = React.useState<boolean | null>(null);
  
  const [categoryName, setCategoryName] = React.useState("");
  const [categoryDescription, setCategoryDescription] = React.useState("");

  // Check setup status on mount
  React.useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await axiosClient.get("/account-setup/status");
        if (res.data.success) {
          const data = res.data.data;
          
          // Check email verification
          if (data.email_verified === false) {
            setEmailVerified(false);
            showToast("Please verify your email address before completing account setup", "error");
            setTimeout(() => {
              router.push("/signin");
            }, 2000);
            setCheckingStatus(false);
            return;
          }
          
          setEmailVerified(true);
          
          // If already set up, redirect to dashboard
          if (data.is_account_set_up) {
            router.replace("/dashboard");
            return;
          }

          // Pre-fill slug if exists
          if (data.has_slug && data.organization?.slug) {
            setSlug(data.organization.slug);
          }

          // Navigate to appropriate step based on completion status
          if (data.has_category) {
            setCurrentStep(3);
          } else if (data.has_department) {
            setCurrentStep(3);
          }
        }
      } catch (error: any) {
        console.error("Failed to check setup status:", error);
        if (error.response?.status === 403 && error.response?.data?.message?.includes("email")) {
          setEmailVerified(false);
          showToast("Please verify your email address before completing account setup", "error");
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

    // Clear existing timer
    if (slugDebounceTimer) {
      clearTimeout(slugDebounceTimer);
    }

    // Set new timer
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
    if (!slug || slug.length < 3) {
      showToast("Please enter a valid slug (at least 3 characters)", "error");
      return;
    }

    if (slugAvailable === false) {
      showToast("This slug is already taken. Please choose another one.", "error");
      return;
    }

    if (slugAvailable === null && !slugChecking) {
      // Check slug if not checked yet
      await checkSlugAvailability(slug);
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post("/account-setup/update-slug", { slug });
      showToast("Slug updated successfully", "success");
      setCurrentStep(2);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to update slug", "error");
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

      showToast("Department created successfully", "success");
      setCurrentStep(3);
    } catch (error: any) {
      console.error("Department creation error:", error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.name?.[0] ||
                          error.message || 
                          "Failed to create department. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStep3Next = async () => {
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

      // Complete setup
      const completeRes = await axiosClient.post("/account-setup/complete");
      
      if (!completeRes.data.success) {
        throw new Error(completeRes.data.message || "Failed to complete setup");
      }
      
      showToast("Account setup completed successfully!", "success");
      setTimeout(() => {
        router.push("/plans");
      }, 1500);
    } catch (error: any) {
      console.error("Category creation error:", error);
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
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (emailVerified === false) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-red-600">Email Not Verified</CardTitle>
            <CardDescription className="mt-2">
              Please verify your email address before completing account setup.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push("/signin")} className="w-full">
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Complete Your Account Setup</CardTitle>
          <CardDescription className="text-base mt-2">
            Let's get your account ready in just a few steps
          </CardDescription>
          <div className="mt-4">
            <Progress value={(currentStep / 3) * 100} className="h-2" />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span className={currentStep >= 1 ? "font-medium text-blue-600" : ""}>
                Step 1: Slug
              </span>
              <span className={currentStep >= 2 ? "font-medium text-blue-600" : ""}>
                Step 2: Department
              </span>
              <span className={currentStep >= 3 ? "font-medium text-blue-600" : ""}>
                Step 3: Category
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Organization Slug */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Organization Slug *</Label>
                <Input
                  id="slug"
                  placeholder="acme-corp"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className={slugAvailable === false ? "border-red-500" : slugAvailable === true ? "border-green-500" : ""}
                />
                <div className="flex items-center gap-2 text-sm">
                  {slugChecking && (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-muted-foreground">Checking availability...</span>
                    </>
                  )}
                  {!slugChecking && slugAvailable === true && (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">Slug is available</span>
                    </>
                  )}
                  {!slugChecking && slugAvailable === false && (
                    <>
                      <X className="h-4 w-4 text-red-600" />
                      <span className="text-red-600">This slug is already taken</span>
                    </>
                  )}
                  {!slugChecking && slugAvailable === null && slug.length >= 3 && (
                    <span className="text-muted-foreground">Enter a slug to check availability</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  This will be part of your organization's URL. Only lowercase letters, numbers, and hyphens are allowed.
                </p>
              </div>

              <Button
                onClick={handleStep1Next}
                disabled={loading || slugChecking || !slug || slug.length < 3 || slugAvailable === false}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Continue to Step 2 <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Step 2: Create Department */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="department_name">Department Name *</Label>
                <Input
                  id="department_name"
                  placeholder="Sales Department"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry (Optional)</Label>
                <Select value={industry || undefined} onValueChange={(value) => setIndustry(value || "")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an industry (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingIndustries ? (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">Loading industries...</div>
                    ) : (
                      industries.map((ind) => (
                        <SelectItem key={ind.id} value={ind.name}>
                          {ind.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Department Logo (Optional)</Label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Max 5MB. Supported formats: JPEG, PNG, GIF, WebP
                    </p>
                  </div>
                  {logoPreview && (
                    <div className="relative">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="h-20 w-20 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setLogoFile(null);
                          setLogoPreview(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleStep2Next}
                  disabled={loading || !departmentName}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Continue to Step 3 <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Create Product Category */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category_name">Product Category Name *</Label>
                <Input
                  id="category_name"
                  placeholder="Electronics, Clothing, Books, etc."
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Create at least one category so you can organize your products
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category_description">Description (Optional)</Label>
                <Textarea
                  id="category_description"
                  placeholder="Brief description of this product category"
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleStep3Next}
                  disabled={loading || !categoryName}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Completing...
                    </>
                  ) : (
                    "Complete Setup"
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
