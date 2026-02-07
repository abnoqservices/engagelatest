"use client";

import { useState, useEffect, useCallback } from "react";
import axiosClient from "./axiosClient";

export interface Permission {
  id: number;
  name: string;
  slug: string;
  resource: string;
  action: string;
}

export interface UserPermissions {
  permissions: Permission[];
  role?: {
    id: number;
    name: string;
    slug: string;
  };
}

/**
 * Hook to manage and check user permissions
 */
export function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<{ id: number; name: string; slug: string } | null>(null);

  const fetchPermissions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/auth/me");
      
      if (res.data?.success || res.data?.data) {
        const userData = res.data.data || res.data;
        
        // Get permissions from user's role
        if (userData.department_role?.permissions) {
          setPermissions(userData.department_role.permissions);
        } else if (userData.role?.permissions) {
          setPermissions(userData.role.permissions);
        } else if (userData.permissions) {
          setPermissions(userData.permissions);
        } else {
          setPermissions([]);
        }

        // Get role info
        if (userData.department_role) {
          setRole({
            id: userData.department_role.id,
            name: userData.department_role.name,
            slug: userData.department_role.slug,
          });
        } else if (userData.role) {
          setRole({
            id: userData.role.id,
            name: userData.role.name,
            slug: userData.role.slug,
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  /**
   * Check if user has a specific permission
   * @param resource - The resource (e.g., "products", "events", "landing_pages")
   * @param action - The action (e.g., "create", "update", "delete", "view")
   */
  const hasPermission = useCallback(
    (resource: string, action: string): boolean => {
      if (loading) return false;
      
      // Admin/super admin roles typically have all permissions
      if (role?.slug === "admin" || role?.slug === "super_admin") {
        return true;
      }

      return permissions.some(
        (perm) =>
          perm.resource.toLowerCase() === resource.toLowerCase() &&
          perm.action.toLowerCase() === action.toLowerCase()
      );
    },
    [permissions, role, loading]
  );

  /**
   * Check if user can perform any action on a resource
   */
  const canAccessResource = useCallback(
    (resource: string): boolean => {
      if (loading) return false;
      if (role?.slug === "admin" || role?.slug === "super_admin") return true;
      
      return permissions.some(
        (perm) => perm.resource.toLowerCase() === resource.toLowerCase()
      );
    },
    [permissions, role, loading]
  );

  /**
   * Check multiple permissions (returns true if user has ALL permissions)
   */
  const hasAllPermissions = useCallback(
    (checks: Array<{ resource: string; action: string }>): boolean => {
      if (loading) return false;
      if (role?.slug === "admin" || role?.slug === "super_admin") return true;
      
      return checks.every((check) => hasPermission(check.resource, check.action));
    },
    [hasPermission, role, loading]
  );

  /**
   * Check multiple permissions (returns true if user has ANY permission)
   */
  const hasAnyPermission = useCallback(
    (checks: Array<{ resource: string; action: string }>): boolean => {
      if (loading) return false;
      if (role?.slug === "admin" || role?.slug === "super_admin") return true;
      
      return checks.some((check) => hasPermission(check.resource, check.action));
    },
    [hasPermission, role, loading]
  );

  return {
    permissions,
    role,
    loading,
    hasPermission,
    canAccessResource,
    hasAllPermissions,
    hasAnyPermission,
    refetch: fetchPermissions,
  };
}
