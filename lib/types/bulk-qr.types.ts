// lib/types/bulk-qr.types.ts
export interface BulkQRItem {
    id: string;
    productName?: string;
    sku?: string;
    productId?: string;
    url?: string;
    custom?: string;
    qrData: string;
    category:string
    // The actual data to encode in QR
  }
  
  export interface BulkQRGenerationSettings {
    template: string; // Template ID
    items: BulkQRItem[];
    layout: 'grid' | 'list';
    itemsPerPage: number;
    pageSize: 'A4' | 'Letter' | 'Label';
    orientation: 'portrait' | 'landscape';
  }