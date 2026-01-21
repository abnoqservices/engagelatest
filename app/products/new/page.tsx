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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Upload,
  X,
  Plus,
  Save,
  CheckCircle,
  ArrowLeft,
  FileText,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import axiosClient from "@/lib/axiosClient";
import { showToast } from "@/lib/showToast";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useRouter } from "next/navigation";

// ── Interfaces ──────────────────────────────────────────────────
interface Category {
  id: number;
  name: string;
  children: Category[];
  parent_id?: number;
}

interface ImageFile {
  id: string;
  url: string;
  file?: File;
}

interface PdfFile {
  id: string;
  name: string;
  file?: File;
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

export default function NewProductPage() {
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

  const [flatCategories, setFlatCategories] = React.useState<Category[]>([]);
  const [treeCategories, setTreeCategories] = React.useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = React.useState(false);

  const [selectedImages, setSelectedImages] = React.useState<ImageFile[]>([]);
  const [pdfFiles, setPdfFiles] = React.useState<PdfFile[]>([]);
  const [tags, setTags] = React.useState<string[]>([]);
  const [newTag, setNewTag] = React.useState("");

  const [productId, setProductId] = React.useState<number | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [newKeyword, setNewKeyword] = React.useState("");

  const router = useRouter();

  // ── Load Categories ─────────────────────────────────────────────
  React.useEffect(() => {
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

  // ── Auto-fill SEO fields when name changes ──────────────────────
  React.useEffect(() => {
    if (!formData.name.trim()) return;

    const name = formData.name.trim();

    setFormData((prev) => {
      const updates: Partial<FormDataType> = {};

      if (!prev.urlSlug) {
        updates.urlSlug = slugify(name);
      }

      if (!prev.metaTitle) {
        updates.metaTitle = name;
      }

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

  // ── Form handlers ───────────────────────────────────────────────
  const handleInputChange = <K extends keyof FormDataType>(
    field: K,
    value: FormDataType[K]
  ) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
  
      // 🔥 Auto-generate slug when product name changes
      if (field === "name" && typeof value === "string") {
        updated.slug = slugify(value);
      }
  
      return updated;
    });
  };
  

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // remove special chars
      .replace(/\s+/g, "-")         // spaces → hyphen
      .replace(/-+/g, "-");         // avoid multiple hyphens
  };

  const generateSafeSku = (name: string) =>
    name
      ? name.toUpperCase().replace(/\s+/g, "").slice(0, 10) + "001"
      : "PROD" + Date.now().toString().slice(-6);

  // ── Tags (space or Enter to add) ────────────────────────────────
 
  
  const removeTag = (index: number) => {
    setTags(prev => prev.filter((_, i) => i !== index));
  };
  // ── Keywords (space to add, backspace to remove last) ───────────


  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index),
    }));
  };
  // ── File validation & handlers (unchanged) ──────────────────────
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
  

  const validateDocument = (file: File): boolean => {
    if (!ALLOWED_DOC_TYPES.includes(file.type)) {
      showToast("Only PDF, DOC, DOCX files are allowed", "error");
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      showToast(`File "${file.name}" exceeds 1MB limit`, "error");
      return false;
    }
    return true;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const validFiles = Array.from(e.target.files).filter(validateImage);
    const newImages = validFiles.map((file, i) => ({
      id: `img-${Date.now()}-${i}`,
      url: URL.createObjectURL(file),
      file,
    }));
    setSelectedImages((prev) => [...prev, ...newImages]);
    e.currentTarget.value = "";
  };

  const removeImage = (id: string) => {
    setSelectedImages((prev) => {
      const removed = prev.find((i) => i.id === id);
      if (removed?.file) URL.revokeObjectURL(removed.url);
      return prev.filter((i) => i.id !== id);
    });
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const validFiles = Array.from(e.target.files).filter(validateDocument);
    const newDocs = validFiles.map((file, i) => ({
      id: `doc-${Date.now()}-${i}`,
      name: file.name,
      file,
    }));
    setPdfFiles((prev) => [...prev, ...newDocs]);
    e.currentTarget.value = "";
  };

  const removePdf = (id: string) => setPdfFiles((prev) => prev.filter((p) => p.id !== id));

  const resetForm = () => {
    setFormData({
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
    setSelectedImages([]);
    setPdfFiles([]);
    setTags([]);
    setProductId(null);
    setNewTag("");
  };

  // ── Save logic ──────────────────────────────────────────────────
  const saveProduct = async (shouldPublish = false) => {
    if (!formData.name.trim()) return showToast("Product name is required", "error");
    if (!formData.category) return showToast("Category is required", "error");


    setIsSaving(true);

    try {
      const payload: any = {
        name: formData.name.trim(),
        sku: formData.sku || generateSafeSku(formData.name),
        category_id: parseInt(formData.category),
        price: parseFloat(formData.price),
        description: formData.description || null,
        is_active: formData.isActive,
        tags,
        video_url: formData.videoUrl || null,
        meta_title: formData.metaTitle || formData.name,
        meta_description: formData.metaDescription || formData.description?.slice(0, 160) || null,
        keywords: formData.keywords.join(", ") || null,
        url_slug: formData.urlSlug || slugify(formData.name),
      };

      let response;
      let currentProductId = productId;

      if (!currentProductId) {
        response = await axiosClient.post("/products", {
          ...payload,
          status: shouldPublish ? "published" : "draft",
        });
        currentProductId = response.data?.data?.id || response.data?.id;
        setProductId(currentProductId);
      } else {
        payload.status = shouldPublish ? "published" : "draft";
        response = await axiosClient.put(`/products/${currentProductId}`, payload);
      }

      // Media upload
      if (selectedImages.length > 0 || pdfFiles.length > 0) {
        const formDataMedia = new FormData();
        selectedImages.forEach((img) => img.file && formDataMedia.append("images[]", img.file));
        pdfFiles.forEach((pdf) => pdf.file && formDataMedia.append("pdfs[]", pdf.file));

        if (formDataMedia.entries().next().done === false) {
          formDataMedia.append("_method", "PUT");
          await axiosClient.post(`/products/${currentProductId}`, formDataMedia);
        }
      }

      showToast(
        shouldPublish ? "Product published successfully!" : "Product saved successfully",
        "success"
      );

      return currentProductId;
    } catch (err: any) {
      const response = err.response?.data;
    
      let errorMessage = "Save failed";
    
      if (response?.errors) {
        // Convert validation errors to readable text
        errorMessage = Object.values(response.errors)
          .flat()
          .join("\n");
      } else if (response?.message) {
        errorMessage = response.message;
      }
    
      showToast(errorMessage, "error");
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    await saveProduct(true);
  };

  const handleSaveDraft = async () => {
    await saveProduct(false);
  };

  const handleSaveAndBack = async () => {
    const savedId = await saveProduct(false);
    if (savedId) {
      router.push("/products");
      showToast("Saved and returned to list", "success");
      resetForm();
    }
  };
  const handleAddCategory = () => {
    router.push("/products/settings/product-category");
  }
  const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;
  const countCharacters = (text: string) => text.length;
  return (
    <DashboardLayout>
      <div className="min-h-screen p-6">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-br  ">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Create New Product</h1>
              <p className="text-slate-600 mt-1">Fill in the details below</p>
              {productId && <p className="text-xs text-blue-600 mt-1">Product ID: {productId}</p>}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={handleSaveAndBack} disabled={isSaving}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Save & Back
              </Button>
              <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={handlePublish}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSaving ? <Spinner className="mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                Publish
              </Button>
            </div>
          </div>

          {/* Form Content */}
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="rounded-2xl  border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6  hover:shadow transition-shadow">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Product Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="e.g. Wireless Noise Cancelling Headphones"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SKU (optional)</Label>
                    <Input
                      value={formData.sku}
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                      placeholder="e.g. HEADPHONE-X001"
                    />
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  {/* Category + Add */}
                  <div className="space-y-2">
                    <Label>Category *</Label>

                    <div className="flex items-center gap-2">
                      {/* Category Dropdown */}
                      <Select
                        value={formData.category}
                        onValueChange={(v) => handleInputChange("category", v)}
                        disabled={loadingCategories}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue
                            placeholder={loadingCategories ? "Loading..." : "Select category"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {renderCategoryTree(treeCategories)}
                        </SelectContent>
                      </Select>

                      {/* Add Button */}
                      <Button
                        type="button"
                      
                        className="shrink-0"
                        onClick={handleAddCategory} // optional
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
              </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    rows={5}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe your product in detail..."
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
  <Label>Tags <span className="text-xs text-muted-foreground">(type and press space to add)</span></Label>

  <div 
    className={`
      flex flex-wrap gap-2 p-2 border rounded-md bg-white 
      focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2
      min-h-[42px] transition-all
    `}
  >
    {tags.map((tag, i) => (
      <Badge 
        key={i} 
        variant="secondary" 
        className="gap-1 px-3 py-1 text-sm whitespace-nowrap"
      >
        {tag}
        <X 
          className="h-3.5 w-3.5 cursor-pointer hover:text-destructive" 
          onClick={() => removeTag(i)} 
        />
      </Badge>
    ))}

    <input
      type="text"
      placeholder="e.g. wireless bluetooth premium summer-sale ..."
      value={newTag}
      onChange={(e) => setNewTag(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          const trimmed = newTag.trim();
          if (trimmed && !tags.includes(trimmed)) {
            setTags(prev => [...prev, trimmed]);
          }
          setNewTag("");
        }
        if (e.key === "Backspace" && newTag === "" && tags.length > 0) {
          setTags(prev => prev.slice(0, -1));
        }
      }}
      className={`
        flex-1 min-w-[180px] outline-none bg-transparent 
        placeholder:text-muted-foreground text-sm
      `}
      style={{ border: 'none' }}
    />
  </div>
</div>

                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div>
                    <p className="font-medium">Active</p>
                    <p className="text-sm text-muted-foreground">Visible on site after publishing</p>
                  </div>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(c) => handleInputChange("isActive", c)}
                  />
                </div>
              </CardContent>
            </div>

            {/* Media */}
            <div className="rounded-2xl  border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6  hover:shadow transition-shadow">
              <CardHeader>
                <CardTitle>Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label>Video URL (optional)</Label>
                  <Input
                    value={formData.videoUrl}
                    onChange={(e) => handleInputChange("videoUrl", e.target.value)}
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
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-red-600" />
                        <span className="text-sm truncate max-w-[240px]">{file.name}</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removePdf(file.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      multiple
                      onChange={handlePdfUpload}
                      className="hidden"
                    />
                    <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                    <span className="text-sm font-medium">Click to upload PDF / Word</span>
                  </label>
                </div>
              </CardContent>
            </div>

            {/* SEO */}
            <div className="rounded-2xl  border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6  hover:shadow transition-shadow">

              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
              <div className="space-y-2">
  <div className="flex justify-between items-center">
    <Label>Meta Title</Label>
    <div className="text-xs text-muted-foreground">
      {countCharacters(formData.metaTitle)} / ~60 chars • {countWords(formData.metaTitle)} words
      {countCharacters(formData.metaTitle) > 70 && (
        <span className="text-amber-600 ml-2">→ too long</span>
      )}
    </div>
  </div>
  <Input
    value={formData.metaTitle}
    onChange={(e) => handleInputChange("metaTitle", e.target.value)}
    placeholder=""
  />
</div>

{/* Meta Description */}
<div className="space-y-2">
  <div className="flex justify-between items-center">
    <Label>Meta Description</Label>
    <div className="text-xs text-muted-foreground">
      {countCharacters(formData.metaDescription)} / ~160 chars • {countWords(formData.metaDescription)} words
      {countCharacters(formData.metaDescription) > 170 && (
        <span className="text-amber-600 ml-2">→ will be truncated</span>
      )}
      {countCharacters(formData.metaDescription) > 0 && countCharacters(formData.metaDescription) < 100 && (
        <span className="text-amber-600 ml-2">→ too short</span>
      )}
    </div>
  </div>
  <Textarea
    rows={3}
    value={formData.metaDescription}
    onChange={(e) => handleInputChange("metaDescription", e.target.value)}
    placeholder=""
  />
</div>
                <div className="space-y-2">
  <Label>Keywords <span className="text-xs text-muted-foreground">(type and press space to add)</span></Label>

  <div
    className={`
      flex flex-wrap gap-2 p-2.5 border rounded-md bg-white
      focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2
      focus-within:border-ring transition-all min-h-[42px]
    `}
  >
    {formData.keywords.map((kw, index) => (
      <Badge
        key={index}
        variant="secondary"
        className="text-sm px-3 py-1 gap-1.5 flex items-center whitespace-nowrap"
      >
        {kw}
        <X
          className="h-3.5 w-3.5 cursor-pointer hover:text-destructive transition-colors"
          onClick={() => removeKeyword(index)}
        />
      </Badge>
    ))}

    <input
      type="text"
      placeholder=""
      value={newKeyword}   // ← you'll need a separate state for current typing
      onChange={(e) => setNewKeyword(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          const trimmed = newKeyword.trim();
          if (trimmed && !formData.keywords.includes(trimmed)) {
            setFormData(prev => ({
              ...prev,
              keywords: [...prev.keywords, trimmed]
            }));
          }
          setNewKeyword("");
        }

        if (e.key === "Backspace" && newKeyword === "" && formData.keywords.length > 0) {
          setFormData(prev => ({
            ...prev,
            keywords: prev.keywords.slice(0, -1)
          }));
        }
      }}
      className={`
        flex-1 min-w-[180px] outline-none bg-transparent text-sm
        placeholder:text-muted-foreground
      `}
      style={{ border: 'none' }}
    />
  </div>
</div>

                <div className="space-y-2">
                  <Label>URL Slug</Label>
                  <Input
                    value={formData.urlSlug}
                    onChange={(e) => handleInputChange("urlSlug", e.target.value)}
                    placeholder=""
                  />
                </div>
              </CardContent>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}