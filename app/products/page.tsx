"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
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
  Trash2,
  ChevronLeft,
  ChevronRight,
  Globe,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import axiosClient from "@/lib/axiosClient";
import { useToast } from "@/components/ui/use-toast";

type Category = {
  id: number;
  name: string;
  children?: Category[];
};

type Product = {
  id: number;
  image: string;
  name: string;
  sku: string;
  category: string;
  categoryId: number;
  price: string;
  scans: number;
  views: number;
  leads: number;
  status: boolean;
  description?: string;
};

export default function ProductsPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [totalItems, setTotalItems] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  // Edit Drawer State
  const [editDrawerOpen, setEditDrawerOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const router = useRouter();
  // Form states for edit drawer
  const [formData, setFormData] = React.useState({
    name: "",
    sku: "",
    price: "",
    categoryId: "none", // "none" represents no category
    description: "",
    is_active: true,
  });

  const { toast } = useToast();

  const allSelected = selectedProducts.length === products.length && products.length > 0;
  const someSelected = selectedProducts.length > 0 && !allSelected;

  // Load Categories
  const loadCategories = async () => {
    try {
      const res = await axiosClient.get("/product-categories");
      if (res.data.success) {
        setCategories(res.data.data || []);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to load categories",
        variant: "destructive",
      });
    }
  };

  // Fetch Products List
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page,
        per_page: perPage,
      };

      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (categoryFilter !== "all") params.category_id = categoryFilter;
      if (statusFilter !== "all") params.is_active = statusFilter === "active" ? 1 : 0;

      const res = await axiosClient.get("/products", { params });

      if (res.data.success && res.data.data) {
        const apiData = res.data.data.data || [];
        const pagination = res.data.data;

        const productData: Product[] = apiData.map((item: any) => ({
          id: item.id,
          image: item.images?.[0]?.url || "https://www.thekeepingroomnc.com/wp-content/uploads/2020/04/image-placeholder.jpg",
          name: item.name,
          sku: item.sku || "N/A",
          category: item.category?.name || "Uncategorized",
          categoryId: item.category?.id || 0,
          price: item.price ? `$${parseFloat(item.price).toFixed(2)}` : "$0.00",
          scans: item.scans || 0,
          views: item.views || 0,
          leads: item.leads || 0,
          status: item.is_active ?? true,
          description: item.description,
        }));

        setProducts(productData);
        setTotalItems(pagination.total || pagination.meta?.total || productData.length);
      }
    } catch (e: any) {
      console.error("Failed to fetch products", e);
      toast({
        title: "Error",
        description: e.response?.data?.message || "Failed to load products",
        variant: "destructive",
      });
      setProducts([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Load full product for editing
  const loadProductForEdit = async (productId: number) => {
    try {
      const res = await axiosClient.get(`/products/${productId}`);
      if (res.data.success) {
        const item = res.data.data;
        setFormData({
          name: item.name || "",
          sku: item.sku || "",
          price: item.price?.toString() || "",
          // If there is no category_id or category.id → "none", otherwise convert to string
          categoryId: item.category_id || item.category?.id ? String(item.category_id ?? item.category?.id) : "none",
          description: item.description || "",
          is_active: item.is_active ?? true,
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to load product details",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Save edited product
  const saveProduct = async () => {
    if (!editingProduct) return;
    setIsSaving(true);
    try {
      const priceValue = formData.price.trim();
      const categoryId = formData.categoryId === "none" ? null : formData.categoryId ? parseInt(formData.categoryId) : null;

      const payload: any = {
        name: formData.name,
        sku: formData.sku,
        price: priceValue ? parseFloat(priceValue) : null,
        category_id: categoryId,
        description: formData.description,
        is_active: formData.is_active,
      };

      const res = await axiosClient.put(`/products/${editingProduct.id}`, payload);

      if (res.data.success) {
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
        setEditDrawerOpen(false);
        fetchProducts(); // Refresh list
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update product",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete single product
  const deleteProduct = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

    setIsDeleting(true);
    try {
      await axiosClient.delete(`/products/${productId}`);
      toast({
        title: "Deleted",
        description: "Product deleted successfully",
      });
      fetchProducts();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to delete product",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Effects
  React.useEffect(() => {
    fetchProducts();
  }, [page, perPage, searchQuery, categoryFilter, statusFilter]);

  React.useEffect(() => {
    loadCategories();
  }, []);

  React.useEffect(() => {
    setPage(1);
  }, [searchQuery, categoryFilter, statusFilter, perPage]);

  // Selection Handlers
  const toggleAll = () => {
    setSelectedProducts(allSelected ? [] : products.map(p => p.id.toString()));
  };

  const toggleProduct = (id: number) => {
    const idStr = id.toString();
    setSelectedProducts(prev =>
      prev.includes(idStr) ? prev.filter(p => p !== idStr) : [...prev, idStr]
    );
  };

  const openEditDrawer = async (product: Product) => {
    setEditingProduct(product);
    try {
      await loadProductForEdit(product.id);
      setEditDrawerOpen(true);
    } catch (error) {
      console.error("Failed to open edit drawer:", error);
      // Toast already shown in loadProductForEdit
    }
  };

  const openfullupdate = async (product: Product) => {
     router.push(`/products/update?id=${product.id}`);
  };

  // Recursive Category Options
  // Recursive Category Options - FIXED for clean hierarchy
  const renderCategoryTree = (items: Category[], level = 0): React.ReactNode => {
    return items.map((cat) => (
      <React.Fragment key={cat.id}>
        <SelectItem value={cat.id.toString()}>
          <span style={{ paddingLeft: `${level * 20}px` }}>
            {level > 0 && "└─ "}
            {cat.name}
          </span>
        </SelectItem>
        {cat.children && cat.children.length > 0 && renderCategoryTree(cat.children, level + 1)}
      </React.Fragment>
    ));
  };
  const getSelectedCategoryName = () => {
    const findName = (cats: Category[]): string | undefined => {
      for (const cat of cats) {
        if (cat.id.toString() === formData.category) return cat.name;
        if (cat.children.length > 0) {
          const found = findName(cat.children);
          if (found) return found;
        }
      }
    };
    return findName(categories) || "Select category";
  };
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / perPage) : 1;
  const startItem = totalItems === 0 ? 0 : (page - 1) * perPage + 1;
  const endItem = Math.min(page * perPage, totalItems);

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
                placeholder="Search by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {renderCategoryTree(categories)}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" disabled>
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
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {selectedProducts.length > 0 && (
            <div className="flex items-center gap-3 rounded-lg bg-primary/10 px-4 py-2 text-sm">
              <span className="font-medium text-primary">
                {selectedProducts.length} selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Bulk Edit</Button>
                <Button variant="outline" size="sm">Generate QRs</Button>
                <Button variant="outline" size="sm">Export</Button>
                <Button variant="outline" size="sm" className="text-destructive">
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
                  <Checkbox
                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                    onCheckedChange={toggleAll}
                  />
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-10">
                    Loading products...
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-10 text-muted-foreground">
                    {searchQuery || categoryFilter !== "all" || statusFilter !== "all"
                      ? "No products match your filters"
                      : "No products found"}
                  </TableCell>
                </TableRow>
              ) : (
                products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(p.id.toString())}
                        onCheckedChange={() => toggleProduct(p.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Image
                        src={p.image}
                        alt={p.name}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => openEditDrawer(p)}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {p.name}
                      </button>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{p.sku}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{p.category}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">{p.price}</TableCell>
                    <TableCell className="text-center">{p.scans}</TableCell>
                    <TableCell className="text-center">{p.views}</TableCell>
                    <TableCell className="text-center">{p.leads}</TableCell>
                    <TableCell className="text-center">
                      <Switch checked={p.status} disabled />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openfullupdate(p)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" /> Clone
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <QrCode className="mr-2 h-4 w-4" /> QR Code
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/products/${p.id}/landing-page`}>
                              <Globe className="mr-2 h-4 w-4" /> Landing Page
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => deleteProduct(p.id)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t bg-card px-6 py-4">
          <div className="text-sm text-muted-foreground">
            {totalItems > 0 ? (
              <>Showing <strong>{startItem}–{endItem}</strong> of <strong>{totalItems}</strong> products</>
            ) : (
              "No products to display"
            )}
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={perPage.toString()}
              onValueChange={(v) => setPerPage(Number(v))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 / page</SelectItem>
                <SelectItem value="20">20 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
                <SelectItem value="100">100 / page</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage(p => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled={page >= totalPages || isLoading}
                onClick={() => setPage(p => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Drawer */}
      <Sheet open={editDrawerOpen} onOpenChange={setEditDrawerOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <div className="sticky top-0 bg-background border-b z-10">
            <SheetHeader className="px-6 py-4">
              <SheetTitle className="text-2xl font-bold">Edit Product</SheetTitle>
              <SheetDescription>Update product information</SheetDescription>
            </SheetHeader>
          </div>

          <div className="space-y-6 p-6">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Category</SelectItem>
                    {renderCategoryTree(categories)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="status"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="status">Active</Label>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t sticky bottom-0 bg-background">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setEditDrawerOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={saveProduct}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}