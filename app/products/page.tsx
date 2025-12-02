"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Search,
  Filter,
  Download,
  MoreVertical,
  Edit,
  Copy,
  QrCode,
  BarChart3,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import axiosClient from "@/lib/axiosClient";
import axios from "axios";


export default function ProductsPage() {
  type Product = {
    id: string;
    image: string;
    name: string;
    sku: string;
    category: string;
    price: string;
    scans: number;
    views: number;
    leads: number;
    status: boolean;
  };
  
  const [products, setProducts] = React.useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const [editDrawerOpen, setEditDrawerOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);


  const allSelected = selectedProducts.length === products.length;
  const someSelected = selectedProducts.length > 0 && !allSelected;

  // ---------------------------------------------
  // ✅ Select handlers
  // ---------------------------------------------
  const toggleAll = () => {
    setSelectedProducts(allSelected ? [] : products.map((p:any) => p.id));
  };

  const toggleProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const openEditDrawer = (product: Product) => {
    setEditingProduct(product);
    setEditDrawerOpen(true);
  };

  // ---------------------------------------------
  // ✅ Fetch from API (optional)
  // ---------------------------------------------
  const fetchProducts = async () => {
    try {
      const res = await axiosClient.get("/manageapi/productListing");
  
      // API full response
      console.log("Response:", res.data);
  
      // Correct way to access the product data
      const productData = res.data.products; 
  
      setProducts(productData); // or setProducts([productData]) depending on UI
  
    } catch (e) {
      console.log("API not connected, using mock data", e);
    }
  };
  

  React.useEffect(() => {
     fetchProducts(); // uncomment when API ready
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Products</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your product catalog and QR codes
            </p>
          </div>
          <Link href="/products/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="wearables">Wearables</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                  <DropdownMenuItem>Export as XLSX</DropdownMenuItem>
                  <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Bulk actions */}
          {selectedProducts.length > 0 && (
            <div className="flex items-center gap-3 rounded-lg bg-primary/10 px-4 py-2 text-sm">
              <span className="font-medium text-primary">
                {selectedProducts.length} selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Bulk Edit</Button>
                <Button variant="outline" size="sm">Generate QRs</Button>
                <Button variant="outline" size="sm">Export Selected</Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-3 w-3 mr-1" /> Delete
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="rounded-xl border bg-card shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
                </TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-center">Scans</TableHead>
                <TableHead className="text-center">Views</TableHead>
                <TableHead className="text-center">Leads</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products.map((p:any) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(p.id)}
                      onCheckedChange={() => toggleProduct(p.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={40}
                      height={40}
                      className="rounded-md"
                    />
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => openEditDrawer(p)}
                      className="text-blue-600 hover:underline"
                    >
                      {p.name}
                    </button>
                  </TableCell>
                  <TableCell className="font-mono">{p.sku}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{p.category}</Badge>
                  </TableCell>
                  <TableCell className="font-semibold">{p.price}</TableCell>
                  <TableCell className="text-center">{p.scans}</TableCell>
                  <TableCell className="text-center">{p.views}</TableCell>
                  <TableCell className="text-center">{p.leads}</TableCell>
                  <TableCell className="text-center">
                    <Switch checked={p.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDrawer(p)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" /> Clone
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <QrCode className="mr-2 h-4 w-4" /> Generate QR
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Showing <span>1-5</span> of <span>50</span> products
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="10">
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 / page</SelectItem>
                <SelectItem value="20">20 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" disabled>
                <ChevronLeft />
              </Button>
              <Button variant="outline" size="icon">
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------- */}
      {/* Edit Drawer */}
      {/* ----------------------------------------- */}
      <Sheet open={editDrawerOpen} onOpenChange={setEditDrawerOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0">
          <div className="sticky top-0 bg-white border-b px-6 py-4">
            <SheetHeader>
              <SheetTitle className="text-2xl font-bold">Edit Product</SheetTitle>
              <SheetDescription>Update product details</SheetDescription>
            </SheetHeader>
          </div>

          {editingProduct && (
            <div className="px-6 py-6 space-y-6">
              {/* Product Form */}
              <div className="space-y-4">
                <Label>Product Name</Label>
                <Input defaultValue={editingProduct.name} />

                <Label>SKU</Label>
                <Input defaultValue={editingProduct.sku} />

                <Label>Price</Label>
                <Input defaultValue={editingProduct.price} />

                <Label>Category</Label>
                <Select defaultValue={editingProduct.category.toLowerCase()}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="wearables">Wearables</SelectItem>
                  </SelectContent>
                </Select>

                <Label>Description</Label>
                <Textarea rows={4} defaultValue="Great product!" />
              </div>

              {/* Actions */}
              <div className="flex gap-4 sticky bottom-0 bg-white border-t px-6 py-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setEditDrawerOpen(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={() => setEditDrawerOpen(false)}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}
