'use client';

import { useEffect, useState } from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout, Settings, Tags, Palette, Save, Grid3x3, X } from 'lucide-react';
import QRPreview from '@/components/qr-components/QRPreview';
import QREditor from '@/components/qr-components/QREditor';
import TemplateCard from '@/components/qr-components/TemplateCard';
import { QRTemplate, Tag } from '@/lib/types/qr.types';
import { DashboardLayout } from "@/components/dashboard/layout";
import { useTemplatesStore } from '@/lib/stores/qr-templates.store';

export default function QRManagerPage() {
  const {
    templates,
    selectedTemplate,
    setSelectedTemplate,
    updateTemplate,
    addTemplate,
  } = useTemplatesStore();

  const [qrData, setQrData] = useState('https://example.com/product/12345');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'tags' | 'style'>('settings');
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);

  useEffect(() => {
    setIsCustomMode(false);
  }, [selectedTemplate?.id]);

  const handleTemplateSelect = (template: QRTemplate) => {
    setSelectedTemplate(template);
    setShowTemplatesModal(false);
  };

  const handleUpdateTag = (tagId: string, updates: Partial<Tag>) => {
    updateTemplate(selectedTemplate.id, {
      tags: selectedTemplate.tags.map((tag) =>
        tag.id === tagId ? { ...tag, ...updates } : tag
      ),
    });
    setIsCustomMode(true);
  };

  const handleAddTag = () => {
    const newTag: Tag = {
      id: `tag-${Date.now()}`,
      field: 'custom',
      label: 'Custom',
      value: 'New Tag',
      position: 'bottom',
      fontSize: 14,
      fontWeight: 'normal',
      fontFamily: "Arial",
      enabled: true,
    };
    updateTemplate(selectedTemplate.id, {
      tags: [...selectedTemplate.tags, newTag],
    });
    setIsCustomMode(true);
  };

  const handleRemoveTag = (tagId: string) => {
    updateTemplate(selectedTemplate.id, {
      tags: selectedTemplate.tags.filter((tag) => tag.id !== tagId),
    });
    setIsCustomMode(true);
  };

  const handleUpdateQRSize = (size: number) => {
    updateTemplate(selectedTemplate.id, { qrSize: size });
    setIsCustomMode(true);
  };

  const handleUpdateBackgroundColor = (color: string) => {
    updateTemplate(selectedTemplate.id, { backgroundColor: color });
    setIsCustomMode(true);
  };

  const handleUpdateTextColor = (color: string) => {
    updateTemplate(selectedTemplate.id, { textColor: color });
    setIsCustomMode(true);
  };

  const handleSaveAsTemplate = () => {
    const templateName = prompt('Enter template name:');
    if (!templateName?.trim()) return;

    const newTemplate: QRTemplate = {
      ...selectedTemplate,
      id: `template-${Date.now()}`,
      name: templateName.trim(),
    };

    addTemplate(newTemplate);
    alert(`Template "${templateName}" saved!`);
    setIsCustomMode(false);
  };

  return (
    <DashboardLayout>
      <TooltipProvider>
        <div className="min-h-screen p-4 md:p-6">
          <div className="max-w-7xl mx-auto">

            {/* ──────────────────────────────────────────────── */}
            {/*                   HEADER                        */}
            {/* ──────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-900">QR Code Manager</h1>

              <div className="flex items-center gap-3 flex-wrap justify-end">
                {/* Template selector button */}
                <button
                  onClick={() => setShowTemplatesModal(true)}
                  className="flex items-center gap-2.5 px-4 py-2.5  bg-primary text-white  border-gray-300 rounded-lg hover:border-gray-400 hover:shadow transition-all min-w-[200px] sm:min-w-[240px] justify-between text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Layout className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium  truncate max-w-[140px] sm:max-w-[180px]">
                      {selectedTemplate?.name || "Select template..."}
                    </span>
                  </div>
                  <Grid3x3 className="w-4 h-4  flex-shrink-0" />
                </button>

                {/* Save as Template button – always visible */}
                <button
                  onClick={handleSaveAsTemplate}
                  disabled={!isCustomMode}
                  title={isCustomMode ? "Save current changes as new template" : "No changes detected"}
                  className={`
                    flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                    ${isCustomMode 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 cursor-pointer' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-70'
                    }
                  `}
                >
                  <Save className="w-4 h-4" />
                {/* Modified badge – only when changes exist */}
                {isCustomMode && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full border border-amber-200">
                    Modified
                  </span>
                )}  <span>Save as Template</span>
                </button>

                
              </div>
            </div>

            {/* Templates Modal */}
            {showTemplatesModal && (
              <div
                className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
                onClick={() => setShowTemplatesModal(false)}
              >
                <div
                  className="bg-background text-foreground rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6 bg-primary text-white border-slate-200 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                      Select a QR Template — Use a Ready Design or Create Your Own
                    </h2>
                    <button
                      onClick={() => setShowTemplatesModal(false)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <X className="w-6 h-6 text-gray-600" />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="overflow-y-auto max-h-[calc(80vh-140px)]">
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        {templates.map((template) => (
                          <TemplateCard
                            key={template.id}
                            template={template}
                            isSelected={selectedTemplate.id === template.id}
                            onClick={() => handleTemplateSelect(template)}
                          />
                        ))}

                        <div
                          className="aspect-[3/4] rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-all cursor-pointer"
                          onClick={() => alert('Create blank template – coming soon')}
                        >
                          <span className="text-5xl mb-3">+</span>
                          <span className="text-base font-medium">New Blank</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
              {/* Left – Editor */}
              <div className="space-y-6">
                {/* QR Content Input */}
                <div className="bg-white p-5 rounded-xl  border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                    QR Code Content
                  </label>
                  <input
                    type="text"
                    value={qrData}
                    onChange={(e) => setQrData(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    placeholder="https://example.com or any text..."
                  />
                </div>

                {/* Tabbed Editor */}
                <div className="bg-white rounded-xl  border-gray-200 overflow-hidden">
                  {/* Tabs */}
                  <div className="flex border-b bg-gray-50/70">
                    {(['settings', 'tags', 'style'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all ${
                          activeTab === tab
                            ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/70'
                        }`}
                      >
                        {tab === 'settings' && <Settings className="w-4 h-4" />}
                        {tab === 'tags' && <Tags className="w-4 h-4" />}
                        {tab === 'style' && <Palette className="w-4 h-4" />}
                        <span className="hidden sm:inline capitalize">{tab}</span>
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="p-6">
                    <QREditor
                      activeTab={activeTab}
                      tags={selectedTemplate.tags}
                      qrSize={selectedTemplate.qrSize}
                      backgroundColor={selectedTemplate.backgroundColor}
                      textColor={selectedTemplate.textColor}
                      onUpdateTag={handleUpdateTag}
                      onAddTag={handleAddTag}
                      onRemoveTag={handleRemoveTag}
                      onUpdateQRSize={handleUpdateQRSize}
                      onUpdateBackgroundColor={handleUpdateBackgroundColor}
                      onUpdateTextColor={handleUpdateTextColor}
                    />
                  </div>
                </div>
              </div>

              {/* Right – Preview */}
              <div className="bg-white p-6 md:p-8 rounded-xl  border-gray-200  lg:sticky lg:top-6 h-fit">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                  Live Preview
                </h2>
                <div className="flex justify-center">
                  <QRPreview template={selectedTemplate} qrData={qrData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </DashboardLayout>
  );
}