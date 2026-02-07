// components/QRPreview.tsx
'use client';

import { QRCodeSVG } from 'qrcode.react';
import { QRTemplate } from '@/lib/types/qr.types';

interface QRPreviewProps {
  template: QRTemplate | null;
  qrData: string;
}

export default function QRPreview({ template, qrData }: QRPreviewProps) {
  if (!template) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-gray-500">
        Loading template...
      </div>
    );
  }

  // Safe QR value (prevents empty/invalid QR code)
  const qrValue = qrData?.trim() || 'https://example.com';

  // Filter tags by position
  const topTags = template.tags.filter((t) => t.enabled && t.position === 'top');
  const bottomTags = template.tags.filter((t) => t.enabled && t.position === 'bottom');
  const leftTags = template.tags.filter((t) => t.enabled && t.position === 'left');
  const rightTags = template.tags.filter((t) => t.enabled && t.position === 'right');

  return (
    <>
      {/* Print-specific styles – you can move this to globals.css later */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }

          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          /* Hide non-printable elements */
          button,
          .no-print,
          header,
          footer,
          nav {
            display: none !important;
          }

          /* Center and constrain printable content */
          .print-container {
            width: 100% !important;
            max-width: 190mm !important; /* A little less than A4 to avoid edge cutoff */
            margin: 0 auto !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
          }

          /* Force colors and prevent background removal */
          .print-container,
          .print-container * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color: black !important;
          }

          /* Ensure QR SVG is sharp and fits */
          svg {
            max-width: 100% !important;
            height: auto !important;
            shape-rendering: crispEdges;
          }

          /* Reduce outer padding for print if needed */
          .print-container-inner {
            padding: 20px !important;
          }
        }

        /* Screen-only styles (optional) */
        @media screen {
          .print-container {
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            border-radius: 12px;
          }
        }
      `}</style>

      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        {/* This is the main printable area */}
        <div
          className="print-container print-container-inner inline-flex flex-col items-center"
          style={{
            backgroundColor: template.backgroundColor || '#ffffff',
            color: template.textColor || '#000000',
            padding: '32px',
            borderRadius: '12px',
          }}
        >
          {/* Top Tags */}
          {topTags.length > 0 && (
            <div className="mb-6 text-center space-y-2 w-full">
              {topTags.map((tag) => (
                <div
                  key={tag.id}
                  style={{
                    fontSize: `${tag.fontSize}px`,
                    fontWeight: tag.fontWeight as any,
                    fontFamily: tag.fontFamily || 'inherit',
                  }}
                >
                  {tag.value}
                </div>
              ))}
            </div>
          )}

          {/* QR + Left/Right Tags */}
          <div className="flex items-center justify-center gap-6 w-full">
            {/* Left Tags */}
            {leftTags.length > 0 && (
              <div className="space-y-2 text-right min-w-[120px]">
                {leftTags.map((tag) => (
                  <div
                    key={tag.id}
                    style={{
                      fontSize: `${tag.fontSize}px`,
                      fontWeight: tag.fontWeight as any,
                      fontFamily: tag.fontFamily || 'inherit',
                    }}
                  >
                    {tag.value}
                  </div>
                ))}
              </div>
            )}

            {/* QR Code – SVG for perfect print quality */}
            <div className="flex-shrink-0">
             
            </div>

            {/* Right Tags */}
            {rightTags.length > 0 && (
              <div className="space-y-2 text-left min-w-[120px]">
                {rightTags.map((tag) => (
                  <div
                    key={tag.id}
                    style={{
                      fontSize: `${tag.fontSize}px`,
                      fontWeight: tag.fontWeight as any,
                      fontFamily: tag.fontFamily || 'inherit',
                    }}
                  >
                    {tag.value}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Tags */}
          {bottomTags.length > 0 && (
            <div className="mt-6 text-center space-y-2 w-full">
              {bottomTags.map((tag) => (
                <div
                  key={tag.id}
                  style={{
                    fontSize: `${tag.fontSize}px`,
                    fontWeight: tag.fontWeight as any,
                    fontFamily: tag.fontFamily || 'inherit',
                  }}
                >
                  {tag.value}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Print button – hidden when printing */}
        <button
          onClick={() => window.print()}
          className="mt-8 px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors print:hidden"
        >
          Print QR Code
        </button>
      </div>
    </>
  );
}