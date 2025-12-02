"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { BarChartBig as ChartPie, Package, Calendar, BookOpen, FileText, GitBranch, Megaphone, Percent, Users, BarChart3, Settings, ChevronDown, Menu, X, Plug, Layout } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: ChartPie },
  {
    name: "Products",
    href: "/products",
    icon: Package,
    children: [
      { name: "List", href: "/products" },
      { name: "Add Product", href: "/products/new" },
      { name: "Bulk Import", href: "/products/import" },
      {
        name: "Settings",
        children: [
          { name: "Custom Fields", href: "/products/settings/custom-fields" },
          { name: "QR Code Templates", href: "/products/settings/qr-codes" },
        ],
      },
    ],
  },
  {
    name: "Events",
    href: "/events",
    icon: Calendar,
    children: [
      { name: "List", href: "/events" },
      { name: "Create Event", href: "/events/new" },
      { name: "Booths", href: "/events/booths" },
    ],
  },
  {
    name: "Landing Pages",
    href: "/landing-pages",
    icon: Layout,
    children: [
      { name: "List", href: "/landing-pages" },
      { name: "Create New", href: "/landing-pages/new" },
    ],
  },
  { name: "Catalogs", href: "/catalogs", icon: BookOpen },
  { name: "Forms", href: "/forms", icon: FileText },
  { name: "Workflows", href: "/workflows", icon: GitBranch },
  { name: "Campaigns", href: "/campaigns", icon: Megaphone },
  { name: "Offers", href: "/offers", icon: Percent },
  {
    name: "Customers",
    href: "/customers",
    icon: Users,
    children: [
      { name: "List", href: "/customers" },
      { name: "Personas", href: "/customers/personas" },
    ],
  },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Integrations", href: "/integrations", icon: Plug },
  { name: "Settings", href: "/settings", icon: Settings },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col overflow-hidden">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <ChartPie className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">EngageIQ</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-gray-700"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">MENU</p>
            <div className="space-y-1">
              {navigation.map((item) => (
                <NavItem
                  key={item.name}
                  item={item}
                  pathname={pathname}
                  onClose={onClose}
                />
              ))}
            </div>
          </nav>
        </div>
      </aside>
    </>
  )
}

function NavItem({
  item,
  pathname,
  onClose,
  depth = 0,
}: {
  item: any
  pathname: string
  onClose: () => void
  depth?: number
}) {
  const [isOpen, setIsOpen] = React.useState(
    item.children?.some((child: any) => 
      child.href === pathname || 
      child.children?.some((subChild: any) => subChild.href === pathname)
    ) || false
  )
  const isActive = pathname === item.href

  // If item has children but no href (like "Settings" submenu)
  if (item.children && !item.href) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium transition-colors",
              "hover:bg-gray-50 hover:text-gray-900",
              isOpen ? "bg-blue-50 text-blue-600" : "text-gray-700"
            )}
          >
            <span>{item.name}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-1 space-y-1 pl-6">
          {item.children.map((child: any) => (
            <NavItem
              key={child.name}
              item={child}
              pathname={pathname}
              onClose={onClose}
              depth={depth + 1}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  // If item has children and href (like "Products")
  if (item.children) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium transition-colors",
              "hover:bg-gray-50 hover:text-gray-900",
              isOpen || isActive
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700"
            )}
          >
            <div className="flex items-center gap-3">
              {item.icon && <item.icon className="h-5 w-5" />}
              <span>{item.name}</span>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-1 space-y-1 pl-11">
          {item.children.map((child: any) => (
            <NavItem
              key={child.name}
              item={child}
              pathname={pathname}
              onClose={onClose}
              depth={depth + 1}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  // Regular menu item with link
  return (
    <Link
      href={item.href}
      onClick={onClose}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-colors",
        "hover:bg-gray-50 hover:text-gray-900",
        isActive
          ? "bg-blue-50 text-blue-600"
          : "text-gray-700"
      )}
    >
      {item.icon && <item.icon className="h-5 w-5" />}
      <span>{item.name}</span>
    </Link>
  )
}
