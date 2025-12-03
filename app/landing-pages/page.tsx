"use client";

import * as React from "react";
import {
  Plus,
  Search,
  MoreVertical,
  Eye,
  Trash2,
  Edit,
  ExternalLink,
  BarChart3,
  Layout,
  X,
  Link2,
  CheckCircle2,
  Palette,
  Check,
  Paintbrush
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
// Removed unsupported import
import { DashboardLayout } from "@/components/dashboard/layout";
// Mock UI Components
const Button = ({ children, className = "", variant = "default", size = "default", onClick, ...props }: any) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    ghost: "hover:bg-gray-100"
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    icon: "h-10 w-10"
  };
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }: any) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
);

const Card = ({ children, className = "" }: any) => (
  <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }: any) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }: any) => (
  <h3 className={`text-xl font-semibold ${className}`}>{children}</h3>
);

const CardDescription = ({ children, className = "" }: any) => (
  <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
);

const CardContent = ({ children, className = "" }: any) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const Badge = ({ children, className = "", variant = "default" }: any) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    outline: "border"
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

type LandingPageItem = {
  id: number;
  name: string;
  url: string;
  views: number;
  conversions: number;
  status: string;
  lastModified: string;
  template: string;
  isActive?: boolean;
};

type TemplateType = {
  key: string;
  name: string;
  icon: string;
  color: string;
  image: string;
};

