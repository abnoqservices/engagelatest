"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

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

    const publicRoutes = ["/signin", "/signup", "/forgot-password"];

    // Not logged in → block protected routes
    if (!token && !publicRoutes.includes(pathname)) {
      router.replace("/signin"); // replace prevents flicker
      return;
    }

    // Logged in → block auth pages
    if (token && publicRoutes.includes(pathname)) {
      router.replace("/dashboard"); //  no history stack
      return;
    }

    //  Only allow render when route is valid
    setIsReady(true);
  }, [pathname, router]);

  //  Prevent UI flicker
  if (!isReady) return null; // or <Loader />

  return <>{children}</>;
}
