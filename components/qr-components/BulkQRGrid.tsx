// components/qr-components/BulkQRGrid.tsx
'use client';

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QRTemplate } from '@/lib/types/qr.types';
import { BulkQRItem } from '@/lib/types/bulk-qr.types';

interface BulkQRGridProps {
  items: BulkQRItem[];
  template: QRTemplate;
  layout: 'grid' | 'list';
  itemsPerRow: number;
}

export default function BulkQRGrid({ items, template, layout, itemsPerRow }: BulkQRGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!containerRef.current) return;

  const canvases = containerRef.current.querySelectorAll("canvas");

  canvases.forEach((canvas, index) => {
    if (!items[index]) return;

    QRCode.toCanvas(
      canvas,
      items[index].qrData,
      {
        width: template.qrSize,
        margin: 1,

        // 🎨 QR colors
        color: {
          dark: template.textColor || "#000000",       // QR code color
          light: template.backgroundColor || "#ffffff" // Background color
        }
      },
      (error) => {
        if (error) console.error("QR error:", error);
      }
    );
  });
}, [items, template.qrSize, template.textColor, template.backgroundColor]);


  const getTagValue = (item: BulkQRItem, fieldType: string): string => {
    switch (fieldType) {
      case 'productName':
        return item.productName || '';
      case 'sku':
        return item.sku || '';
      case 'productId':
        return item.productId || '';
      case 'url':
        return item.url || '';
      case 'custom':
        return item.custom || '';
      default:
        case 'category':
          return item.category || '';
        return '';
    }
  };

  const renderQRItem = (item: BulkQRItem, index: number) => {
    const topTags = template.tags.filter((t) => t.enabled && t.position === 'top');
    const bottomTags = template.tags.filter((t) => t.enabled && t.position === 'bottom');
    const leftTags = template.tags.filter((t) => t.enabled && t.position === 'left');
    const rightTags = template.tags.filter((t) => t.enabled && t.position === 'right');

    return (
      <div
        key={item.id}
        className="qr-item inline-flex flex-col items-center break-inside-avoid"
        style={{
          backgroundColor: template.backgroundColor,
          color: template.textColor,
          padding: '1rem',
          borderRadius: '0.5rem',
          margin: '0.5rem',
        }}
      >
        {/* Top Tags */}
        {topTags.length > 0 && (
          <div className="mb-2 text-center space-y-1">
            {topTags.map((tag) => (
              <div
                key={tag.id}
                style={{
                  fontSize: `${tag.fontSize}px`,
                  fontWeight: tag.fontWeight,
                }}
              >
                {getTagValue(item, tag.field) || tag.value}
              </div>
            ))}
          </div>
        )}

        {/* QR Code with Left/Right Tags */}
        <div className="flex items-center gap-2">
          {/* Left Tags */}
          {leftTags.length > 0 && (
            <div className="space-y-1 text-right">
              {leftTags.map((tag) => (
                <div
                  key={tag.id}
                  style={{
                    fontSize: `${tag.fontSize}px`,
                    fontWeight: tag.fontWeight,
                  }}
                >
                  {getTagValue(item, tag.field) || tag.value}
                </div>
              ))}
            </div>
          )}

          {/* QR Code */}
          <canvas data-index={index} />

          {/* Right Tags */}
          {rightTags.length > 0 && (
            <div className="space-y-1 text-left">
              {rightTags.map((tag) => (
                <div
                  key={tag.id}
                  style={{
                    fontSize: `${tag.fontSize}px`,
                    fontWeight: tag.fontWeight,
                  }}
                >
                  {getTagValue(item, tag.field) || tag.value}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Tags */}
        {bottomTags.length > 0 && (
          <div className="mt-2 text-center space-y-1">
            {bottomTags.map((tag) => (
              <div
                key={tag.id}
                style={{
                  fontSize: `${tag.fontSize}px`,
                  fontWeight: tag.fontWeight,
                }}
              >
                {getTagValue(item, tag.field) || tag.value}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const gridStyle = layout === 'grid' 
    ? {
        display: 'grid',
        gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)`,
        gap: '1rem',
      }
    : {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '1rem',
      };

  return (
    <div ref={containerRef} style={gridStyle} className="p-4">
      {items.map((item, index) => renderQRItem(item, index))}
    </div>
  );
}