export default function LandingPagesPage() {
  const [showLinkModal, setShowLinkModal] = React.useState(false);
  const [generatedLink, setGeneratedLink] = React.useState("");
  const [selectedPage, setSelectedPage] = React.useState<LandingPageItem | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>("modern");
  const router = useRouter();
  // Default 5 templates
  const defaultTemplatesData: TemplateType[] = [
    { key: "modern", name: "Modern", icon: "🎯", color: "bg-blue-100 text-blue-800 border-blue-200", image: "https://cdn0070.qrcodechimp.com/images/templates/product-qr-code-for-fashion.png" },
    { key: "ecommerce", name: "E-Commerce", icon: "🛒", color: "bg-purple-100 text-purple-800 border-purple-200", image: "https://cdn0070.qrcodechimp.com/images/templates/product-qr-code-for-wine.png" },
    { key: "minimal", name: "Minimal", icon: "✨", color: "bg-green-100 text-green-800 border-green-200", image: "https://cdn0070.qrcodechimp.com/images/templates/product-qr-code-for-watch.png" },
    { key: "corporate", name: "Corporate", icon: "🏢", color: "bg-orange-100 text-orange-800 border-orange-200", image: "https://cdn0070.qrcodechimp.com/images/digitalCard/dbcv2/digital-business-cards-template-event.webp" },
    { key: "creative", name: "Creative", icon: "🎨", color: "bg-pink-100 text-pink-800 border-pink-200", image: "https://cdn0070.qrcodechimp.com/images/templates/product-qr-code-for-fashion.png" }
  ];

  // Active page state
  const [activePage, setActivePage] = React.useState<LandingPageItem | null>({
    id: 1,
    name: "My Active Landing Page",
    url: "https://cdn0070.qrcodechimp.com/images/templates/product-qr-code-for-fashion.png",
    views: 2543,
    conversions: 187,
    status: "published",
    lastModified: "2024-01-15",
    template: "modern",
    isActive: true
  });

  // Available templates (excluding the active one)
  const [availableTemplates, setAvailableTemplates] = React.useState<TemplateType[]>(
    defaultTemplatesData.filter(t => t.key !== "modern")
  );

  const generateDynamicURL = (page: LandingPageItem, template?: string) => {
    const templateType = template || page.template || "modern";
    router.push(`preview/${page.id}`)

  };

  const handleGenerateLink = (page: LandingPageItem) => {
    setSelectedPage(page);
    setSelectedTemplate(page.template || "modern");
    const generated = generateDynamicURL(page, page.template);
    setGeneratedLink(generated);
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

  const getTemplateInfo = (templateKey: string) => {
    return defaultTemplatesData.find(t => t.key === templateKey) || defaultTemplatesData[0];
  };

  const handleCustomizeTemplate = (templateKey: string) => {
    router.push("/landing-pages/new"); // no full reload
  };

  const handleEditActivePage = () => {
    if (activePage) {
      router.push(`/landing-pages/${activePage.id}`); // smooth client-side navigation
    }
  };
  const handleActivateTemplate = (templateKey: string) => {
    const templateInfo = getTemplateInfo(templateKey);
    
    // Create new active page from template
    const newActivePage: LandingPageItem = {
      id: Math.floor(Math.random() * 10000),
      name: `${templateInfo.name} Landing Page`,
      url: templateInfo.image,
      views: 0,
      conversions: 0,
      status: "published",
      lastModified: new Date().toISOString().split('T')[0],
      template: templateKey,
      isActive: true
    };

    // If there was an active page, move it back to available templates
    if (activePage) {
      const previousTemplate = getTemplateInfo(activePage.template);
      setAvailableTemplates(prev => {
        // Remove the newly activated template and add back the previous one
        const withoutNew = prev.filter(t => t.key !== templateKey);
        return [...withoutNew, previousTemplate];
      });
    } else {
      // Just remove the activated template from available
      setAvailableTemplates(prev => prev.filter(t => t.key !== templateKey));
    }

    // Set new active page
    setActivePage(newActivePage);
  };

  const handleDeactivateActivePage = () => {
    if (!activePage) return;

    // Move current active template back to available templates
    const currentTemplate = getTemplateInfo(activePage.template);
    setAvailableTemplates(prev => [...prev, currentTemplate]);

    // Clear active page
    setActivePage(null);
  };

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Landing Pages</h1>
              <p className="text-sm text-gray-500 mt-1">
                Create and manage product landing pages
              </p>
            </div>
            <Button className="gap-2" onClick={() => window.location.href = "http://localhost:3000/landing-pages/new"}>
              <Plus className="h-4 w-4" />
              Create Landing Page
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
              <Layout className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activePage ? 6 : 5}</div>
              <p className="text-xs text-gray-500">{activePage ? "1 active campaign" : "0 active campaigns"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45.2K</div>
              <p className="text-xs text-gray-500">+12.5% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversions</CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-gray-500">Conversion rate: 2.7%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2:34</div>
              <p className="text-xs text-gray-500">Minutes per visit</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search landing pages..." className="pl-9" />
          </div>
        </div>

        {/* Active Template Section */}
        {activePage && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">Active Template</h2>
                <Badge className="bg-green-100 text-green-800">
                  <Check className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              </div>
            </div>

            <Card className="overflow-hidden border-2 border-green-500 shadow-lg">
              <div className="md:flex">
                {/* Image Section */}
                <div className="bg-gray-100 p-4">
                  <div className="aspect-[6/9] relative rounded-lg overflow-hidden bg-white shadow-md">
                    <img
                      src={activePage.url}
                      alt={activePage.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className={getTemplateInfo(activePage.template).color}>
                        {getTemplateInfo(activePage.template).icon} {getTemplateInfo(activePage.template).name}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="md:w-2/3 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{activePage.name}</h3>
                      <p className="text-sm text-gray-500">Last modified: {activePage.lastModified}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{activePage.views.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Total Views</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{activePage.conversions}</div>
                      <div className="text-xs text-gray-600">Conversions</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {activePage.views > 0 ? ((activePage.conversions / activePage.views) * 100).toFixed(1) : "0.0"}%
                      </div>
                      <div className="text-xs text-gray-600">Conv. Rate</div>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <Button className="flex-1" onClick={handleEditActivePage}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Page
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => handleCustomizeTemplate(activePage.template)}>
                      <Paintbrush className="h-4 w-4 mr-2" />
                      Customize
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => handleGenerateLink(activePage)}>
                      <Link2 className="h-4 w-4 mr-2" />
                      Get Link
                    </Button>
                    <Button variant="outline" className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border-red-200" onClick={handleDeactivateActivePage}>
                      <X className="h-4 w-4 mr-2" />
                      Deactivate
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Default Templates Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {activePage ? "Available Templates" : "Default Templates"}
            </h2>
            <p className="text-sm text-gray-500">Choose a template to get started</p>
          </div>

          {availableTemplates.length > 0 ? (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
    {availableTemplates.map((template) => (
      <Card
        key={template.key}
        className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
      >
        {/* Thumbnail + Preview Button */}
        <div className="relative bg-gray-100 flex items-center justify-center py-8">
          <img
            src={template.image}
            alt={template.name}
            className="w-[70%] h-auto object-contain"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
            <Button
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() =>
                window.open(
                  `http://localhost:3000/preview/demo?template=${template.key}`,
                  "_blank"
                )
              }
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3 mt-3">
            <h4 className="font-semibold text-sm">{template.name}</h4>
            <Badge className={`${template.color} text-xs`}>
              {template.icon}
            </Badge>
          </div>

          {/* Responsive Action Buttons */}
          <div className="flex gap-2 items-center">
            {/* Desktop/Tablet: Two buttons */}
            <div className="hidden sm:flex gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => handleCustomizeTemplate(template.key)}
              >
                <Paintbrush className="h-3.5 w-3.5 mr-1" />
                Customize
              </Button>
              <Button
                size="sm"
                className="flex-1 text-xs"
                onClick={() => handleActivateTemplate(template.key)}
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Activate
              </Button>
            </div>

            {/* Mobile: Three-dot menu */}
            <div className="flex sm:hidden w-full justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="px-2">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      window.open(
                        `http://localhost:3000/preview/demo?template=${template.key}`,
                        "_blank"
                      )
                    }
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleCustomizeTemplate(template.key)}
                  >
                    <Paintbrush className="h-4 w-4 mr-2" />
                    Customize
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleActivateTemplate(template.key)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Activate
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
) : (
  <Card className="p-8 text-center">
    <p className="text-gray-500">All templates are currently in use or activated</p>
  </Card>
)}
        </div>

        {/* Link Modal */}
        {showLinkModal && selectedPage && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                  <div>
                    <h2 className="text-xl font-bold">Landing Page Link Generated</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-gray-500">{selectedPage.name}</p>
                      <Badge className={getTemplateInfo(selectedTemplate).color}>
                        {getTemplateInfo(selectedTemplate).icon} {getTemplateInfo(selectedTemplate).name}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="icon" onClick={() => setShowLinkModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-6 space-y-4">
                <label className="text-sm font-medium">Your Preview Link</label>
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
      </div>
    </div>
    </DashboardLayout>
  );
}