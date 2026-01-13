"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosClient from "@/lib/axiosClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail } from "lucide-react";
import Logo from "@/public/pexifly_logo.png";
import Image from "next/image";
import TestimonialsCarousel from "@/components/Signin/TestimonialsCarousel";
import MiddleContent from "@/components/Signin/MiddleContent";
import TrustedByMarquee from "@/components/Signin/TrustedByMarquee";

interface LoginResponse {
  success: boolean;
  user?: any;
  token?: string;
  departments?: Array<{ id: number; name: string; description?: string }>;
  departmentSelectionRequired?: boolean;
  selectedDepartmentId?: number | null;
  error?: string;
}

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  // Check if user is already logged in → redirect
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // You can add optional token validation here if you want
      // e.g. call a /me or /validate-token endpoint

      const redirectPath =
        searchParams.get("redirect") ||
        localStorage.getItem("redirectAfterLogin") ||
        "/dashboard";

      // Clean up
      localStorage.removeItem("redirectAfterLogin");

      router.replace(redirectPath);
    } else {
      setCheckingAuth(false);
    }
  }, [router, searchParams]);

  const loginUser = async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    try {
      const response = await axiosClient.post("/auth/login", {
        email,
        password,
      });

      return {
        success: true,
        user: response.data.data.user,
        token: response.data.data.access_token,
        departments: response.data.data.departments || [],
        departmentSelectionRequired:
          response.data.data.departmentSelectionRequired || false,
        selectedDepartmentId: response.data.data.selectedDepartmentId || null,
      };
    } catch (error: any) {
      if (error.response) {
        return {
          success: false,
          error: error.response.data.message || "Login failed",
        };
      }
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password) {
        setError("Please fill in all fields");
        return;
      }

      const result = await loginUser(email, password);

      if (result.success && result.user && result.token) {
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", result.token);

        // Handle department selection logic
        if (
          result.departmentSelectionRequired &&
          result.departments &&
          result.departments.length > 1
        ) {
          localStorage.setItem(
            "loginData",
            JSON.stringify({
              departments: result.departments,
              selectedDepartmentId: result.selectedDepartmentId,
            })
          );
          router.push("/select-department");
        } else if (result.selectedDepartmentId) {
          localStorage.setItem(
            "selectedDepartmentId",
            result.selectedDepartmentId.toString()
          );
          const dept = result.departments?.find(
            (d) => d.id === result.selectedDepartmentId
          );
          if (dept) {
            localStorage.setItem("selectedDepartmentName", dept.name);
          }

          // Final redirect after department handling
          const redirectPath =
            searchParams.get("redirect") ||
            localStorage.getItem("redirectAfterLogin") ||
            "/dashboard";

          localStorage.removeItem("redirectAfterLogin");
          router.push(redirectPath);
        } else {
          // No department selection needed
          const redirectPath =
            searchParams.get("redirect") ||
            localStorage.getItem("redirectAfterLogin") ||
            "/dashboard";

          localStorage.removeItem("redirectAfterLogin");
          router.push(redirectPath);
        }
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    router.push("/dashboard");
  };

  // Show loading state while checking auth
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-lg">Checking authentication...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-7">
        {/* LEFT — LOGIN FORM */}
        <div className="flex items-center justify-center p-4 col-span-3">
          <div className="text-card-foreground flex flex-col gap-6 rounded-xl py-6 w-full max-w-md">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto mb-4 flex items-center justify-center">
                <Image src={Logo} alt="Logo" width={100} height={100} />
              </div>
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <CardDescription>
                Sign in to your EngageIQ account to continue
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
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

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="!shadow-none"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-blue-600 hover:underline text-pexifly"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="!shadow-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-pexifly cursor-pointer font-bold"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <Separator />

              <Button
                variant="outline"
                onClick={handleDemoLogin}
                className="w-full border-purple-200 !shadow-none cursor-pointer text-purple-700 hover:bg-purple-50"
              >
                <Mail className="mr-2 h-4 w-4" />
                Try Demo Account
              </Button>
            </CardContent>

            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-pexifly hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </div>
        </div>

        {/* RIGHT — INFO / TESTIMONIALS */}
        <div className="hidden col-span-4 relative lg:flex flex-col justify-between p-12 bg-pexifly overflow-hidden">
          <div className="absolute inset-0 bg-purple-800/80" />

          <div className="relative z-10 flex h-full flex-col">
            <TestimonialsCarousel />
            <MiddleContent />
            <TrustedByMarquee />
          </div>
        </div>
      </div>
    </div>
  );
}