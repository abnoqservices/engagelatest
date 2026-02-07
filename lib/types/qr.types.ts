// types/qr.types.ts
export type TagPosition = 'top' | 'bottom' | 'left' | 'right';
export type TagField = 'productName' | 'sku' | 'productId' | 'url' | 'custom' | 'category' | 'price';

export interface Tag {
  id: string;
  field: TagField;
  label: string;
  value: string;
  position: TagPosition;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  enabled: boolean;
  fontFamily:string;
}

export interface QRTemplate {
  id: string;
  name: string;
  qrSize: number;
  backgroundColor: string;
  textColor: string;
  dotStyle?: string;
  cornerStyle?: string;
  eyeColor?: string;
  gradientOnDots?: boolean;
  gradientColor1?: string;
  gradientColor2?: string;
  logoUrl?: string;
  tags: Tag[];
}

export const DEFAULT_TEMPLATES: QRTemplate[] = [
    {
        id: "template-1769082461125",
        name: "Pro Qr Template",
        qrSize: 180,
        backgroundColor: "#f8f9fa",
        textColor: "#212529",
        tags: [
            {
                id: "tag-1",
                field: "productName",
                label: "Product Name",
                value: "Premium Product",
                position: "top",
                fontSize: 18,
                fontWeight: "bold",
                enabled: true,
                fontFamily: "Arial"
                
            },
            {
                id: "tag-2",
                field: "sku",
                label: "SKU",
                value: "SKU-67890",
                position: "bottom",
                fontSize: 14,
                fontWeight: "normal",
                enabled: true,
                fontFamily: "Arial"
            },
            {
                id: "tag-3",
                field: "productId",
                label: "ID",
                value: "PID-001",
                position: "bottom",
                fontSize: 14,
                fontWeight: "normal",
                enabled: true,
                fontFamily: "Arial"
            },
            {
                id: "tag-4",
                field: "url",
                label: "URL",
                value: "product.com/item",
                position: "bottom",
                fontSize: 11,
                fontWeight: "normal",
                enabled: true,
                fontFamily: "Arial"
            }
        ]
    },
    {
    id: 'template-1',
    name: 'Product Label - Compact',
    qrSize: 150,
    backgroundColor: '#ffffff',
    textColor: '#000000',
    tags: [
      {
        id: 'tag-1',
        field: 'sku',
        label: 'Product Name',
        value: 'Sample Product',
        position: 'top',
        fontSize: 16,
        fontWeight: 'bold',
        enabled: true,
        fontFamily: "Arial"
      },
      {
        id: 'tag-2',
        field: 'sku',
        label: 'SKU',
        value: 'SKU-12345',
        position: 'bottom',
        fontSize: 12,
        fontWeight: 'normal',
        enabled: true,
        fontFamily: "Arial"
      },
    ],
  },
  {
    id: 'template-2',
    name: 'Detailed Product Card',
    qrSize: 180,
    backgroundColor: '#f8f9fa',
    textColor: '#212529',
    tags: [
      {
        id: 'tag-1',
        field: 'productName',
        label: 'Product Name',
        value: 'Premium Product',
        position: 'top',
        fontSize: 18,
        fontWeight: 'bold',
        enabled: true,
        fontFamily: "Arial"
      },
      {
        id: 'tag-2',
        field: 'sku',
        label: 'SKU',
        value: 'SKU-67890',
        position: 'left',
        fontSize: 14,
        fontWeight: 'normal',
        enabled: true,
        fontFamily: "Arial"
      },
      {
        id: 'tag-3',
        field: 'productId',
        label: 'ID',
        value: 'PID-001',
        position: 'right',
        fontSize: 14,
        fontWeight: 'normal',
        enabled: true,
        fontFamily: "Arial"
      },
      {
        id: 'tag-4',
        field: 'url',
        label: 'URL',
        value: 'product.com/item',
        position: 'bottom',
        fontSize: 11,
        fontWeight: 'normal',
        enabled: true,
        fontFamily: "Arial"
      },
    ],
  },
  {
    id: 'template-3',
    name: 'Warehouse Label',
    qrSize: 200,
    backgroundColor: '#fffbeb',
    textColor: '#78350f',
    tags: [
      {
        id: 'tag-1',
        field: 'sku',
        label: 'SKU',
        value: 'WH-SKU-789',
        position: 'top',
        fontSize: 14,
        fontWeight: 'bold',
        enabled: true,
        fontFamily: "Arial"
      },
      {
        id: 'tag-2',
        field: 'productName',
        label: 'Item',
        value: 'Warehouse Item',
        position: 'top',
        fontSize: 12,
        fontWeight: 'normal',
        enabled: true,
        fontFamily: "Arial"
      },
      {
        id: 'tag-3',
        field: 'productId',
        label: 'Location',
        value: 'A-12-05',
        position: 'bottom',
        fontSize: 16,
        fontWeight: 'bold',
        enabled: true,
        fontFamily: "Arial"
      },
    ],
  },
  {
    id: 'template-4',
    name: 'Minimal QR Only',
    qrSize: 160,
    backgroundColor: '#ffffff',
    textColor: '#374151',
    tags: [
      {
        id: 'tag-1',
        field: 'url',
        label: 'Scan Me',
        value: 'Scan for details',
        position: 'bottom',
        fontSize: 11,
        fontWeight: 'normal',
        enabled: true,
        fontFamily: "Arial"
      },
    ],
  },
];