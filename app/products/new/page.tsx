"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Perview from "@/app/preview/page";

import {
  Upload,
  X,
  Plus,
  Save,
  GripVertical,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/components/dashboard/layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import axiosClient from "@/lib/axiosClient";
import { showToast } from "@/lib/showToast"
import { usePageStore } from "@/lib/pageStore";
import dynamic from "next/dynamic";
const Builder = dynamic(() => import("@/app/landing-pages/new/page.client"), {
  ssr: false,
});
// ==================== TEMPLATE SECTIONS ====================
const templateSections = {
  userId: 1,
  templateName: "modern",
  sections: [
    { 
      
      section: "ProductDetail", 
      label: "Product Detail (name + price)", 
      enabled: true,
    
    fields: [
      { name: "produtname", label: "Product Name", type: "text", required: true },
      { name: "pcategory", label: "Category", type: "text", required: true },
      { name: "psku", label: "SKU", type: "text", required: true },
      { name: "pprice", label: "Price", type: "text", required: true },
      { name: "productTag", label: "tags", type: "text", required: false }
    ]
  },
    { 
      
      section: "Header", 
      label: "Header (Logo + Title)", 
      enabled: true,
    
    fields: [
      { name: "logo", label: "Upload Logo", type: "image", required: true },
      { name: "title", label: "Site Title / Brand Name", type: "text", required: true },
      { name: "subtitle", label: "Sub title", type: "text", required: true }
    ]
  },
  
  
    { section: "sliderThree", label: "Tertiary Slider",   enabled: true,fields: [
      { name: "image", label: "Image", type: "image", multiple:'multiple',required: true },
      { name: "title", label: "Site Title / Brand Name", type: "text", required: true },
      { name: "subtitle", label: "Sub title", type: "text", required: true }
    ]},
  
    { section: "Description", label: "Description Block",   enabled: true,fields: [
      { name: "heading", label: "Heading", type: "text", required: true },
      { name: "description", label: "Description Text", type: "textarea", required: true },
    ]},
  
    {
      section: "Specification",
      label: "Product Specifications",
      enabled: true,
      fields: [
        {
          name: "specifications",
          label: "Specification List",
          type: "repeater",
          subFields: [
            { name: "label", label: "Title", type: "text", required: true },
            { name: "value", label: "Value", type: "text", required: true },
          ],
        },
      ],
    },
    {
      section: "Testimonial",
      label: "Customer Testimonials",
      enabled: true,
      fields: [
        {
          name: "Testimonial",
          label: "Testimonial List",
          type: "repeater",
          subFields: [
            { name: "image", label: "Image URL", type: "image", required: false },
            { name: "name", label: "Name", type: "text", required: true },
            { name: "designation", label: "Designation", type: "text", required: true },
            { name: "rating", label: "Rating (1–5)", type: "number", required: true },
            { name: "description", label: "Description", type: "textarea", required: true }
          ]
        }
      ]
    },
    
    { section: "YouTube", label: "YouTube Video",  enabled: true, fields: [
      { name: "videoUrl", label: "YouTube Embed URL", type: "url" }
    ]},
  
    { section: "CTA", label: "Call to Action Button",  enabled: true, fields: [
      { name: "ctaText", label: "Button Text", type: "text", required: true },
      { name: "ctaUrl", label: "Button URL", type: "url", required: true },
    ]},
  
    {
      section: "Social",
      label: "Social Links",
      enabled: true,
      fields: [
        { name: "facebook", label: "Facebook", type: "url" },
        { name: "instagram", label: "Instagram", type: "url" },
        { name: "youtube", label: "YouTube", type: "url" },
        { name: "twitter", label: "Twitter", type: "url" },
      ],
    },
  
    {
      section: "Contact",
      label: "Contact Info",
      enabled: true,
      fields: [
        { name: "phone", label: "Phone", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "address", label: "Address", type: "textarea" },
        { name: "directionButtonText", label: "Direction Button Text", type: "text" },
        { name: "directionUrl", label: "Direction URL", type: "url" },
      ],
    },
  ],
};


interface ImageFile {
  id: string;
  url: string;
  file?: File;
}

// ==================== MOBILE PREVIEW ====================


// ==================== MAIN PAGE ====================
export default function NewProductPage() {
  const { templateId, userId }  = usePageStore();
  const [productName, setProductName] = React.useState("iPhone 15 Pro Max");
  const [category, setCategory] = React.useState([]);
  const [sku, setSku] = React.useState("IPH15PRO");
  const [price, setPrice] = React.useState("999");

  const [images, setImages] = React.useState<ImageFile[]>([]);
  const [tags, setTags] = React.useState<string[]>([]);
  const [newTag, setNewTag] = React.useState("");

  const [metaTitle, setMetaTitle] = React.useState("");
  const [metaDescription, setMetaDescription] = React.useState("");
  const [keywords, setKeywords] = React.useState("");

  const [sectionsData, setSectionsData] = React.useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = React.useState("details");
  const [lastUpdate, setLastUpdate] = React.useState(Date.now());
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [publishStatus, setPublishStatus] = React.useState<"idle" | "success" | "error" | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = React.useState(false);
// Add this state near your other useState hooks
const [isMobilePreviewVisible, setIsMobilePreviewVisible] = React.useState(true);
const [selectedCategory, setSelectedCategory] = React.useState("");
const [isCustomizeModalOpen, setIsCustomizeModalOpen] = React.useState(false);
  const updateField = (section: string, field: string, value: any) => {
    setSectionsData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };


  const renderCategoryOptions = (
    items: any[],
    level = 0
  ): React.ReactNode[] => {
    return items.flatMap((cat, index) => {
      const uniqueKey = `${cat.id}-${level}-${index}`;
  
      const current = (
        <option key={uniqueKey} value={cat.id}>
          {"—".repeat(level)} {cat.name}
        </option>
      );
  
      const children = cat.children?.length
        ? renderCategoryOptions(cat.children, level + 1)
        : [];
  
      return [current, ...children];
    });
  };
  
  const loadCategories = async () => {
    try {
  
  
      const res = await axiosClient.get("/product-categories");
     if (res.data.success) {
          setCategory(res.data.data || []);
        }
      
  
    } catch (err: any) {
    
      showToast(
        err.response?.data?.message || "Failed to load categories",
        "error"
      );
    }
  };
  
  
  const addTag = () => {
    const t = newTag.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setNewTag("");
    }
  };

  // FINAL JSON – EXACT FORMAT YOU WANTED
  const buildFinalJson = () => {
    const sections = templateSections.sections
      .filter(sec => sec.enabled)
      .map(sec => {
        const data = sectionsData[sec.section] || {};
        const fields: any[] = [];
  
        sec.fields.forEach(field => {
          const value = data[field.name];
  
          // Skip empty
          if (!value || value === "" || (Array.isArray(value) && value.length === 0)) return;
  
          // IMAGE fields (logo, background, etc.)
          if (field.type === "image") {
            if (field.multiple && Array.isArray(value)) {
              value.forEach((img: ImageFile) => {
                if (img.url) fields.push({ name: field.name, url: img.url });
              });
            } else if (value?.url) {
              fields.push({ name: field.name, url: value.url });
            }
          }
          // REPEATER fields (specifications)
          else if (field.type === "repeater") {
            if (Array.isArray(value) && value.length > 0) {
              fields.push({ name: field.name, items: value });
            }
          }
          // TEXT, TEXTAREA, URL, EMAIL
          else {
            fields.push({ name: field.name, value: String(value) });
          }
        });
  
        return fields.length > 0 ? { section: sec.section, fields } : null;
      })
      .filter(Boolean);
  
    return {
      user_id: 1,
      templateName: "modern",
      product_id: Date.now(),
      name: productName || "New Product",
      category_id: selectedCategory || "Uncategorized",
      sku: sku || "N/A",
      price: price || "0",
      tag: tags,
      meta_title: metaTitle || "",
      meta_description : metaDescription || "",
      keywords: keywords || "",
      sections,
    };
  };

 // REPLACE your current liveData with THIS ONE
const liveData = React.useMemo(() => {
  return buildFinalJson(); // Now preview = JSON 100% identical!
}, [
 
  productName,
  selectedCategory,
  sku,
  price,
  tags,
  images,
  metaTitle,
  metaDescription,
  keywords,
  sectionsData
]);

const prevData = React.useRef(liveData);

React.useEffect(() => {
  loadCategories();
  prevData.current = liveData;
}, [sectionsData]);
const handlePublish = async () => {
  const payload = buildFinalJson();

  setIsPublishing(true);
  setPublishStatus(null);

  try {
    const response = await axiosClient.post("/products", payload);

    // Success
    showToast("Product published successfully!", "success");
    setPublishStatus("success");

    // Optional: show product ID if returned
    if (response.data?.id) {
      showToast(`Product ID: ${response.data.id}`, "info");
    }
  } catch (error: any) {
    setPublishStatus("error");

    const status = error.response?.status;
    const data = error.response?.data;
    const message = data?.message || "Something went wrong";

    // Handle common error cases with user-friendly messages
    if (status === 401) {
      showToast("Please log in again. Session expired.", "error");
    } 
    else if (status === 403) {
      showToast("Please verify your email before publishing.", "error");
    } 
    else if (status === 404) {
      showToast("API endpoint not found. Contact support.", "error");
    } 
    else if (status === 422) {
      // Validation Errors - Show field-specific messages
      const errors = data?.errors || {};
      const fieldNames = Object.keys(errors);

      if (fieldNames.length > 0) {
        fieldNames.forEach((field) => {
          const msgs = errors[field];
          msgs.forEach((msg: string) => {
            const friendlyField = field
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l: string) => l.toUpperCase());
            showToast(`${friendlyField}: ${msg}`, "error");
          });
        });
        showToast("Please fix the errors above", "error");
      } else {
        showToast("Validation failed. Check required fields.", "error");
      }
    } 
    else if (status >= 500) {
      showToast("Server error. Please try again later or contact support.", "error");
    } 
    else {
      showToast(message || "Failed to publish product", "error");
    }

    console.error("Publish error:", error);
  } finally {
    setIsPublishing(false);

    // Auto reset status after 5 seconds
    setTimeout(() => setPublishStatus(null), 5000);
  }
};

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
  <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Create Product Landing Page</h1>
      <p className="text-gray-600 mt-1">Fill details to see instant mobile preview</p>
    </div>

    <div className="flex gap-4 items-center">
      {/* Add this inside the header buttons group, next to Publish button */}
