"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axiosClient from "@/lib/axiosClient";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const publicRoutes = ["/signin", "/signup", "/forgot-password", "/select-department", "/account-setup", "/plans"];

    // Not logged in → block protected routes
    if (!token && !publicRoutes.includes(pathname)) {
      router.replace("/signin"); // replace prevents flicker
      return;
    }

    // Logged in → block auth pages (but allow select-department and account-setup)
    if (token && (pathname === "/signin" || pathname === "/signup")) {
      // Check if account is set up before redirecting
      const checkAccountSetup = async () => {
        try {
          const res = await axiosClient.get("/account-setup/status");
          if (res.data.success) {
            const isAccountSetUp = res.data.data.is_account_set_up;
            if (isAccountSetUp) {
              router.replace("/dashboard");
            } else {
              router.replace("/account-setup");
            }
          } else {
            router.replace("/dashboard");
          }
        } catch (error) {
          router.replace("/dashboard");
        }
      };
      checkAccountSetup();
      return;
    }

    // Check account setup status for protected routes (excluding account-setup itself)
    if (token && !publicRoutes.includes(pathname) && pathname !== "/account-setup") {
      const checkAccountSetup = async () => {
        try {
          const res = await axiosClient.get("/account-setup/status");
          if (res.data.success) {
            const isAccountSetUp = res.data.data.is_account_set_up;
            if (!isAccountSetUp) {
              router.replace("/account-setup");
              return;
            }
          }
        } catch (error) {
          // If check fails, allow the route (error handling on protected routes will handle auth)
        }
        setIsReady(true);
      };
      checkAccountSetup();
      return;
    }

    //  Only allow render when route is valid
    setIsReady(true);
  }, [pathname, router]);

  //  Prevent UI flicker
  if (!isReady) return null; // or <Loader />

  return <>{children}</>;
}
