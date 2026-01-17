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
  ExternalLink,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Save,
} from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Spinner } from "@/components/ui/spinner";
import axiosClient from "@/lib/axiosClient";
import { showToast } from "@/lib/showToast"

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
  base64?: string; 
}

interface PdfFile {
  id: string;
  name: string;
  file?: File;
  base64?: string; 
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

interface AlertType {
  type: "success" | "error" | "";
  message: string;
}

interface DraftData {
  formData: FormDataType;
  selectedImages: ImageFile[];
  pdfFiles: PdfFile[];
  tags: string[];
  timestamp: number;
}

const DRAFT_KEY = "product_draft_v1";

export default function NewProductPage(): React.ReactElement {
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

  const [productId, setProductId] = React.useState<number | null>(null);
  const [activeTab, setActiveTab] = React.useState<string>("basic");

  const [isSavingBasic, setIsSavingBasic] = React.useState(false);
  const [isSavingMedia, setIsSavingMedia] = React.useState(false);
  const [isSavingSEO, setIsSavingSEO] = React.useState(false);

  const [alertMessage, setAlertMessage] = React.useState<AlertType>({ type: "", message: "" });
  const [showPreview, setShowPreview] = React.useState(false);
  const [previewLoading, setPreviewLoading] = React.useState(false);


  const showAlert = (type: "success" | "error", message: string, duration = 5000) => {
    showToast(message, type);
    setTimeout(() => setAlertMessage({ type: "", message: "" }), duration);
  };
  const handleInputChange = <K extends keyof FormDataType>(field: K, value: FormDataType[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateSafeSku = (name: string) => {
    if (!name) return "PROD" + Date.now().toString().slice(-6);
    return name.toUpperCase().replace(/\s+/g, "").slice(0, 10) + "001";
  };

  const slugify = (text: string) => {
    return (text || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  };

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
      showToast(err.response?.data?.message || "Failed to load categories","error");
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


  const saveDraft = () => {
    const draft: DraftData = {
      formData,
      selectedImages: selectedImages.map(img => ({
        ...img,
        base64: img.url.startsWith("data:") ? img.url : undefined,
      })),
      pdfFiles: pdfFiles.map(pdf => ({
        ...pdf,
        base64: pdf.file ? URL.createObjectURL(pdf.file).startsWith("data:") ? undefined : undefined : undefined,
      })),
      tags,
      timestamp: Date.now(),
    };

   
    const promises = selectedImages.map(async (img) => {
      if (img.file) {
        const base64 = await fileToBase64(img.file);
        return { ...img, base64 };
      }
      return img;
    });

    const pdfPromises = pdfFiles.map(async (pdf) => {
      if (pdf.file) {
        const base64 = await fileToBase64(pdf.file);
        return { ...pdf, base64 };
      }
      return pdf;
    });

    Promise.all([...promises, ...pdfPromises]).then((resolved) => {
      const [imagesResolved, pdfsResolved] = [resolved.slice(0, selectedImages.length), resolved.slice(selectedImages.length)];
      const fullDraft = {
        formData,
        selectedImages: imagesResolved,
        pdfFiles: pdfsResolved,
        tags,
        timestamp: Date.now(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(fullDraft));
      showToast( "Draft saved locally!","success");
    });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const loadDraft = () => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;

    try {
      const draft: DraftData = JSON.parse(raw);

      setFormData(draft.formData);
      setTags(draft.tags || []);

      // Restore images
      setSelectedImages(draft.selectedImages.map(img => ({
        ...img,
        url: img.base64 || img.url,
        file: undefined,
      })));

      // Restore PDFs
      setPdfFiles(draft.pdfFiles.map(pdf => ({
        ...pdf,
        file: undefined,
      })));

      showToast("Draft loaded from local storage!","success");
    } catch (err) {
      showToast("Failed to load draft","error");
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
  };

 
  React.useEffect(() => {
    if (!productId) {
      loadDraft();
    }
  }, []);

  // === File Uploads ===
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages: ImageFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      newImages.push({
        id: `img-${Date.now()}-${i}`,
        url,
        file,
      });
    }
    setSelectedImages((prev) => [...prev, ...newImages]);
    e.currentTarget.value = "";
  };

  const removeImage = (id: string) => {
    setSelectedImages((prev) => {
      const removed = prev.find((i) => i.id === id);
      if (removed?.url && removed.file) URL.revokeObjectURL(removed.url);
      return prev.filter((i) => i.id !== id);
    });
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newPdfs: PdfFile[] = Array.from(files).map((file, idx) => ({
      id: `pdf-${Date.now()}-${idx}`,
      name: file.name,
      file,
    }));
    setPdfFiles((prev) => [...prev, ...newPdfs]);
    e.currentTarget.value = "";
  };

  const removePdf = (id: string) => {
    setPdfFiles((prev) => prev.filter((p) => p.id !== id));
  };


  const handleSaveBasic = async () => {
    if (!formData.name.trim()) return showToast("Product name is required","error");
    if (!formData.category) return showToast("Category is required","error");
    if (!formData.price || isNaN(Number(formData.price))) return showToast("Valid price is required","error");

    setIsSavingBasic(true);
    try {
      const selectedCatId = parseInt(formData.category);

      const payload: any = {
        name: formData.name.trim(),
        sku: formData.sku || generateSafeSku(formData.name),
        category_id: selectedCatId,
        price: parseFloat(formData.price),
        description: formData.description || null,
        is_active: formData.isActive,
        status: "draft",
        tags: tags,
      };

      const response = await axiosClient.post("/products", payload);
      const newProductId = response.data?.data?.id || response.data?.id;

      if (!newProductId) throw new Error("No product ID returned");

      setProductId(newProductId);
      clearDraft(); 
      setActiveTab("media");
      showToast(`Product created successfully! ID: ${newProductId}. Now upload media.`,"success");
    } catch (error: any) {
      const msg = error?.response?.data?.message || error.message || "Failed to create product";
      showToast(`Failed to save basic info: ${msg}`,"error");
    } finally {
      setIsSavingBasic(false);
    }
  };

 
  const handleSaveMedia = async () => {
    if (!productId) {
      showToast("Product ID is required","error");
      return;
    }

    setIsSavingMedia(true);

    try {
      // Prepare FormData with files and other data
      const uploadFormData = new FormData();
      
      // Add video_url if provided
      if (formData.videoUrl) {
        uploadFormData.append("video_url", formData.videoUrl);
      }

      // Add image files
      selectedImages.forEach((img) => {
        if (img.file) {
          uploadFormData.append("images[]", img.file);
        }
      });

      // Add PDF files
      pdfFiles.forEach((pdf) => {
        if (pdf.file) {
          uploadFormData.append("pdfs[]", pdf.file);
        }
      });

      // Send to backend update endpoint
      // Use POST with _method=PUT for file uploads (Laravel handles this via method spoofing)
      uploadFormData.append("_method", "PUT");
      await axiosClient.post(`/products/${productId}`, uploadFormData);

      setActiveTab("seo");
      showToast("All media uploaded and linked successfully!","success");
    } catch (error: any) {
      console.error("Media upload failed:", error);
      showToast(error?.response?.data?.message || error?.message || "Something went wrong while uploading media","error");
    } finally {
      setIsSavingMedia(false);
    }
  };

 
  const handlePublish = async () => {
    if (!productId) return showToast("Product not created","error");

    setIsSavingSEO(true);
    try {
      const payload = {
        video_url: formData.videoUrl || null,
        meta_title: formData.metaTitle || formData.name,
        meta_description: formData.metaDescription || formData.description?.slice(0, 160),
        keywords: formData.keywords || null,
        url_slug: formData.urlSlug || slugify(formData.name),
        status: "published",
      };

      await axiosClient.put(`/products/${productId}`, payload);

      clearDraft(); 
      showToast("Product published successfully!","success");
    } catch (error: any) {
      const msg = error?.response?.data?.message || error.message || "Publish failed";
      showToast(`Publish failed: ${msg}`,"error");
    } finally {
      setIsSavingSEO(false);
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

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
         

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Add New Product</h1>
              <p className="text-sm text-slate-600 mt-1">Step-by-step product creation</p>
              {productId && <p className="text-xs text-blue-600 mt-1">Product ID: {productId}</p>}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={saveDraft} disabled={!!productId}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button variant="outline" onClick={handlePreview} disabled={previewLoading}>
                {previewLoading ? <Spinner className="size-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                Preview
              </Button>
              {activeTab === "seo" && (
                <Button onClick={handlePublish} disabled={isSavingSEO} className="bg-green-600 hover:bg-green-700">
                  {isSavingSEO ? <Spinner className="size-4 mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                  Publish Product
                </Button>
              )}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic" disabled={false}>Basic Info</TabsTrigger>
              <TabsTrigger value="media" disabled={!productId}>Demo Media</TabsTrigger>
              <TabsTrigger value="seo" disabled={!productId || (selectedImages.length === 0 && pdfFiles.length === 0 && !formData.videoUrl)}>
                SEO & Publish
              </TabsTrigger>
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
                      <Select 
                        value={formData.category} 
                        onValueChange={(v) => handleInputChange("category", v)}
                        disabled={loadingCategories}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={loadingCategories ? "Loading categories..." : "Select category"}>
                            {loadingCategories ? "Loading..." : getSelectedCategoryName()}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="max-h-96">
                          {treeCategories.length > 0 ? (
                            renderCategoryTree(treeCategories)
                          ) : (
                            <div className="p-4 text-center text-muted-foreground">No categories found</div>
                          )}
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

                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={saveDraft} disabled={!!productId}>
                      <Save className="h-4 w-4 mr-2" /> Save as Draft
                    </Button>
                    <Button onClick={handleSaveBasic} disabled={isSavingBasic} size="lg">
                      {isSavingBasic ? <Spinner className="mr-2" /> : null}
                      Save & Continue to Media
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* === MEDIA === */}
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
                          <button onClick={() => removeImage(img.id)} className="absolute top-2 right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100">
                            <X className="h-3 w-3 text-white" />
                          </button>
                          {i === 0 && <Badge className="absolute bottom-2 left-2">Primary</Badge>}
                        </div>
                      ))}
                      <label className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed cursor-pointer">
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
                        <Button variant="ghost" size="sm" onClick={() => removePdf(pdf.id)}><X className="h-4 w-4" /></Button>
                      </div>
                    ))}
                    <label className="flex w-full items-center justify-center rounded-lg border-2 border-dashed p-8 cursor-pointer">
                      <input type="file" accept=".pdf" multiple onChange={handlePdfUpload} className="hidden" />
                      <div className="text-center">
                        <FileText className="mx-auto h-12 w-12 text-slate-400" />
                        <p className="mt-2 font-medium">Upload PDF</p>
                      </div>
                    </label>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveMedia} disabled={isSavingMedia || (selectedImages.length === 0 && pdfFiles.length === 0 && !formData.videoUrl)} size="lg">
                      {isSavingMedia ? <Spinner className="mr-2" /> : null}
                      Save Media & Continue to SEO
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* === SEO === */}
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
                    <Button variant="outline" onClick={() => setActiveTab("media")}>Back</Button>
                    <Button onClick={handlePublish} disabled={isSavingSEO} size="lg" className="bg-green-600">
                      {isSavingSEO ? <Spinner className="mr-2" /> : <CheckCircle className="h-5 w-5 mr-2" />}
                      Publish Product
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Enhanced Preview Dialog */}
          <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Product Preview</DialogTitle>
                <DialogDescription>Preview of your product as it will appear</DialogDescription>
              </DialogHeader>
              <div className="space-y-8 py-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">{formData.name || "Untitled Product"}</h3>
                  <p className="text-3xl font-semibold text-green-600">${formData.price || "0.00"}</p>
                  <p className="text-sm text-slate-600">Category: {getSelectedCategoryName()}</p>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, i) => (
                        <Badge key={i} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </div>

                {formData.description && (
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-slate-700 whitespace-pre-wrap">{formData.description}</p>
                  </div>
                )}

                {formData.videoUrl && (
                  <div>
                    <h4 className="font-semibold mb-2">Video</h4>
                    <div className="bg-slate-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center">
                      <p className="text-slate-500">Video: {formData.videoUrl}</p>
                    </div>
                  </div>
                )}

                {selectedImages.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-4">Images ({selectedImages.length})</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedImages.map((img, i) => (
                        <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border">
                          <img src={img.url} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                          {i === 0 && <Badge className="absolute top-2 left-2">Primary</Badge>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {pdfFiles.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">PDF Documents ({pdfFiles.length})</h4>
                    <div className="space-y-2">
                      {pdfFiles.map((pdf) => (
                        <div key={pdf.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <FileText className="h-6 w-6 text-red-600" />
                          <span className="font-medium">{pdf.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(formData.metaTitle || formData.metaDescription) && (
                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-4">SEO Preview</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Title:</strong> {formData.metaTitle || formData.name}</p>
                      <p><strong>Description:</strong> {formData.metaDescription || "No description"}</p>
                      <p><strong>Keywords:</strong> {formData.keywords || "None"}</p>
                      <p><strong>Slug:</strong> /{formData.urlSlug || slugify(formData.name)}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setShowPreview(false)}>Close</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </DashboardLayout>
  );
}