<Button
  variant="default"
  size="lg"
  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg"
  onClick={() => setIsCustomizeModalOpen(true)}
>
  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
  Customize Landing Page
</Button>
      {/* Optional: Keep Download JSON */}
      {/* <Button
        variant="outline"
        size="lg"
        onClick={() => {
          const data = buildFinalJson();
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${productName.replace(/\s+/g, "-").toLowerCase()}-landing.json`;
          a.click();
          URL.revokeObjectURL(url);
        }}
      >
        <Save className="h-5 w-5 mr-2" />
        Download JSON
      </Button> */}
     {/* Add this inside the header buttons group */}
     <Button
  variant="outline"
  size="lg"
  className="hidden sm:flex"
  onClick={() => setIsMobilePreviewVisible(!isMobilePreviewVisible)}
>
  {isMobilePreviewVisible ? (
    <>
      <X className="h-5 w-5 mr-2" />
      Hide Preview
    </>
  ) : (
    <>
      <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
      Mobile Preview
    </>
  )}
</Button>
      {/* NEW: Publish Button using axiosClient */}
      <Button
                size="lg"
                disabled={isPublishing}
                className={`
                  relative font-bold text-white shadow-xl transition-all
                  ${isPublishing ? "bg-gray-500 cursor-not-allowed" :
                    publishStatus === "success" ? "bg-green-600 hover:bg-green-700" :
                    "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"}
                `}
                onClick={handlePublish}
              >
                {isPublishing ? (
                  <>
                    <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Publishing...
                  </>
                ) : publishStatus === "success" ? (
                  "Published Successfully"
                ) : publishStatus === "error" ? (
                  "Retry"
                ) : (
                  <>
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5 5 5-5m-5 6V4" />
                    </svg>
                    Publish Live
                  </>
                )}
              </Button>
    </div>
  </div>
