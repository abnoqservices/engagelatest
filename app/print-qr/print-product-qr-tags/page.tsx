// app/bulk-qr/page.tsx
'use client';

import { useState, useRef } from 'react';
import { MoreVertical, Settings, Printer, Download, FileDown, Trash2, Layout, ChevronDown, Grid3x3, List, Upload } from 'lucide-react';

// Import your actual components - these paths should match your project structure
import BulkImport from '@/components/qr-components/BulkImport';
import BulkQRGrid from '@/components/qr-components/BulkQRGrid';
import TemplateCard from '@/components/qr-components/TemplateCard';
import { QRTemplate } from '@/lib/types/qr.types';
import { BulkQRItem } from '@/lib/types/bulk-qr.types';
import { DashboardLayout } from "@/components/dashboard/layout";
import { useTemplatesStore } from '@/lib/stores/qr-templates.store';

export default function BulkQRPage() {
  const {
    templates,
    selectedTemplate,
    setSelectedTemplate,
  } = useTemplatesStore();

  const [items, setItems] = useState<BulkQRItem[]>([]);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [itemsPerRow, setItemsPerRow] = useState(3);
  const [pageSize, setPageSize] = useState<'A4' | 'Letter' | 'Label'>('A4');
  const printAreaRef = useRef<HTMLDivElement>(null);
  
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  const activeTemplate = selectedTemplate || templates[0];

  const handleImport = (importedItems: BulkQRItem[]) => {
    setItems(importedItems);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert('PDF download would be implemented with a library like jsPDF or html2pdf');
  };

  const handleExportData = () => {
    const csv = [
      'productName,sku,productId,url,qrData',
      ...items.map(item =>
        `${item.productName || ''},${item.sku || ''},${item.productId || ''},${item.url || ''},${item.qrData}`
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr_codes_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all items?')) {
      setItems([]);
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header Bar */}
          <div className="bg-white rounded-lg  border-gray-200 p-4 mb-4  print:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-gray-900">Bulk QR Generator</h1>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {items.length} items
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Template Selector */}
                <button
                  onClick={() => setShowTemplateDialog(true)}
                  className="flex items-center bg-gray-50 gap-2 px-4 py-2  border-gray-300 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Layout className="w-4 h-4" />
                  <span className="text-sm font-medium">{activeTemplate?.name || 'Select Template'}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Layout Settings Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowLayoutMenu(!showLayoutMenu);
                      setShowActionsMenu(false);
                    }}
                    className="p-2 bg-gray-50  border-gray-300 rounded-lg hover:bg-blue-200 transition-colors"
                    title="Layout Settings"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  
                  {showLayoutMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowLayoutMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg  border-gray-100 z-20">
                        <div className="p-4 border-b border-gray-200">
                          <h3 className="font-semibold text-sm">Layout Settings</h3>
                        </div>
                        <div className="p-4 space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Layout Type</label>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setLayout('grid')}
                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded ${
                                  layout === 'grid'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                <Grid3x3 className="w-4 h-4" />
                                Grid
                              </button>
                              <button
                                onClick={() => setLayout('list')}
                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded ${
                                  layout === 'list'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                <List className="w-4 h-4" />
                                List
                              </button>
                            </div>
                          </div>

                          {layout === 'grid' && (
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Items Per Row: {itemsPerRow}
                              </label>
                              <input
                                type="range"
                                min="1"
                                max="5"
                                value={itemsPerRow}
                                onChange={(e) => setItemsPerRow(Number(e.target.value))}
                                className="w-full"
                              />
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>1</span>
                                <span>5</span>
                              </div>
                            </div>
                          )}

                          <div>
                            <label className="block text-sm font-medium mb-2">Page Size</label>
                            <select
                              value={pageSize}
                              onChange={(e) => setPageSize(e.target.value as any)}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="A4">A4 (210 × 297 mm)</option>
                              <option value="Letter">Letter (8.5 × 11 in)</option>
                              <option value="Label">Label (4 × 6 in)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Actions Menu Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowActionsMenu(!showActionsMenu);
                      setShowLayoutMenu(false);
                    }}
                    className="p-2  border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Actions"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  
                  {showActionsMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowActionsMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                        <div className="p-2">
                          <button
                            onClick={() => { handlePrint(); setShowActionsMenu(false); }}
                            disabled={items.length === 0}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Printer className="w-4 h-4" />
                            Print All
                          </button>
                          <button
                            onClick={() => { handleDownloadPDF(); setShowActionsMenu(false); }}
                            disabled={items.length === 0}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Download className="w-4 h-4" />
                            Download PDF
                          </button>
                          <button
                            onClick={() => { handleExportData(); setShowActionsMenu(false); }}
                            disabled={items.length === 0}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FileDown className="w-4 h-4" />
                            Export Data
                          </button>
                          <div className="border-t border-gray-200 my-2"></div>
                          <button
                            onClick={() => { handleClearAll(); setShowActionsMenu(false); }}
                            disabled={items.length === 0}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left rounded hover:bg-red-50 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-4 h-4" />
                            Clear All
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Import Section - Compact */}
            <div className="lg:col-span-1 print:hidden">
              <div className="bg-white rounded-lg  border-gray-200 p-4">
                <h2 className="font-semibold text-sm mb-3">Import Data</h2>
                <BulkImport onImport={handleImport} />
              </div>
              
              {/* Manage Items - Compact */}
              {items.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4 shadow-sm">
                  <h3 className="font-semibold text-sm mb-3">Items ({items.length})</h3>
                  <div className="space-y-1 max-h-[400px] overflow-y-auto">
                    {items.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 group"
                      >
                        <div className="flex-1 text-xs truncate">
                          <span className="font-medium text-gray-500">#{index + 1}</span>
                          <span className="mx-1.5 text-gray-300">|</span>
                          <span className="text-gray-700">{item.productName || item.sku || item.productId || 'Untitled'}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 ml-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Preview Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg  border-gray-200 p-6 shadow-sm min-h-[600px]">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400 print:hidden">
                    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg font-medium">No items to display</p>
                    <p className="text-sm mt-1">Import data to generate QR codes</p>
                  </div>
                ) : (
                  <div ref={printAreaRef} className={pageSize === 'A4' ? 'print:w-[210mm]' : pageSize === 'Letter' ? 'print:w-[8.5in]' : 'print:w-[4in]'}>
                    <BulkQRGrid
                      items={items}
                      template={activeTemplate}
                      layout={layout}
                      itemsPerRow={itemsPerRow}
                      
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        
          {/* Template Selection Dialog */}
          {showTemplateDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-background text-foreground rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
               <div className="p-6   bg-primary text-white border-slate-200 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    Select a QR Template — Use a Ready Design or Create Your Own
                  </h2>

                  <button
                    onClick={() => setShowTemplateDialog(false)}
                    className="text-slate-400 hover:text-slate-600 transition"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                
                <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => {
                          setSelectedTemplate(template);
                          setShowTemplateDialog(false);
                        }}
                        className="cursor-pointer"
                      >
                        <TemplateCard
                          template={template}
                          isSelected={activeTemplate?.id === template.id}
                          onClick={() => {}}
                        />
                        
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4  border-gray-200 bg-gray-50 flex justify-end gap-3">
                  <button
                    onClick={() => setShowTemplateDialog(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Print Styles */}
          <style jsx global>{`
            @media print {
              body * {
                visibility: hidden;
              }
              .print\\:hidden {
                display: none !important;
              }
              .qr-item,
              .qr-item * {
                visibility: visible;
              }
              @page {
                margin: 0.5cm;
                size: ${pageSize === 'A4' ? 'A4' : pageSize === 'Letter' ? 'letter' : '4in 6in'};
              }
            }
          `}</style>
        </div>
      </div>
    </DashboardLayout>
  );
}