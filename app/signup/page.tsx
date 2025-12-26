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
import { QrCode, Eye, EyeOff } from "lucide-react";
import axiosClient from "@/lib/axiosClient";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [signupSuccess, setSignupSuccess] = React.useState(false);

  // For inline messages on the form
  const [message, setMessage] = React.useState<{ text: string; type: "error" | "success" | null }>({
    text: "",
    type: null,
  });

  // For resend verification messages (on success screen)
  const [resendMessage, setResendMessage] = React.useState<{ text: string; type: "error" | "success" | null }>({
    text: "",
    type: null,
  });
  const [resending, setResending] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    agreeToTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: "", type: null });
    setSignupSuccess(false);

    const { name, email, password, confirmPassword, company, agreeToTerms } = formData;

    // Client-side validations
    if (!name || !email || !password || !confirmPassword || !company) {
      setMessage({ text: "All fields are required.", type: "error" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ text: "Please enter a valid email address.", type: "error" });
      return;
    }

    if (password.length < 8) {
      setMessage({ text: "Password must be at least 8 characters long.", type: "error" });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ text: "Passwords do not match.", type: "error" });
      return;
    }

    if (!agreeToTerms) {
      setMessage({ text: "You must agree to the terms and conditions.", type: "error" });
      return;
    }

    setLoading(true);

    try {
      await axiosClient.post("/auth/register", {
        name,
        email,
        password,
        password_confirmation: password,
        organization_id: company,
      });

      setSignupSuccess(true);
      setMessage({
        text: "Account created successfully! Please check your email to verify your account.",
        type: "success",
      });
    } catch (err: any) {
      console.error("Signup error:", err);

      if (err.response?.status === 422) {
        const errors = err.response.data.errors as Record<string, string[]>;
        const firstError = Object.values(errors)[0][0];
        setMessage({ text: firstError || "Please fix the errors above.", type: "error" });
      } else if (err.response?.data?.message) {
        const backendMsg = err.response.data.message;
        if (typeof backendMsg === "string" && backendMsg.toLowerCase().includes("email") && backendMsg.toLowerCase().includes("send")) {
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

  // Resend verification email
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
    console.log(`Sign up with ${provider}`);
  };

  // Post-signup success screen with Resend button
  if (signupSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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

              {/* Resend Message */}
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

  // Main signup form
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <QrCode className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>
            Get started with EngageIQ today - no credit card required
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Button variant="outline" onClick={() => handleSocialSignup("google")} className="w-full">
              Sign up with Google
            </Button>
            <Button variant="outline" onClick={() => handleSocialSignup("linkedin")} className="w-full">
              Sign up with LinkedIn
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Inline Message */}
          {message.text && (
            <div
              className={`text-center text-sm font-medium p-3 rounded-md ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
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
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                type="text"
                placeholder="Acme Corp"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
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
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
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