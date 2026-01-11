"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChartBig as ChartPie,
  Package,
  Calendar,
  BookOpen,
  FileText,
  GitBranch,
  Megaphone,
  Percent,
  Users,
  BarChart3,
  Settings,
  ChevronDown,
  Menu,
  X,
  Plug,
  Layout,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import Image from "next/image"
import whiteLogo from "@/public/white_logo.png"
import whiteLogoCollapsed from "@/public/white_logo_full.png"

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
          { name: "Product Category", href: "/products/settings/product-category" },
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
  // { name: "Offers", href: "/offers", icon: Percent },
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
  isCollapsed: boolean
  onClose: () => void
  onToggleCollapse: () => void
}

export function Sidebar({
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed overflow-x-hidden inset-y-0 left-0 z-50 h-screen overflow-hidden",
          "bg-pexifly-dark text-white border-r border-white/10",
          "transition-[width] duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:static lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col overflow-x-hidden">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
            <div
              className={cn(
                "transition-all duration-300 overflow-hidden",
                isCollapsed
                  ? "opacity-0 w-0 translate-x-[-10px]"
                  : "opacity-100 w-auto translate-x-0"
              )}
            >
              <Link href="/dashboard">
                  <Image src={!isCollapsed ? whiteLogoCollapsed : whiteLogoCollapsed} alt="Pexifly" width={110} height={40} />
              </Link>
            </div>

            <div className="flex items-center gap-2">
           {/* Show image only if collapsed */}
           {isCollapsed && (
            <Image src={whiteLogo} alt="Pexifly" width={110} height={40} />
           )}
              {/* <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={onToggleCollapse}
              >
                <Menu className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 lg:hidden"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button> */}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-2 py-4">
            <div className="space-y-1">
              {navigation.map((item) => (
                <NavItem
                  key={item.name}
                  item={item}
                  pathname={pathname}
                  onClose={onClose}
                  isCollapsed={isCollapsed}
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
  isCollapsed,
}: {
  item: any
  pathname: string
  onClose: () => void
  isCollapsed: boolean
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const isActive = pathname === item.href

  if (item.children) {
    return (
      <Collapsible open={!isCollapsed && isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button
            title={isCollapsed ? item.name : undefined}
            className={cn(
              "flex w-full items-center rounded-lg px-3 py-2.5",
              "transition-colors duration-200 hover:bg-white/10",
              isActive || isOpen ? "bg-white/15 text-white" : "text-white/80",
              isCollapsed ? "justify-center" : "justify-between"
            )}
          >
            <div className="flex items-center gap-3">
              {item.icon && <item.icon className="h-5 w-5 shrink-0" />}
              <span
                className={cn(
                  "transition-all duration-300",
                  isCollapsed
                    ? "opacity-0 w-0 translate-x-[-8px]"
                    : "opacity-100 w-auto translate-x-0"
                )}
              >
                {item.name}
              </span>
            </div>

            {!isCollapsed && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-300",
                  isOpen && "rotate-180"
                )}
              />
            )}
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="pl-11 mt-1 space-y-1 transition-all">
          {item.children.map((child: any) => (
            <NavItem
              key={child.name}
              item={child}
              pathname={pathname}
              onClose={onClose}
              isCollapsed={isCollapsed}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <Link
      href={item.href}
      onClick={onClose}
      title={isCollapsed ? item.name : undefined}
      className={cn(
        "flex items-center rounded-lg px-3 py-2.5",
        "transition-all duration-200 hover:bg-white/10",
        isActive ? "bg-white/15 text-white" : "text-white/80",
        isCollapsed ? "justify-center" : "gap-3"
      )}
    >
      {item.icon && <item.icon className="h-5 w-5 shrink-0" />}
      <span
        className={cn(
          "transition-all duration-300",
          isCollapsed
            ? "opacity-0 w-0 translate-x-[-8px]"
            : "opacity-100 w-auto translate-x-0"
        )}
      >
        {item.name}
      </span>
    </Link>
  )
}
