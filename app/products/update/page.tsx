"use client";

import * as React from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Upload,
  X,
  Plus,
  Eye,
  FileText,
  CheckCircle,
  Save,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import axiosClient from "@/lib/axiosClient";
import { showToast } from "@/lib/showToast";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/layout";

// === Types ===
interface Category {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  parent_id?: number | null;
  children: Category[];
}

interface ImageFile {
  id: string;
  url: string;
  file?: File;
  s3_key?: string;
  position?: number;
  dbId?: number;
}

interface PdfFile {
  id: string;
  name: string;
  file?: File;
  url?: string;
  s3_key?: string;
  dbId?: number;
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
  keywords: string;
  urlSlug: string;
  isActive: boolean;
}

export default function ProductPage(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlProductId = searchParams.get("id");

  const isEditMode = !!urlProductId;
  const productId = isEditMode ? Number(urlProductId) : null;

  const [formData, setFormData] = React.useState<FormDataType>({
    name: "",
    sku: "",
    category: "",
    price: "",
    description: "",
    videoUrl: "",
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    urlSlug: "",
    isActive: true,
  });

  const [flatCategories, setFlatCategories] = React.useState<Category[]>([]);
  const [treeCategories, setTreeCategories] = React.useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = React.useState(false);

  const [selectedImages, setSelectedImages] = React.useState<ImageFile[]>([]);
  const [pdfFiles, setPdfFiles] = React.useState<PdfFile[]>([]);
  const [tags, setTags] = React.useState<string[]>([]);
  const [newTag, setNewTag] = React.useState<string>("");

  const [activeTab, setActiveTab] = React.useState<string>("basic");
  const [loading, setLoading] = React.useState(false);
  const [savingBasic, setSavingBasic] = React.useState(false);
  const [savingMedia, setSavingMedia] = React.useState(false);
  const [publishing, setPublishing] = React.useState(false);

  const [showPreview, setShowPreview] = React.useState(false);
  const [previewLoading, setPreviewLoading] = React.useState(false);

  const showAlert = (message: string, type: "success" | "error") => {
    showToast(message, type);
  };

  const handleInputChange = <K extends keyof FormDataType>(
    field: K,
    value: FormDataType[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const slugify = (text: string) =>
    (text || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");

  // === Category Tree ===
  const buildTree = (flat: Category[]): Category[] => {
    const map = new Map<number, Category>();
    const roots: Category[] = [];

    flat.forEach((cat) => {
      map.set(cat.id, { ...cat, children: [] });
    });

    flat.forEach((cat) => {
      if (cat.parent_id && map.has(cat.parent_id)) {
        map.get(cat.parent_id)!.children.push(map.get(cat.id)!);
      } else {
        roots.push(map.get(cat.id)!);
      }
    });

    return roots;
  };

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
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

  React.useEffect(() => {
    loadCategories();
  }, []);

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
  // === Load Product (Edit Mode) ===
  const loadProduct = async () => {
    if (!isEditMode || !productId) return;
    setLoading(true);
    try {
      const [productRes, imagesRes, docsRes] = await Promise.all([
        axiosClient.get(`/products/${productId}`),
        axiosClient.get(`/product-images?product_id=${productId}`),
        axiosClient.get(`/product-documents?product_id=${productId}`),
      ]);

      const product = productRes.data.data;

      setFormData({
        name: product.name || "",
        sku: product.sku || "",
        category: product.category_id?.toString() || "",
        price: product.price?.toString() || "",
        description: product.description || "",
        videoUrl: product.video_url || "",
        metaTitle: product.meta_title || "",
        metaDescription: product.meta_description || "",
        keywords: product.keywords || "",
        urlSlug: product.url_slug || "",
        isActive: product.is_active ?? true,
      });

      setTags(product.tags || []);

      const images = imagesRes.data.data || [];
      setSelectedImages(
        images.map((img: any) => ({
          id: img.id.toString(),
          dbId: img.id,
          url: img.url,
          s3_key: img.s3_key,
          position: img.position,
        }))
      );

      const docs = docsRes.data.data || [];
      setPdfFiles(
        docs.map((doc: any) => ({
          id: doc.id.toString(),
          dbId: doc.id,
          name: doc.name,
          url: doc.url,
          s3_key: doc.s3_key,
        }))
      );

      showToast("Product loaded successfully", "success");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to load product", "error");
      router.push("/products/new");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isEditMode && productId) {
      loadProduct();
    }
  }, [isEditMode, productId]);

  // === File Uploads ===
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages: ImageFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      newImages.push({
        id: `temp-${Date.now()}-${i}`,
        url,
        file,
      });
    }
    setSelectedImages((prev) => [...prev, ...newImages]);
    e.currentTarget.value = "";
  };

  const removeImage = async (id: string) => {
    const img = selectedImages.find((i) => i.id === id);
    if (img?.dbId) {
      try {
        await axiosClient.delete(`/product-images/${img.dbId}`);
        showToast("Image deleted", "success");
      } catch {
        showToast("Failed to delete image", "error");
        return;
      }
    }
    if (img?.file) URL.revokeObjectURL(img.url);
    setSelectedImages((prev) => prev.filter((i) => i.id !== id));
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newPdfs: PdfFile[] = Array.from(files).map((file, idx) => ({
      id: `temp-pdf-${Date.now()}-${idx}`,
      name: file.name,
      file,
    }));
    setPdfFiles((prev) => [...prev, ...newPdfs]);
    e.currentTarget.value = "";
  };

  const removePdf = async (id: string) => {
    const pdf = pdfFiles.find((p) => p.id === id);
    if (pdf?.dbId) {
      try {
        await axiosClient.delete(`/product-documents/${pdf.dbId}`);
        showToast("Document deleted", "success");
      } catch {
        showToast("Failed to delete document", "error");
        return;
      }
    }
    setPdfFiles((prev) => prev.filter((p) => p.id !== id));
  };

  // === Save Basic ===
  const handleSaveBasic = async () => {
    if (!formData.name.trim()) return showToast("Product name is required", "error");
    if (!formData.category) return showToast("Category is required", "error");
    if (!formData.price || isNaN(Number(formData.price))) return showToast("Valid price required", "error");

    setSavingBasic(true);
    try {
      const payload: any = {
        name: formData.name.trim(),
        sku: formData.sku || undefined,
        category_id: parseInt(formData.category),
        price: parseFloat(formData.price),
        description: formData.description || null,
        is_active: formData.isActive,
        tags: tags.length > 0 ? tags : undefined,
      };

      if (isEditMode) {
        await axiosClient.put(`/products/${productId}`, payload);
        showToast("Product updated successfully", "success");
      } else {
        payload.status = "draft";
        const res = await axiosClient.post("/products", payload);
        const newId = res.data?.data?.id || res.data?.id;
        if (newId) {
          router.replace(`/products/edit?id=${newId}`);
          showToast("Product created! Now upload media.", "success");
        }
      }
      setActiveTab("media");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Save failed", "error");
    } finally {
      setSavingBasic(false);
    }
  };

  // === Save Media ===
  const handleSaveMedia = async () => {
    if (!productId) {
      showToast("Product ID is required", "error");
      return;
    }

    setSavingMedia(true);
    try {
      // Prepare FormData with files and other data
      const uploadFormData = new FormData();
      
      // Add video_url if provided
      if (formData.videoUrl) {
        uploadFormData.append("video_url", formData.videoUrl);
      }

      // Add only new image files (those with .file property)
      let imageCount = 0;
      selectedImages.forEach((img) => {
        if (img.file) {
          uploadFormData.append("images[]", img.file);
          imageCount++;
          console.log("Adding image file:", img.file.name, img.file.type, img.file.size);
        }
      });

      // Add only new PDF files (those with .file property)
      let pdfCount = 0;
      pdfFiles.forEach((pdf) => {
        if (pdf.file) {
          uploadFormData.append("pdfs[]", pdf.file);
          pdfCount++;
          console.log("Adding PDF file:", pdf.file.name, pdf.file.type, pdf.file.size);
        }
      });

      console.log(`Uploading ${imageCount} images and ${pdfCount} PDFs to product ${productId}`);
      
      // Log FormData contents for debugging
      for (const pair of uploadFormData.entries()) {
        if (pair[1] instanceof File) {
          console.log(`FormData entry: ${pair[0]} = File(${pair[1].name}, ${pair[1].size} bytes)`);
        } else {
          console.log(`FormData entry: ${pair[0]} = ${pair[1]}`);
        }
      }

      // Send to backend update endpoint
      // Use POST with _method=PUT for file uploads (Laravel handles this via method spoofing)
      uploadFormData.append("_method", "PUT");
      const response = await axiosClient.post(`/products/${productId}`, uploadFormData);

      // Update state to clear file objects and keep only uploaded files
      // Convert files to URLs for already uploaded items
      setSelectedImages((prev) => 
        prev.map((img) => {
          if (img.file) {
            // Find the uploaded image from response
            const uploadedImage = response.data?.data?.images?.find((uploaded: any) => 
              uploaded.name === img.file?.name || img.id.toString().includes(uploaded.id.toString())
            );
            if (uploadedImage) {
              return {
                id: uploadedImage.id.toString(),
                dbId: uploadedImage.id,
                url: uploadedImage.url,
                s3_key: uploadedImage.s3_key,
                position: uploadedImage.position,
              };
            }
          }
          return img;
        }).filter((img) => img.file || img.url) // Keep files or existing URLs
      );

      setPdfFiles((prev) =>
        prev.map((pdf) => {
          if (pdf.file) {
            // Find the uploaded PDF from response
            const uploadedPdf = response.data?.data?.documents?.find((uploaded: any) =>
              uploaded.name === pdf.file?.name || pdf.id.toString().includes(uploaded.id.toString())
            );
            if (uploadedPdf) {
              return {
                id: uploadedPdf.id.toString(),
                dbId: uploadedPdf.id,
                name: uploadedPdf.name,
                url: uploadedPdf.url,
                s3_key: uploadedPdf.s3_key,
              };
            }
          }
          return pdf;
        }).filter((pdf) => pdf.file || pdf.url) // Keep files or existing URLs
      );

      // Reload product data to ensure we have the latest from server
      await loadProduct();

      showToast("Media uploaded and saved successfully!", "success");
      setActiveTab("seo");
    } catch (err: any) {
      showToast(err?.response?.data?.message || err?.message || "Media upload failed", "error");
    } finally {
      setSavingMedia(false);
    }
  };

  // === Publish ===
  const handlePublish = async () => {
    if (!productId) return;

    setPublishing(true);
    try {
      const payload: any = {
        video_url: formData.videoUrl || null,
        meta_title: formData.metaTitle || formData.name,
        meta_description: formData.metaDescription || formData.description?.slice(0, 160),
        keywords: formData.keywords || null,
        url_slug: formData.urlSlug || slugify(formData.name),
        status: "published",
      };

      await axiosClient.put(`/products/${productId}`, payload);
      showToast("Product published successfully!", "success");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Publish failed", "error");
    } finally {
      setPublishing(false);
    }
  };

  const handlePreview = () => {
    setPreviewLoading(true);
    setTimeout(() => {
      setPreviewLoading(false);
      setShowPreview(true);
    }, 600);
  };

  const handleAddTag = () => {
    const tag = newTag.trim();
    if (tag && !tags.includes(tag)) {
      setTags((prev) => [...prev, tag]);
      setNewTag("");
    }
  };

  const removeTag = (idx: number) => {
    setTags((prev) => prev.filter((_, i) => i !== idx));
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
    return findName(treeCategories) || "Select category";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner className="size-8" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {isEditMode ? "Edit Product" : "Add New Product"}
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                {isEditMode ? `Product ID: ${productId}` : "Step-by-step product creation"}
              </p>
            </div>

            <div className="flex gap-2">
              {!isEditMode && (
                <Button variant="outline" disabled>
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
              )}
              <Button variant="outline" onClick={handlePreview} disabled={previewLoading}>
                {previewLoading ? <Spinner className="size-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                Preview
              </Button>
              {activeTab === "seo" && productId && (
                <Button onClick={handlePublish} disabled={publishing} className="bg-green-600 hover:bg-green-700">
                  {publishing ? <Spinner className="size-4 mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                  Publish Product
                </Button>
              )}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="media" disabled={!productId}>Demo Media</TabsTrigger>
              <TabsTrigger value="seo" disabled={!productId}>SEO & Publish</TabsTrigger>
            </TabsList>

            {/* === BASIC INFO === */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                  <CardDescription>Fill in basic product information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input id="name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU (optional)</Label>
                      <Input id="sku" value={formData.sku} onChange={(e) => handleInputChange("sku", e.target.value)} />
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(v) => handleInputChange("category", v)} disabled={loadingCategories}>
                        <SelectTrigger>
                          <SelectValue placeholder={loadingCategories ? "Loading..." : "Select category"}>
                            {getSelectedCategoryName()}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="max-h-96">
                          {treeCategories.length > 0 ? renderCategoryTree(treeCategories) : <div className="p-4 text-center text-muted-foreground">No categories found</div>}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price *</Label>
                      <Input id="price" type="number" value={formData.price} onChange={(e) => handleInputChange("price", e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" rows={5} value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="gap-1">
                          {tag}
                          <button onClick={() => removeTag(i)}><X className="h-3 w-3" /></button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Add tag..." value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())} />
                      <Button onClick={handleAddTag} size="sm"><Plus className="h-4 w-4 mr-1" />Add</Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">Product Active</p>
                      <p className="text-sm text-slate-500">Visible to customers after publish</p>
                    </div>
                    <Switch checked={formData.isActive} onCheckedChange={(c) => handleInputChange("isActive", c)} />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button onClick={handleSaveBasic} disabled={savingBasic} size="lg">
                      {savingBasic ? <Spinner className="mr-2" /> : null}
                      {isEditMode ? "Update & Continue" : "Save & Continue to Media"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* === MEDIA TAB === */}
            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Demo Media</CardTitle>
                  <CardDescription>Upload images, PDFs, and video</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="video">Video URL (optional)</Label>
                    <Input id="video" placeholder="https://youtube.com/..." value={formData.videoUrl} onChange={(e) => handleInputChange("videoUrl", e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Product Images</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {selectedImages.map((img, i) => (
                        <div key={img.id} className="relative group aspect-square">
                          <img src={img.url} alt="" className="w-full h-full rounded-lg object-cover" />
                          <button onClick={() => removeImage(img.id)} className="absolute top-2 right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                            <X className="h-3 w-3 text-white" />
                          </button>
                          {i === 0 && <Badge className="absolute bottom-2 left-2">Primary</Badge>}
                        </div>
                      ))}
                      <label className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed cursor-pointer hover:bg-slate-50">
                        <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                        <Upload className="h-8 w-8 text-slate-400" />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>PDF Documents</Label>
                    {pdfFiles.map((pdf) => (
                      <div key={pdf.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-red-500" />
                          <span>{pdf.name}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removePdf(pdf.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <label className="flex w-full items-center justify-center rounded-lg border-2 border-dashed p-8 cursor-pointer hover:bg-slate-50">
                      <input type="file" accept=".pdf" multiple onChange={handlePdfUpload} className="hidden" />
                      <div className="text-center">
                        <FileText className="mx-auto h-12 w-12 text-slate-400" />
                        <p className="mt-2 font-medium">Upload PDF</p>
                      </div>
                    </label>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSaveMedia} disabled={savingMedia} size="lg">
                      {savingMedia ? <Spinner className="mr-2" /> : null}
                      Save Media & Continue to SEO
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* === SEO TAB === */}
            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO & Final Settings</CardTitle>
                  <CardDescription>Optimize for search engines and publish</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="meta-title">Meta Title</Label>
                    <Input id="meta-title" value={formData.metaTitle} onChange={(e) => handleInputChange("metaTitle", e.target.value)} />
                    <p className="text-xs text-slate-500">{formData.metaTitle.length}/60 characters</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meta-description">Meta Description</Label>
                    <Textarea id="meta-description" rows={3} value={formData.metaDescription} onChange={(e) => handleInputChange("metaDescription", e.target.value)} />
                    <p className="text-xs text-slate-500">{formData.metaDescription.length}/160 characters</p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="keywords">Keywords</Label>
                      <Input id="keywords" value={formData.keywords} onChange={(e) => handleInputChange("keywords", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="url-slug">URL Slug</Label>
                      <Input id="url-slug" value={formData.urlSlug} onChange={(e) => handleInputChange("urlSlug", e.target.value)} />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t">
                    <Button variant="outline" onClick={() => setActiveTab("media")}>Back to Media</Button>
                    <Button onClick={handlePublish} disabled={publishing} size="lg" className="bg-green-600 hover:bg-green-700">
                      {publishing ? <Spinner className="mr-2" /> : <CheckCircle className="h-5 w-5 mr-2" />}
                      Publish Product
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Preview Dialog */}
          <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Product Preview</DialogTitle>
                <DialogDescription>How your product will appear to customers</DialogDescription>
              </DialogHeader>
              {/* Add your preview content here if needed */}
              <div className="py-8 text-center text-muted-foreground">
                Preview content can be expanded here.
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </DashboardLayout>
  );
}