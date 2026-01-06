"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { QrCode, ArrowLeft, ArrowRight } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [signupSuccess, setSignupSuccess] = React.useState(false);
  const [message, setMessage] = React.useState<{ text: string; type: "error" | "success" | null }>({
    text: "",
    type: null,
  });

  const [resendMessage, setResendMessage] = React.useState<{ text: string; type: "error" | "success" | null }>({
    text: "",
    type: null,
  });
  const [resending, setResending] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    agreeToTerms: false,
    organization: {
      name: "",
      slug: "",
      description: "",
    },
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleOrganizationNameChange = (name: string) => {
    setFormData((prev) => {
      const previousGenerated = generateSlug(prev.organization.name);
      const isCurrentlyDefault =
        !prev.organization.slug || prev.organization.slug === previousGenerated;

      const newSlug = isCurrentlyDefault ? generateSlug(name) : prev.organization.slug;

      return {
        ...prev,
        organization: {
          ...prev.organization,
          name,
          slug: newSlug,
        },
      };
    });
  };

  // Validate Step 1 (User Details)
  const validateStep1 = () => {
    const { name, email, password, password_confirmation, agreeToTerms } = formData;

    if (!name || !email || !password || !password_confirmation) {
      setError("All fields are required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return false;
    }

    if (password !== password_confirmation) {
      setError("Password and Confirm Password do not match.");
      return false;
    }

    if (!agreeToTerms) {
      setError("Please agree to the terms and conditions.");
      return false;
    }

    return true;
  };

  // Validate Step 2 (Organization Details)
  const validateStep2 = () => {
    const { organization } = formData;

    if (!organization.name) {
      setError("Organization name is required.");
      return false;
    }

    if (organization.name.length > 255) {
      setError("Organization name must be less than 255 characters.");
      return false;
    }

    if (organization.slug) {
      if (organization.slug.length > 255) {
        setError("Organization slug must be less than 255 characters.");
        return false;
      }

      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugRegex.test(organization.slug)) {
        setError(
          "Slug can only contain lowercase letters, numbers, and single hyphens (no consecutive hyphens)."
        );
        return false;
      }

      if (organization.slug.length < 3) {
        setError("Slug must be at least 3 characters long.");
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    setError("");
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setError("");
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateStep2()) {
      return;
    }

    setLoading(true);

    try {
      const { name, email, password, password_confirmation, organization } = formData;

      const orgData: any = {
        name: organization.name,
      };

      if (organization.slug) {
        orgData.slug = organization.slug;
      }

      if (organization.description?.trim()) {
        orgData.description = organization.description.trim();
      }

      const res = await axiosClient.post("/auth/register", {
        name,
        email,
        password,
        password_confirmation,
        organization: orgData,
      });

      if (res.data?.data?.access_token) {
        localStorage.setItem("token", res.data.data.access_token);
      }

      if (res.data?.data?.user) {
        localStorage.setItem("user", JSON.stringify(res.data.data.user));
      }

      setSignupSuccess(true);
      setMessage({
        text: "Account created successfully! Please check your email to verify your account.",
        type: "success",
      });
    } catch (err: any) {
      console.error("Signup error:", err);

      if (err.response?.status === 422) {
        const errors = err.response.data.errors as Record<string, string[]>;
        const errorMessages: string[] = [];

        Object.keys(errors).forEach((key) => {
          errors[key].forEach((msg: string) => {
            errorMessages.push(msg);
          });
        });

        setError(errorMessages.join(". ") || "Validation error occurred.");
      } else if (err.response?.data?.message) {
        const backendMsg = err.response.data.message;
        if (
          typeof backendMsg === "string" &&
          backendMsg.toLowerCase().includes("email") &&
          backendMsg.toLowerCase().includes("send")
        ) {
          setSignupSuccess(true);
          setMessage({
            text: "Account created, but verification email failed to send. Use the resend button below.",
            type: "error",
          });
        } else {
          setMessage({ text: backendMsg, type: "error" });
        }
      } else {
        setMessage({ text: "Something went wrong. Please try again.", type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendMessage({ text: "", type: null });
    setResending(true);

    try {
      await axiosClient.post("/auth/email/resend", { email: formData.email });

      setResendMessage({
        text: "Verification email sent successfully! Please check your inbox (and spam folder).",
        type: "success",
      });
    } catch (err: any) {
      console.error("Resend email error:", err);

      if (err.response?.data?.message) {
        setResendMessage({ text: err.response.data.message, type: "error" });
      } else {
        setResendMessage({
          text: "Failed to resend email. Please try again or contact support.",
          type: "error",
        });
      }
    } finally {
      setResending(false);
    }
  };

  const handleSocialSignup = (provider: string) => {
    console.log(`[v0] Sign up with ${provider}`);
    router.push("/dashboard");
  };

  const autoSlug = generateSlug(formData.organization.name);
  const slugIsCustom =
    formData.organization.slug && formData.organization.slug !== autoSlug;

  if (signupSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-10 w-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10l18-7-8 18-2-7-8-4z"/>
          </svg>


            </div>
            <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
            <CardDescription className="text-base mt-3">
              We've sent a verification link to <strong>{formData.email}</strong>.
              <br />
              Click the link in the email to activate your account and log in.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Didn't receive the email? Check your spam/junk folder.
              </p>

              {resendMessage.text && (
                <div
                  className={`text-center text-sm font-medium p-3 rounded-md mb-4 ${
                    resendMessage.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {resendMessage.text}
                </div>
              )}

              <Button
                onClick={handleResendVerification}
                disabled={resending}
                variant="outline"
                className="w-full"
              >
                {resending ? "Sending..." : "Resend Verification Email"}
              </Button>
            </div>

            <Button asChild className="w-full">
              <Link href="/signin">Go to Sign In</Link>
            </Button>
          </CardContent>

          <CardFooter className="justify-center text-sm text-muted-foreground">
            Need help? Contact support.
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <QrCode className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>
            Get started with EngageIQ today — no credit card required
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span className={currentStep >= 1 ? "font-medium text-blue-600" : ""}>
                Step 1: Your Details
              </span>
              <span className={currentStep >= 2 ? "font-medium text-blue-600" : ""}>
                Step 2: Organization
              </span>
            </div>
            <Progress value={(currentStep / 2) * 100} className="h-2" />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Step 1 */}
          {currentStep === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">Must be at least 8 characters long</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password_confirmation}
                    onChange={(e) =>
                      setFormData({ ...formData, password_confirmation: e.target.value })
                    }
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, agreeToTerms: checked as boolean })
                  }
                />
                <label htmlFor="terms" className="text-sm leading-none">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Next: Organization Details <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="org_name">Organization Name *</Label>
                <Input
                  id="org_name"
                  placeholder="Acme Corporation"
                  value={formData.organization.name}
                  onChange={(e) => handleOrganizationNameChange(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This will appear across the app
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="org_slug">Organization Slug</Label>
                <Input
                  id="org_slug"
                  placeholder="acme-corp"
                  value={formData.organization.slug}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      organization: {
                        ...formData.organization,
                        slug: e.target.value.toLowerCase().trim(),
                      },
                    })
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {slugIsCustom ? (
                    <>Custom slug set — won't change when name is edited</>
                  ) : formData.organization.name.trim() ? (
                    <>
                      Auto-generated:{" "}
                      <span className="font-medium">app.engageiq.com/{autoSlug}</span>
                    </>
                  ) : (
                    <>Will be auto-generated from organization name</>
                  )}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="org_description">Description (optional)</Label>
                <Textarea
                  id="org_description"
                  placeholder="A leading technology company building the future of engagement analytics"
                  value={formData.organization.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      organization: {
                        ...formData.organization,
                        description: e.target.value,
                      },
                    })
                  }
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="font-medium text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}