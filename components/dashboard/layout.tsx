"use client"

import * as React from "react"
import { Sidebar } from "./sidebar"
import { TopNav } from "./top-nav"
import { Toaster } from "sonner"
import AuthWrapper from "@/components/AuthWrapper"
import { useState } from "react"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(true) // collapsed by default

  return (
    <AuthWrapper>
      <div className="flex h-screen overflow-hidden">
        
        {/* Sidebar hover wrapper */}
        <div
          onMouseEnter={() => setIsCollapsed(false)}
          onMouseLeave={() => setIsCollapsed(true)}
          className="h-full"
        >
          <Sidebar
            isOpen={isSidebarOpen}
            isCollapsed={isCollapsed}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          <Toaster richColors position="top-right" />

          <TopNav onMenuClick={() => setIsSidebarOpen(true)} />

          <main className="flex-1 overflow-y-auto bg-background p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthWrapper>
  )
}