</div>

        <div className="w-full mx-auto">
        <div className={`grid grid-cols-1  gap-10 ${isMobilePreviewVisible ? "lg:grid-cols-2" : "grid-cols-1 "}`}>

            {/* LEFT: Editor */}
            <div className="space-y-8">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="details">Product Details</TabsTrigger>
                  <TabsTrigger value="sections">Sections</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                </TabsList>

                {/* Product Details Tab */}
                <TabsContent value="details" className="space-y-8">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-2xl font-semibold">Product Information & Media</CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-10">

                              {/* ==== Basic Product Info ==== */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
                                {/* Product Name */}
                                <div className="space-y-2">
                                  <Label htmlFor="product-name">
                                    Product Name <span className="text-red-600">*</span>
                                  </Label>
                                  <Input
                                    id="product-name"
                                    placeholder="Enter product name"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                  />
                                </div>

                                {/* Category */}
                                  <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>

                                    <select
                                      id="category"
                                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                      value={selectedCategory}
                                      onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                      <option value="">Select Category ...</option>
                                      {renderCategoryOptions(category)}
                                    </select>
                                  </div>


                                {/* SKU */}
                                <div className="space-y-2">
                                  <Label htmlFor="sku">SKU</Label>
                                  <Input
                                    id="sku"
                                    placeholder="e.g. PROD-001"
                                    value={sku}
                                    onChange={(e) => setSku(e.target.value)}
                                  />
                                </div>

                                {/* Price */}
                                <div className="space-y-2">
                                  <Label htmlFor="price">Price ($)</Label>
                                  <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="29.99"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                  />
                                </div>
                              </div>

                              {/* ==== Main Product Images (FIXED!) ==== */}
                            
                              {/* ==== Tags ==== */}
                              <div className="space-y-4">
                                <Label>Tags</Label>

                                <div className="flex flex-wrap gap-2">
                                  {tags.length === 0 ? (
                                    <span className="text-sm text-muted-foreground">No tags added yet</span>
                                  ) : (
                                    tags.map((t) => (
                                      <Badge
                                        key={t}
                                        variant="secondary"
                                        className="pl-3 pr-2 py-1.5 text-sm font-medium"
                                      >
                                        {t}
                                        <button
                          type="button"
                          onClick={() => setTags(tags.filter((x) => x !== t))}
                          className="ml-2 p-1 rounded hover:bg-gray-200 transition"
                        >
                          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </button>

                                      </Badge>
                                    ))
                                  )}
                                </div>

                                <div className="flex gap-3 max-w-md">
                                  <Input
                                    placeholder="Type a tag and press Enter"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" && newTag.trim()) {
                                        e.preventDefault();
                                        addTag();
                                      }
                                    }}
                                  />
                                  <Button onClick={addTag} disabled={!newTag.trim()}>
                                    Add Tag
                                  </Button>
                                </div>
                              </div>

                            </CardContent>
                          </Card>
                        </TabsContent>

                {/* Page Sections Tab */}
                <TabsContent value="sections" className="mt-6">
                      <Accordion type="single" collapsible className="space-y-4">
                        {templateSections.sections
                          .filter(sec => sec.enabled)
                          .map((sec, index, array) => (
                            <AccordionItem
                              key={sec.section}
                              value={sec.section}
                              className={`
                                border rounded-xl overflow-hidden
                                ${index === array.length - 1 ? "mb-0" : "mb-4"}
                                bg-white shadow-sm
                              `}
                            >
                              <AccordionTrigger className="px-6 py-5 text-lg font-semibold hover:no-underline bg-gray-50/50 hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-3">
                                  <GripVertical className="h-5 w-5 text-gray-400" />
                                  {sec.label}
                                </div>
                              </AccordionTrigger>

                              <AccordionContent className="px-6 pt-6 pb-8 bg-white border-t overflow-scroll">
                                <div className="space-y-8">
                                  {sec.fields.map(field => {
                                    const value = sectionsData[sec.section]?.[field.name];

                                    // IMAGE FIELD
                                    if (field.type === "image") {
                                      const imgs: ImageFile[] = field.multiple ? (value || []) : value ? [value] : [];

                                      return (
                                        <div key={field.name} className="space-y-3">
                                          <Label className="text-base font-medium">
                                            {field.label} {field.required && <span className="text-red-500">*</span>}
                                          </Label>
                                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {imgs.map(img => (
                                              <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                                                <img
                                                  src={img.url}
                                                  alt="Uploaded"
                                                  className="w-full h-full object-cover"
                                                />
                                                <button
                                                  onClick={() => {
                                                    const updated = imgs.filter(i => i.id !== img.id);
                                                    updateField(sec.section, field.name, field.multiple ? updated : null);
                                                  }}
                                                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover-opacity-100 transition-all hover:scale-110 shadow-lg"
                                                >
                                                  <X className="h-4 w-4" />
                                                </button>
                                              </div>
                                            ))}
                                            <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group">
                                              <Upload className="h-10 w-10 text-gray-400 group-hover:text-blue-600" />
                                              <span className="text-xs text-gray-500 mt-2">Upload</span>
                                              <input
                                                type="file"
                                                accept="image/*"
                                                multiple={field.multiple}
                                                className="hidden"

                                                onChange={e => {
                                                  if (!e.target.files) return;
                                                  const files = Array.from(e.target.files).map(file => ({
                                                    id: `sec-${Date.now()}-${Math.random().toString(36)}`,
                                                    url: URL.createObjectURL(file),
                                                    file,
                                                  }));
                                                  const current = field.multiple ? (value || []) : null;
                                                  const updated = field.multiple ? [...(current || []), ...files] : files[0] || null;
                                                  updateField(sec.section, field.name, updated);
                                                }}
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      );
                                    }

                                    // REPEATER FIELD
                                    if (field.type === "repeater") {
                                      const items: any[] = value || [];
                                      return (
                                        <div key={field.name} className="space-y-4">
                                          <Label className="text-base font-medium">{field.label}</Label>
                                          {items.map((item, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        {field.subFields?.map(sub => (
                          <div key={sub.name} className="flex-1 min-w-[200px]">
                            <Input
                              placeholder={sub.label}
                              value={item[sub.name] || ""}
                              onChange={e => {
                                const updated = items.map((obj, idx) =>
                                  idx === i ? { ...obj, [sub.name]: e.target.value } : obj
                                );
                                updateField(sec.section, field.name, updated);
                              }}
                              className="w-full"
                            />
                          </div>
                        ))}

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const updated = items.filter((_, idx) => idx !== i);
                            updateField(sec.section, field.name, updated);
                          }}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    ))}

                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              const empty = field.subFields!.reduce((o, f) => ({ ...o, [f.name]: "" }), {});
                                              updateField(sec.section, field.name, [...items, empty]);
                                            }}
                                            className="mt-2"
                                          >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Item
                                          </Button>
                                        </div>
                                      );
                                    }

                                    // TEXT / TEXTAREA / URL / EMAIL
                                    return (
                                      <div key={field.name} className="space-y-2">
                                        <Label className="text-base font-medium">
                                          {field.label} {field.required && <span className="text-red-500">*</span>}
                                        </Label>
                                        {field.type === "textarea" ? (
                                          <Textarea
                                            rows={4}
                                            value={value || ""}
                                            onChange={e => updateField(sec.section, field.name, e.target.value)}
                                            className="resize-none"
                                            placeholder={`Enter ${field.label.toLowerCase()}...`}
                                          />
                                        ) : (
                                          <Input
                                            type={field.type === "url" ? "url" : field.type === "email" ? "email" : "text"}
                                            value={value || ""}
                                            onChange={e => updateField(sec.section, field.name, e.target.value)}
                                            placeholder={`Enter ${field.label.toLowerCase()}...`}
                                          />
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                      </Accordion>
                    </TabsContent>

                {/* SEO Tab */}
                <TabsContent value="seo" className="mt-8">
                    <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
                      <CardHeader className="">
                        <CardTitle className="text-2xl font-bold">SEO Settings</CardTitle>
                        <p className="text-sm mt-1">Optimize for Google – stay in the green zone!</p>
                      </CardHeader>

                      <CardContent className="p-8 space-y-10 bg-gray-50/30">

                        {/* Meta Title – Limit 70 chars (Google shows ~60) */}
                        <div className="space-y-3">
                          <Label className="text-lg font-semibold text-gray-800">
                            Meta Title <span className="text-gray-500 font-normal text-sm">(50–60 recommended)</span>
                          </Label>
                          <div className="relative">
                            <Input
                              value={metaTitle}
                              onChange={(e) => setMetaTitle(e.target.value.slice(0, 70))}
                              placeholder="iPhone 15 Pro Max – Best Price 2025 | Official Store"
                              className="h-14 text-lg pr-24 border-2 rounded-xl focus:border-indigo-500 transition-all"
                              maxLength={70}
                            />
                            <div className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold ${
                              metaTitle.length > 60 ? "text-red-600" :
                              metaTitle.length >= 50 ? "text-green-600" :
                              metaTitle.length > 0 ? "text-amber-600" : "text-gray-400"
                            }`}>
                              {metaTitle.length} / 70
                            </div>
                          </div>
                          {metaTitle.length > 60 && (
                            <p className="text-red-600 text-sm">Warning: Title may be truncated in Google results</p>
                          )}
                        </div>

                        {/* Meta Description – Limit 160 chars */}
                        <div className="space-y-3">
                          <Label className="text-lg font-semibold text-gray-800">
                            Meta Description <span className="text-gray-500 font-normal text-sm">(150–160 ideal)</span>
                          </Label>
                          <div className="relative">
                            <Textarea
                              value={metaDescription}
                              onChange={(e) => setMetaDescription(e.target.value.slice(0, 160))}
                              rows={5}
                              placeholder="Premium iPhone 15 Pro Max with A17 Pro chip, titanium design, 48MP camera, and all-day battery. Buy now with free shipping & 0% EMI."
                              className="resize-none pr-20 pt-4 text-base border-2 rounded-xl focus:border-purple-500 transition-all"
                              maxLength={160}
                            />
                            <div className={`absolute right-4 bottom-4 text-sm font-bold ${
                              metaDescription.length > 160 ? "text-red-600" :
                              metaDescription.length >= 140 ? "text-green-600" :
                              metaDescription.length > 0 ? "text-amber-600" : "text-gray-400"
                            }`}>
                              {metaDescription.length} / 160
                            </div>
                          </div>
                          {metaDescription.length > 155 && (
                            <p className="text-red-600 text-sm">Warning: Description may be cut off in search results</p>
                          )}
                        </div>

                        {/* Keywords – No hard limit, but helpful UI */}
                        <div className="space-y-3">
                          <Label className="text-lg font-semibold text-gray-800">
                            Keywords <span className="text-gray-500 font-normal text-sm">(comma separated)</span>
                          </Label>
                          <Input
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder="iphone 15 pro max, apple iphone, best smartphone 2025"
                            className="h-14 border-2 rounded-xl focus:border-pink-500 transition-all"
                          />
                          {keywords && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {keywords.split(",").map((kw, i) => {
                                const trimmed = kw.trim();
                                if (!trimmed) return null;
                                return (
                                  <span
                                    key={i}
                                    className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-purple-200 transition"
                                  >
                                    {trimmed}
                                    <button
                                      onClick={() => {
                                        const updated = keywords.split(",").filter((_, idx) => idx !== i).join(",");
                                        setKeywords(updated);
                                      }}
                                      className="hover:bg-purple-300 rounded-full p-1"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Success Indicator */}
                        <div className={`p-6 rounded-2xl border-2 ${
                          metaTitle.length >= 50 && metaTitle.length <= 60 &&
                          metaDescription.length >= 140 && metaDescription.length <= 160
                            ? "bg-green-50 border-green-300" 
                            : "bg-amber-50 border-amber-300"
                        }`}>
                          <p className={`font-bold text-center ${
                            metaTitle.length >= 50 && metaTitle.length <= 60 &&
                            metaDescription.length >= 140 && metaDescription.length <= 160
                              ? "text-green-700" : "text-amber-700"
                          }`}>
                            {metaTitle.length >= 50 && metaTitle.length <= 60 &&
                            metaDescription.length >= 140 && metaDescription.length <= 160
                              ? "Perfect SEO! Ready to rank #1" 
                              : "Keep going – get in the green zone!"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
              </Tabs>
            </div>

                    <div className={`${isMobilePreviewVisible ? "block" : "hidden"}`}>
                      <div className="flex items-center justify-center sticky top-0 py-8">
                        <div className="w-[360px] h-[720px] rounded-[45px] border-[14px] border-black bg-black overflow-hidden relative shadow-2xl">
                          {/* Notch */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-black rounded-b-3xl z-10"></div>
                          
                          {/* Screen */}
                          <div className="w-full h-full bg-white overflow-y-auto">
                            <Perview data={liveData} />
                          </div>
                        </div>
                      </div>
                    </div>
          </div>
        </div>
      </div>
      {/* LARGE CUSTOMIZE MODAL */}
{isCustomizeModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col animate-in fade-in duration-300">
      {/* Modal Header */}
      <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <h2 className="text-2xl font-bold">Customize Landing Page</h2>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 rounded-full"
          onClick={() => setIsCustomizeModalOpen(false)}
        >
          <X className="h-mr-1 h-6 w-6" />
        </Button>
      </div>

      {/* Modal Body - Your Full Editor Inside */}
      <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
        {/* Paste your entire editor here (Tabs, Product Details, Sections, SEO) */}
        <Builder templateId={templateId} userId={userId} />
      </div>

      {/* Modal Footer */}
      <div className="p-6 border-t bg-white flex justify-end gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setIsCustomizeModalOpen(false)}
        >
          Cancel
        </Button>
        <Button
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => {
            showToast("Changes saved automatically!", "success");
            setIsCustomizeModalOpen(false);
          }}
        >
          Save & Close
        </Button>
      </div>
    </div>
  </div>
)}
    </DashboardLayout>
  );
}