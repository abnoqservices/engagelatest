"use client";

import * as React from "react";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Upload,
  X,
  Save,
  CheckCircle,
  ArrowLeft,
  FileText,
  Eye,
  Plus
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import axiosClient from "@/lib/axiosClient";
import { showToast } from "@/lib/showToast";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useRouter, useSearchParams } from "next/navigation";

// ── Types ────────────────────────────────────────────────────────────────
interface Category {
  id: number;
  name: string;
  parent_id?: number | null;
  children: Category[];
}

interface ImageFile {
  id: string;
  url: string;
  file?: File;
  dbId?: number;
  s3_key?: string;
}

interface PdfFile {
  id: string;
  name: string;
  file?: File;
  url?: string;
  dbId?: number;
  s3_key?: string;
}

interface FormDataType {
  name: string;
  sku: string;
  category: string;
  price: string;
  description: string;
  videoUrl: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  urlSlug: string;
  isActive: boolean;
}

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const ALLOWED_DOC_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function EditProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id") ? Number(searchParams.get("id")) : null;

  const [formData, setFormData] = React.useState<FormDataType>({
    name: "",
    sku: "",
    category: "",
    price: "",
    description: "",
    videoUrl: "",
    metaTitle: "",
    metaDescription: "",
    keywords: [],
    urlSlug: "",
    isActive: true,
  });

  const [tags, setTags] = React.useState<string[]>([]);
  const [newTag, setNewTag] = React.useState("");
  const [newKeyword, setNewKeyword] = React.useState("");

  const [selectedImages, setSelectedImages] = React.useState<ImageFile[]>([]);
  const [pdfFiles, setPdfFiles] = React.useState<PdfFile[]>([]);

  const [deletedImages, setDeletedImages] = React.useState<number[]>([]);
  const [deletedPdfs, setDeletedPdfs] = React.useState<number[]>([]);

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [publishing, setPublishing] = React.useState(false);

  const [flatCategories, setFlatCategories] = React.useState<Category[]>([]);
  const [treeCategories, setTreeCategories] = React.useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = React.useState(false);

  // ── Load Categories ───────────────────────────────────────────────────
  React.useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await axiosClient.get("/product-categories");
        if (res.data.success && Array.isArray(res.data.data)) {
          const flat = res.data.data as Category[];
          setFlatCategories(flat);
          setTreeCategories(buildTree(flat));
        }
      } catch (err: any) {
        showToast(err.response?.data?.message || "Failed to load categories", "error");
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  const buildTree = (flat: Category[]): Category[] => {
    const map = new Map<number, Category>();
    const roots: Category[] = [];
    flat.forEach((cat) => map.set(cat.id, { ...cat, children: [] }));
    flat.forEach((cat) => {
      if (cat.parent_id && map.has(cat.parent_id)) {
        map.get(cat.parent_id)!.children.push(map.get(cat.id)!);
      } else {
        roots.push(map.get(cat.id)!);
      }
    });
    return roots;
  };

  const renderCategoryTree = (items: Category[], level = 0): React.ReactNode => {
    return items.map((cat) => (
      <React.Fragment key={cat.id}>
        <SelectItem value={cat.id.toString()}>
          <span style={{ paddingLeft: `${level * 20}px` }}>
            {level > 0 && "└─ "}
            {cat.name}
          </span>
        </SelectItem>
        {cat.children?.length > 0 && renderCategoryTree(cat.children, level + 1)}
      </React.Fragment>
    ));
  };

  // ── Load existing product ─────────────────────────────────────────────
  React.useEffect(() => {
    if (!productId) return;

    const loadProduct = async () => {
      setLoading(true);
      try {
        const [prodRes, imgRes, docRes] = await Promise.all([
          axiosClient.get(`/products/${productId}`),
          axiosClient.get(`/product-images?product_id=${productId}`),
          axiosClient.get(`/product-documents?product_id=${productId}`),
        ]);

        const p = prodRes.data.data;

        setFormData({
          name: p.name || "",
          sku: p.sku || "",
          category: p.category_id?.toString() || "",
          price: p.price?.toString() || "",
          description: p.description || "",
          videoUrl: p.video_url || "",
          metaTitle: p.meta_title || "",
          metaDescription: p.meta_description || "",
          keywords: p.keywords ? p.keywords.split(", ").filter(Boolean) : [],
          urlSlug: p.url_slug || "",
          isActive: p.is_active ?? true,
        });

        setTags(p.tags || []);

        setSelectedImages(
          (imgRes.data.data || []).map((img: any) => ({
            id: img.id.toString(),
            dbId: img.id,
            url: img.url,
            s3_key: img.s3_key,
          }))
        );

        setPdfFiles(
          (docRes.data.data || []).map((doc: any) => ({
            id: doc.id.toString(),
            dbId: doc.id,
            name: doc.name,
            url: doc.url,
            s3_key: doc.s3_key,
          }))
        );
      } catch (err: any) {
        showToast(err.response?.data?.message || "Failed to load product", "error");
        router.push("/products");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId, router]);

  // ── Auto-fill SEO when name/description changes ───────────────────────
  React.useEffect(() => {
    if (!formData.name.trim()) return;

    const name = formData.name.trim();

    setFormData((prev) => {
      const updates: Partial<FormDataType> = {};

      if (!prev.metaTitle) updates.metaTitle = name;
      if (!prev.urlSlug) updates.urlSlug = slugify(name);

      if (!prev.metaDescription) {
        if (prev.description?.trim()) {
          const desc = prev.description.trim();
          updates.metaDescription = desc.length > 160 ? desc.slice(0, 157) + "..." : desc;
        } else {
          updates.metaDescription = `Buy ${name} online - Best price and quality.`;
        }
      }

      return { ...prev, ...updates };
    });
  }, [formData.name, formData.description]);

  // ── Helpers ────────────────────────────────────────────────────────────
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");

  const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;
  const countCharacters = (text: string) => text.length;

  // ── Tags & Keywords handlers ──────────────────────────────────────────
  const addTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !tags.includes(trimmed)) setTags((prev) => [...prev, trimmed]);
    setNewTag("");
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && newTag === "" && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const addKeyword = () => {
    const trimmed = newKeyword.trim();
    if (trimmed && !formData.keywords.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, trimmed],
      }));
    }
    setNewKeyword("");
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      addKeyword();
    }
    if (e.key === "Backspace" && newKeyword === "" && formData.keywords.length > 0) {
      setFormData((prev) => ({
        ...prev,
        keywords: prev.keywords.slice(0, -1),
      }));
    }
  };

  // ── File handlers ──────────────────────────────────────────────────────
  const validateImage = async (file: File): Promise<boolean> => {
    // Type check
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      showToast("Only JPG, JPEG, PNG allowed", "error");
      return false;
    }
  
    // Size check (1MB)
    if (file.size > MAX_FILE_SIZE) {
      showToast(`Image "${file.name}" must be ≤ 1MB`, "error");
      return false;
    }
  
    // Dimension check (square image)
    const isSquare = await new Promise<boolean>((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
  
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(img.width === img.height);
      };
  
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(false);
      };
  
      img.src = objectUrl;
    });
  
    if (!isSquare) {
      showToast("Image must be square (1:1 ratio)", "error");
      return false;
    }
  
    return true;
  };
  
  const validateDocument = (file: File) => {
    if (!ALLOWED_DOC_TYPES.includes(file.type)) {
      showToast("Only PDF, DOC, DOCX allowed", "error");
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      showToast(`File "${file.name}" > 1MB`, "error");
      return false;
    }
    return true;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const validFiles: File[] = [];
    for (const file of files) {
      if (await validateImage(file)) {
        validFiles.push(file);
      }
    }
    const newImgs = validFiles.map((file, i) => ({
      id: `new-${Date.now()}-${i}`,
      url: URL.createObjectURL(file),
      file,
    }));
    setSelectedImages((prev) => [...prev, ...newImgs]);
    e.target.value = "";
  };

  const removeImage = (id: string) => {
    setSelectedImages((prev) => {
      const found = prev.find((i) => i.id === id);
      if (found) {
        if (found.file) {
          URL.revokeObjectURL(found.url);
        }
        if (found.dbId) {
          setDeletedImages((del) => [...del, found.dbId!]);
        }
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const valid = Array.from(e.target.files).filter(validateDocument);
    const newDocs = valid.map((file, i) => ({
      id: `doc-${Date.now()}-${i}`,
      name: file.name,
      file,
    }));
    setPdfFiles((prev) => [...prev, ...newDocs]);
    e.target.value = "";
  };

  const removePdf = (id: string) => {
    setPdfFiles((prev) => {
      const found = prev.find((p) => p.id === id);
      if (found?.dbId) {
        setDeletedPdfs((del) => [...del, found.dbId!]);
      }
      return prev.filter((p) => p.id !== id);
    });
  };

  // ── Save / Publish logic ───────────────────────────────────────────────
  const saveProduct = async (shouldPublish = false) => {
    if (!formData.name.trim()) return showToast("Product name required", "error");
    if (!formData.category) return showToast("Category required", "error");


    const isNew = !productId;
    const currentId = productId || 0;

    setSaving(true);
    if (shouldPublish) setPublishing(true);

    try {
      // Get the active department ID from localStorage (the one shown in navbar)
      const selectedDepartmentId = localStorage.getItem("selectedDepartmentId");
      
      const basePayload: any = {
        name: formData.name.trim(),
        sku: formData.sku || undefined,
        category_id: parseInt(formData.category),
        price: parseFloat(formData.price),
        description: formData.description || null,
        is_active: formData.isActive,
        tags: tags.length ? tags : undefined,
        video_url: formData.videoUrl || null,
        meta_title: formData.metaTitle || formData.name,
        meta_description: formData.metaDescription || null,
        keywords: formData.keywords.join(", ") || null,
        url_slug: formData.urlSlug || slugify(formData.name),
        status: shouldPublish ? "published" : "draft",
      };
      
      // Always associate product with the active department (for new products)
      // For updates, department_id should already be set, but we can include it for consistency
      if (selectedDepartmentId) {
        basePayload.department_id = parseInt(selectedDepartmentId);
      }

      let id = currentId;

      if (isNew) {
        const res = await axiosClient.post("/products", basePayload);
        id = res.data?.data?.id || res.data?.id;
      } else {
        await axiosClient.put(`/products/${id}`, basePayload);
      }

      // Upload media if any new files
      const hasNewMedia =
        selectedImages.some((i) => !!i.file) || pdfFiles.some((p) => !!p.file);

      if (hasNewMedia) {
        const fd = new FormData();
        selectedImages.forEach((img) => img.file && fd.append("images[]", img.file));
        pdfFiles.forEach((pdf) => pdf.file && fd.append("pdfs[]", pdf.file));
        fd.append("_method", "PUT");
        await axiosClient.post(`/products/${id}`, fd);
      }

      // Delete removed media
      await Promise.all([
        ...deletedImages.map((imgId) => axiosClient.delete(`/product-images/${imgId}`)),
        ...deletedPdfs.map((docId) => axiosClient.delete(`/product-documents/${docId}`)),
      ]);

      // Clear deleted lists after successful deletion
      setDeletedImages([]);
      setDeletedPdfs([]);

      showToast(
        shouldPublish ? "Product published!" : "Product saved successfully",
        "success"
      );

      if (isNew && !shouldPublish) {
        router.replace(`/products/edit?id=${id}`);
      }

      return id;
    } catch (err: any) {
      showToast(err.response?.data?.message || "Save failed", "error");
      return null;
    } finally {
      setSaving(false);
      if (shouldPublish) setPublishing(false);
    }
  };

  const handleSaveDraft = () => saveProduct(false);
  const handlePublish = () => saveProduct(true);

  const handleSaveAndBack = async () => {
    const saved = await saveProduct(false);
    if (saved) {
      router.push("/products");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner className="size-10" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen  p-6">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {productId ? "Edit Product" : "Create New Product"}
              </h1>
              <p className="text-slate-600 mt-1">
                {productId ? "Update product details" : "Fill in the details below"}
              </p>
              {productId && (
                <p className="text-xs text-blue-600 mt-1">Product ID: {productId}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={handleSaveAndBack} disabled={saving}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Save & Back
              </Button>
              <Button variant="outline" onClick={handleSaveDraft} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={handlePublish}
                disabled={saving || publishing}
                className="bg-green-600 hover:bg-green-700"
              >
                {publishing || saving ? (
                  <Spinner className="mr-2" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Publish
              </Button>
            </div>
          </div>

          {/* ── Basic ──────────────────────────────────────────────────────── */}
          <div className="rounded-2xl  border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6  hover:shadow transition-shadow">

            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Product Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Wireless Noise Cancelling Headphones"
                  />
                </div>
                <div className="space-y-2">
                  <Label>SKU (optional)</Label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => setFormData((p) => ({ ...p, sku: e.target.value }))}
                    placeholder="e.g. HEADPHONE-X001"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
  <div className="space-y-2">
    <Label>Category *</Label>
    <div className="flex items-center gap-2">
     
        <Select
          value={formData.category}
          onValueChange={(v) => setFormData((p) => ({ ...p, category: v }))}
          disabled={loadingCategories}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>{renderCategoryTree(treeCategories)}</SelectContent>
        </Select>
      

      <Button
        type="button"
      
        size="icon"
        className="h-10 w-10"
        onClick={() => {
        router.push("/products/settings/product-category")
        }}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  </div>

  <div className="space-y-2">
    <Label>Price </Label>
    <Input
      type="number"
      value={formData.price}
      onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
      placeholder="0.00"
    />
  </div>
</div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  rows={5}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Describe your product in detail..."
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>
                  Tags <span className="text-xs text-muted-foreground">(space or enter to add)</span>
                </Label>
                <div
                  className={`
                    flex flex-wrap gap-2 p-2 border rounded-md bg-white 
                    focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2
                    min-h-[42px]
                  `}
                >
                  {tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="px-3 py-1 gap-1">
                      {tag}
                      <X
                        className="h-3.5 w-3.5 cursor-pointer hover:text-destructive"
                        onClick={() => setTags((prev) => prev.filter((_, idx) => idx !== i))}
                      />
                    </Badge>
                  ))}
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="e.g. wireless premium summer-sale"
                    className="flex-1 min-w-[180px] outline-none bg-transparent text-sm placeholder:text-muted-foreground"
                    style={{ border: "none" }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border p-4 rounded-lg">
                <div>
                  <p className="font-medium">Active</p>
                  <p className="text-sm text-muted-foreground">
                    Visible on site after publishing
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(c) => setFormData((p) => ({ ...p, isActive: c }))}
                />
              </div>
            </CardContent>
          </div>

          {/* ── Media ──────────────────────────────────────────────────────── */}
          <div className="rounded-2xl  border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6  hover:shadow transition-shadow">

            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Video URL (optional)</Label>
                <Input
                  value={formData.videoUrl}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, videoUrl: e.target.value }))
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div className="space-y-2">
                <Label>Product Images</Label>
                <p className="text-xs text-muted-foreground">
    Max size: <span className="font-medium">1MB</span> • Formats:
    <span className="font-medium"> JPG, JPEG, PNG</span> •
    Ratio: <span className="font-medium">1:1 (Square)</span>
  </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {selectedImages.map((img) => (
                    <div key={img.id} className="relative aspect-square group">
                      <img
                        src={img.url}
                        alt=""
                        className="w-full h-full object-cover rounded-lg border"
                      />
                      <button
                        onClick={() => removeImage(img.id)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Documents</Label>
                <p className="text-xs text-muted-foreground">
    Max size: <span className="font-medium">1MB</span> • Allowed formats:
    <span className="font-medium"> PDF, DOC, DOCX</span>
  </p>
                {pdfFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-red-600" />
                      <span className="text-sm truncate max-w-[300px]">{file.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removePdf(file.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    multiple
                    onChange={handlePdfUpload}
                    className="hidden"
                  />
                  <FileText className="h-10 w-10 text-muted-foreground mb-3" />
                  <span className="text-sm font-medium">Click to upload PDF / Word</span>
                </label>
              </div>
            </CardContent>
          </div>

          {/* ── SEO ────────────────────────────────────────────────────────── */}
          <div className="rounded-2xl  border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6  hover:shadow transition-shadow">

            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Meta Title</Label>
                  <div className="text-xs text-muted-foreground">
                    {countCharacters(formData.metaTitle)} / ~60 chars •{" "}
                    {countWords(formData.metaTitle)} words
                    {countCharacters(formData.metaTitle) > 70 && (
                      <span className="text-amber-600 ml-2">→ too long</span>
                    )}
                  </div>
                </div>
                <Input
                  value={formData.metaTitle}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, metaTitle: e.target.value }))
                  }
                  placeholder="Best Wireless Noise Cancelling Headphones 2025 | Brand"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Meta Description</Label>
                  <div className="text-xs text-muted-foreground">
                    {countCharacters(formData.metaDescription)} / ~160 chars •{" "}
                    {countWords(formData.metaDescription)} words
                    {countCharacters(formData.metaDescription) > 170 && (
                      <span className="text-amber-600 ml-2">→ will be truncated</span>
                    )}
                    {countCharacters(formData.metaDescription) > 0 &&
                      countCharacters(formData.metaDescription) < 100 && (
                        <span className="text-amber-600 ml-2">→ too short</span>
                      )}
                  </div>
                </div>
                <Textarea
                  rows={3}
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, metaDescription: e.target.value }))
                  }
                  placeholder="Discover premium wireless noise-cancelling headphones..."
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Keywords <span className="text-xs text-muted-foreground">(space to add)</span>
                </Label>
                <div
                  className={`
                    flex flex-wrap gap-2 p-2.5 border rounded-md bg-white
                    focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2
                    min-h-[42px]
                  `}
                >
                  {formData.keywords.map((kw, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="px-3 py-1 gap-1.5 text-sm"
                    >
                      {kw}
                      <X
                        className="h-3.5 w-3.5 cursor-pointer hover:text-destructive"
                        onClick={() =>
                          setFormData((p) => ({
                            ...p,
                            keywords: p.keywords.filter((_, idx) => idx !== i),
                          }))
                        }
                      />
                    </Badge>
                  ))}
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={handleKeywordKeyDown}
                    placeholder="wireless noise-cancelling bluetooth premium ..."
                    className="flex-1 min-w-[180px] outline-none bg-transparent text-sm placeholder:text-muted-foreground"
                    style={{ border: "none" }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>URL Slug</Label>
                <Input
                  value={formData.urlSlug}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, urlSlug: e.target.value }))
                  }
                  placeholder="wireless-noise-cancelling-headphones"
                />
              </div>
            </CardContent>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function EditProductPage() {
  return (
    <Suspense fallback={<DashboardLayout><div className="flex items-center justify-center p-12"><Spinner /></div></DashboardLayout>}>
      <EditProductContent />
    </Suspense>
  );
}