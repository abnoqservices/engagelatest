// app/(your-path)/landing-pages/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";



import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import {
  Plus,
  Search,
  MoreVertical,
  Eye,
  Copy,
  Trash2,
  Edit,
  ExternalLink,
  BarChart3,
  Layout,
  X,
  Link2,
  CheckCircle2,
  Palette
} from "lucide-react";

type LandingPageItem = {
  id: number;
  name: string;
  url: string;
  views: number;
  conversions: number;
  status: string;
  lastModified: string;
  template: string;
};

export default function LandingPagesPage() {
  const [showLinkModal, setShowLinkModal] = React.useState(false);
  const [generatedLink, setGeneratedLink] = React.useState("");
  const [selectedPage, setSelectedPage] = React.useState<LandingPageItem | null>(null);
  const [copied, setCopied] = React.useState(false);

  const [showPreviewModal, setShowPreviewModal] = React.useState(false);
  const [previewMode, setPreviewMode] = React.useState<"mobile" | "tablet" | "desktop">("desktop");

  const [showTemplateModal, setShowTemplateModal] = React.useState(false);
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>("modern");

  // Dummy landing pages list with template property
  const landingPages: LandingPageItem[] = [
    {
      id: 1,
      name: "Pro Landing Page",
      url: "https://cdn0070.qrcodechimp.com/images/templates/product-qr-code-for-fashion.png",
      views: 2543,
      conversions: 187,
      status: "published",
      lastModified: "2024-01-15",
      template: "modern"
    },
    {
      id: 2,
      name: "Premium Headphones Store",
      url: "https://cdn0070.qrcodechimp.com/images/templates/product-qr-code-for-wine.png",
      views: 1823,
      conversions: 142,
      status: "published",
      lastModified: "2024-01-18",
      template: "ecommerce"
    },
     {
      id: 3,
      name: "Pro Tempalte Landing Page",
      url: "https://cdn0070.qrcodechimp.com/images/templates/product-qr-code-for-watch.png",
      views: 1823,
      conversions: 142,
      status: "published",
      lastModified: "2024-01-18",
      template: "protemplete"
    },
    {
      id: 4,
      name: "Pro Template 2 Landing Page",
      url: "https://cdn0070.qrcodechimp.com/images/digitalCard/dbcv2/digital-business-cards-template-event.webp",
      views: 1823,
      conversions: 142,
      status: "published",
      lastModified: "2024-01-18",
      template: "protemplete2"
    }
  ];

  const generateDynamicURL = (page: LandingPageItem, template?: string) => {
    const templateType = template || page.template || "modern";
    // window is available because this is a client component
    return `${window.location.origin}/api/landing-html/${page.id}?template=${encodeURIComponent(templateType)}`;
  };

  const handleGenerateLink = (page: LandingPageItem) => {
    setSelectedPage(page);
    setSelectedTemplate(page.template || "modern");
   // setShowTemplateModal(true);
    handleConfirmTemplate();
  };

  const handleConfirmTemplate = () => {
    if (!selectedPage) return;
    const generated = generateDynamicURL(selectedPage, selectedTemplate);
    setGeneratedLink(generated);
    setShowTemplateModal(false);
    setShowLinkModal(true);
    setCopied(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenInNewTab = () => {
    if (!generatedLink) return;
    window.open(generatedLink, "_blank");
  };

  const getTemplateBadgeColor = (template: string) => {
    switch (template) {
      case "modern":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "ecommerce":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTemplateIcon = (template: string) => {
    switch (template) {
      case "modern":
        return "🎯";
      case "ecommerce":
        return "🛒";
      default:
        return "📄";
    }
  };

  // list of available template keys from the templates file


  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Landing Pages</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create and manage product landing pages
            </p>
          </div>
          <Link href="/landing-pages/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Landing Page
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
              <Layout className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{landingPages.length}</div>
              <p className="text-xs text-muted-foreground">{landingPages.filter(p => p.status === "published").length} active campaigns</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45.2K</div>
              <p className="text-xs text-muted-foreground">+12.5% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversions</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">Conversion rate: 2.7%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2:34</div>
              <p className="text-xs text-muted-foreground">Minutes per visit</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search landing pages..." className="pl-9" />
          </div>
        </div>

        {/* ---------------- TEMPLATE SELECTION MODAL ---------------- */}
       {showTemplateModal && selectedPage && (
  <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
    <div className="w-full max-w-3xl bg-white rounded-lg shadow-2xl max-h-[90vh] flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-3">
          <Palette className="h-8 w-8 text-purple-600" />
          <div>
            <h2 className="text-xl font-bold">Choose Template Design</h2>
            <p className="text-sm text-slate-500">{selectedPage.name}</p>
          </div>
        </div>
        <Button variant="outline" size="icon" onClick={() => setShowTemplateModal(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="p-6 space-y-4 overflow-y-auto max-h-[55vh]">
        <p className="text-sm text-muted-foreground">
          Select a template design for your landing page:
        </p>

        <div className="grid grid-cols-2 gap-4">
          {availableTemplateKeys.map((key) => (
            <div
              key={key}
              onClick={() => setSelectedTemplate(key)}
              className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                selectedTemplate === key
                  ? "ring-2 ring-offset-2 ring-blue-400"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{getTemplateIcon(key)}</span>
                <Badge className={getTemplateBadgeColor(key)}>{key}</Badge>
              </div>
              <h3 className="font-semibold mb-2">{key[0].toUpperCase() + key.slice(1)}</h3>
             
              <div className="mt-3 aspect-video bg-slate-50 rounded flex items-center justify-center text-xs font-medium text-slate-600">
              
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Buttons */}
      <div className="p-6 border-t flex gap-3 bg-white">
        <Button variant="outline" className="flex-1" onClick={() => setShowTemplateModal(false)}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={handleConfirmTemplate}>
          Generate Link with {selectedTemplate === "modern" ? "Modern" : selectedTemplate}
        </Button>
      </div>

    </div>
  </div>
)}


        {/* ---------------- PREVIEW MODAL ---------------- */}
        {showPreviewModal && selectedPage && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-white max-w-5xl w-full rounded-xl shadow-xl overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold">Preview — {selectedPage.name}</h2>
                  <Badge className={getTemplateBadgeColor(selectedPage.template)}>
                    {getTemplateIcon(selectedPage.template)} {selectedPage.template}
                  </Badge>
                </div>
                <Button variant="outline" size="icon" onClick={() => setShowPreviewModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Device buttons */}
              <div className="p-4 flex gap-3 justify-center">
                <Button
                  variant={previewMode === "mobile" ? "default" : "outline"}
                  onClick={() => setPreviewMode("mobile")}
                >
                  📱 Mobile
                </Button>

                <Button
                  variant={previewMode === "tablet" ? "default" : "outline"}
                  onClick={() => setPreviewMode("tablet")}
                >
                  📱 Tablet
                </Button>

                <Button
                  variant={previewMode === "desktop" ? "default" : "outline"}
                  onClick={() => setPreviewMode("desktop")}
                >
                  🖥️ Desktop
                </Button>
              </div>

              {/* iframe preview */}
              <div className="flex justify-center bg-slate-100 p-6">
                <iframe
                  src={generateDynamicURL(selectedPage)}
                  className="bg-white border shadow-lg rounded-xl"
                  style={{
                    width:
                      previewMode === "mobile"
                        ? "375px"
                        : previewMode === "tablet"
                        ? "768px"
                        : "100%",
                    height: "80vh"
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ---------------- LINK MODAL ---------------- */}
        {showLinkModal && selectedPage && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                  <div>
                    <h2 className="text-xl font-bold">Landing Page Link Generated</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-slate-500">{selectedPage.name}</p>
                      <Badge className={getTemplateBadgeColor(selectedTemplate)}>
                        {getTemplateIcon(selectedTemplate)} {selectedTemplate}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="icon" onClick={() => setShowLinkModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-6 space-y-4">
                <label className="text-sm font-medium">Your Link</label>
                <div className="flex gap-2">
                  <Input value={generatedLink} readOnly className="flex-1 font-mono text-sm" />
                  <Button variant="outline" onClick={handleCopyLink}>
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>

                <Button className="w-full" onClick={handleOpenInNewTab}>
                  <ExternalLink className="h-4 w-4 mr-2" /> Open in New Tab
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- MAIN PAGE CONTENT ---------------- */}
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {landingPages.map((page) => (
  <Card key={page.id} className="overflow-hidden hover:shadow-lg transition-shadow">
    <CardHeader>
      <div className="flex justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <CardTitle>{page.name}</CardTitle>
          </div>

          <Badge className={getTemplateBadgeColor(page.template)}>
            {getTemplateIcon(page.template)} {page.template}
          </Badge>

          <CardDescription className="mt-3">
          <img src={`/api/thumbnail?url=${encodeURIComponent(`https://engageqrcode.vercel.app/api/landing-html/${page.id}?template=${page.template}`)}`}
className="w-full h-[220px] object-cover border rounded bg-white"
/>

          </CardDescription>
        </div>

        {/* Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleGenerateLink(page)}>
              <Link2 className="h-4 w-4 mr-2" /> Generate Link
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setSelectedPage(page);
                setShowPreviewModal(true);
              }}
            >
              <Eye className="h-4 w-4 mr-2" /> Preview
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" /> Edit
            </DropdownMenuItem>

            <DropdownMenuItem className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardHeader>

    <CardContent>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Views:</span>
          <span className="font-medium">{page.views.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Conversions:</span>
          <span className="font-medium">{page.conversions}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Status:</span>
          <Badge variant="outline" className="text-green-600 border-green-200">
            {page.status}
          </Badge>
        </div>
      </div>

      <Button
        variant="default"
        className="w-full"
        onClick={() => handleGenerateLink(page)}
      >
        <Link2 className="h-4 w-4 mr-2" /> Generate Preview Link
      </Button>
    </CardContent>
  </Card>
))}

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
