'use client';

import { useTemplatesStore } from '@/lib/stores/qr-templates.store';
import  TemplateCard  from '@/components/qr-components/TemplateCard';
import { DashboardLayout } from '@/components/dashboard/layout';
import { QRTemplate } from '@/lib/types/qr.types';

export default function QRManagerPage() {
  const {
    templates,
    selectedTemplate,
    setSelectedTemplate,
  } = useTemplatesStore();

  const handleTemplateClick = (template: QRTemplate) => {
    // Toggle selection: click same → deselect, click different → select
    if (selectedTemplate?.id === template.id) {
      setSelectedTemplate(null);
    } else {
      setSelectedTemplate(template);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                QR Templates
              </h1>
              <p className="mt-1.5 text-sm text-gray-600">
                Choose a template to use or customize
              </p>
            </div>

            <div className="rounded-lg bg-white px-4 py-2 text-sm shadow-sm ring-1 ring-gray-200">
              {selectedTemplate ? (
                <span className="font-medium text-indigo-700">
                  Selected: {selectedTemplate.name}
                </span>
              ) : (
                <span className="text-gray-500">No template selected</span>
              )}
            </div>
          </div>

          {/* Templates Grid */}
          {templates.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
              <p className="text-lg font-medium text-gray-600">No templates yet</p>
              <p className="mt-2 text-sm text-gray-500">
                Create your first QR template to get started
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                 
                >
                  <TemplateCard
                    template={template}
                    isSelected={selectedTemplate?.id === template.id}
                    onClick={() => handleTemplateClick(template)}
                  />

                  {/* Optional subtle overlay on selected */}
                  {selectedTemplate?.id === template.id && (
                    <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}