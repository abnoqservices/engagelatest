"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BookOpen, Search, Plus, MoreVertical, Edit2, Copy, Download, Share2, Trash2, Eye } from 'lucide-react'
import Link from "next/link"

const catalogs = [
  {
    id: 1,
    name: "Tech Products 2024",
    description: "Complete catalog of our technology products",
    coverImage: "/modern-laptop-workspace.png",
    productCount: 24,
    pageCount: 32,
    status: "published",
    views: 1243,
    downloads: 89,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: 2,
    name: "Spring Collection",
    description: "Latest products for spring season",
    coverImage: "/modern-smartphone.png",
    productCount: 18,
    pageCount: 24,
    status: "draft",
    views: 0,
    downloads: 0,
    createdAt: "2024-01-22",
    updatedAt: "2024-01-22",
  },
  {
    id: 3,
    name: "Premium Audio Gear",
    description: "High-end headphones and audio equipment",
    coverImage: "/diverse-people-listening-headphones.png",
    productCount: 12,
    pageCount: 16,
    status: "published",
    views: 876,
    downloads: 54,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
  },
]

export default function CatalogsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredCatalogs = catalogs.filter((catalog) =>
    catalog.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Catalogs</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create and manage digital product catalogs
            </p>
          </div>
          <Link href="/catalogs/new">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Create Catalog
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search catalogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCatalogs.map((catalog) => (
            <Card key={catalog.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Catalog Cover */}
              <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                <img
                  src={catalog.coverImage || "/placeholder.svg"}
                  alt={catalog.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge
                    variant={catalog.status === "published" ? "default" : "secondary"}
                    className={
                      catalog.status === "published"
                        ? "bg-emerald-500 hover:bg-emerald-600"
                        : ""
                    }
                  >
                    {catalog.status}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4 space-y-3">
                {/* Title and Description */}
                <div>
                  <h3 className="font-semibold text-lg text-foreground">
                    {catalog.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {catalog.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{catalog.productCount} products</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{catalog.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    <span>{catalog.downloads}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Link href={`/catalogs/${catalog.id}`} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Link
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
