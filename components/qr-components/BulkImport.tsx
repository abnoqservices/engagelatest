// components/qr-components/BulkImport.tsx
'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import axiosClient from "@/lib/axiosClient";
import { showToast } from "@/lib/showToast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FileUp, Edit3, ListChecks ,Eye ,EyeOff ,QrCode} from "lucide-react";

// ───────────────────────────────────────────────
//               Extended Item Type
// ───────────────────────────────────────────────
export interface BulkQRItem {
  id: string;
  qrData: string;           // main content of the QR code

  // Fields for label printing / display
  productName?: string;
  sku?: string;
  productId?: string;
  url?: string;

  // ── Extra fields you can show on label ──
  brand?: string;
  category?: string;
  price?: number | string;
  salePrice?: number | string;
  color?: string;
  size?: string;
  weight?: string;
  stock?: number;
  barcode?: string;
  // Add more as needed: description, mpn, location, etc.
}

// ───────────────────────────────────────────────
interface Product {
  id: number | string;
  name: string;
  sku?: string;
  url_slug?: string;
  brand?: string;
  category?: string | { name: string };
  price?: number;
  sale_price?: number;
  color?: string;
  size?: string;
  weight?: string | number;
  stock?: number;
  barcode?: string;
  upc?: string;
  ean?: string;
  [key: string]: any;
}

interface BulkImportProps {
  onImport: (items: BulkQRItem[]) => void;
}

const AVAILABLE_LABEL_FIELDS = [
  { id: 'sku',        label: 'SKU' },
  { id: 'productName',label: 'Product Name' },
  { id: 'productId',  label: 'Product ID' },
  { id: 'price',      label: 'Price' },
  { id: 'salePrice',  label: 'Sale Price' },
  { id: 'color',      label: 'Color' },
  { id: 'size',       label: 'Size' },
  { id: 'brand',      label: 'Brand' },
  { id: 'category',   label: 'Category' },
  { id: 'stock',      label: 'Stock Qty' },
  { id: 'barcode',    label: 'Barcode' },
] as const;

type LabelFieldId = typeof AVAILABLE_LABEL_FIELDS[number]['id'];

export default function BulkImport({ onImport }: BulkImportProps) {
  const [importMethod, setImportMethod] = useState<'csv' | 'manual' | 'select'>('csv');

  // ── CSV / Drag & Drop ──
  const [dragActive, setDragActive] = useState(false);

  // ── Manual Entry ──
  const [manualData, setManualData] = useState('');

  // ── Select Products from API ──
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  // ── Search & Field selection ──
  const [searchQuery, setSearchQuery] = useState('');
  const [showFields, setShowFields] = useState(false);
  const [selectedLabelFields, setSelectedLabelFields] = useState<Set<LabelFieldId>>(
    new Set(['sku', 'productName', 'price','category']) // sensible defaults
  );

  // Fetch products when tab is opened
  useEffect(() => {
    if (importMethod === 'select' && products.length === 0) {
      loadProducts();
    }
  }, [importMethod]);

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      setProductsError(null);

      const { data } = await axiosClient.get('/products', {
        params: {
          per_page: 100,
          is_active: true,
        }
      });
      console.log('Products response:', data);
      if (data?.success && Array.isArray(data.data?.data)) {
        setProducts(data.data.data);
      } else {
        throw new Error("Invalid products response");
      }
    } catch (err) {
      console.error(err);
      setProductsError("Failed to load products");
      showToast("Cannot load product list", 'error');
    } finally {
      setLoadingProducts(false);
    }
  };

  // ── Filtered products for search ──
  const filteredProducts = products.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.sku || '').toLowerCase().includes(q) ||
      String(p.id || '').toLowerCase().includes(q) ||
      (p.barcode || '').toLowerCase().includes(q) ||
      (p.upc || '').toLowerCase().includes(q) ||
      (p.ean || '').toLowerCase().includes(q)
    );
  });

  // ─────────────────────────────
  //          CSV HANDLERS
  // ─────────────────────────────
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      showToast("Please upload a .csv file", 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseAndImportCSV(text);
    };
    reader.readAsText(file);
  };

  const parseAndImportCSV = (text: string) => {
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) {
      showToast("CSV must have header + at least 1 row", 'error');
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const items: BulkQRItem[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const item: BulkQRItem = {
        id: `bulk-${Date.now()}-${i}`,
        qrData: '',
      };

      headers.forEach((header, idx) => {
        const val = values[idx] || '';
        switch (header) {
          case 'productname': case 'product_name': case 'name':
            item.productName = val; break;
          case 'sku':
            item.sku = val; break;
          case 'productid': case 'product_id': case 'id':
            item.productId = val; break;
          case 'url': case 'link':
            item.url = val;
            item.qrData = val; break;
          case 'qrdata': case 'qr_data': case 'data':
            item.qrData = val; break;
            case 'category': case 'Category': 
            item.category = val; break;
            case 'price': case 'Price': 
            item.price = val; break;
        }
      });

      if (!item.qrData) {
        item.qrData = item.url || item.productId || item.sku || `item-${i}`;
      }

      items.push(item);
    }

    onImport(items);
    showToast(`Imported ${items.length} items from CSV`, 'success');
  };

  // ─────────────────────────────
  //       MANUAL ENTRY
  // ─────────────────────────────
  const handleManualImport = () => {
    if (!manualData.trim()) return;

    const lines = manualData.split('\n').filter(Boolean);
    const items: BulkQRItem[] = lines.map((line, i) => {
      const [name = '', sku = '', pid = '', url = ''] = line.split(',').map(p => p.trim());
      return {
        id: `manual-${Date.now()}-${i}`,
        productName: name,
        sku,
        productId: pid,
        url,
        qrData: url || pid || sku || `manual-${i}`,
      };
    });

    onImport(items);
    showToast(`Imported ${items.length} items manually`, 'success');
    setManualData('');
  };

  // ─────────────────────────────
  //     SELECT PRODUCTS
  // ─────────────────────────────
  const toggleSelect = (id: string | number) => {
    setSelectedIds(prev => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === products.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(products.map(p => p.id)));
    }
  };

  const selectAllVisible = () => {
    const visibleIds = new Set(filteredProducts.map(p => p.id));
    const allVisibleSelected = filteredProducts.every(p => selectedIds.has(p.id));

    setSelectedIds(prev => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        visibleIds.forEach(id => next.delete(id));
      } else {
        filteredProducts.forEach(p => next.add(p.id));
      }
      return next;
    });
  };

  const toggleLabelField = (field: LabelFieldId) => {
    setSelectedLabelFields(prev => {
      const copy = new Set(prev);
      if (copy.has(field)) copy.delete(field);
      else copy.add(field);
      return copy;
    });
  };

  const importSelectedProducts = () => {
    const selected = products.filter(p => selectedIds.has(p.id));
  
    const items: BulkQRItem[] = selected.map((p, i) => {
      const url = p.url_slug ? `${window.location.origin}/preview/${p.url_slug}` : `${window.location.origin}/preview/${p.id}`;
       
      const item: BulkQRItem = {
        id: `prod-${Date.now()}-${i}`,
        qrData: url,
        productName: p.name || 'Unnamed',
        sku: p.sku || '',
        productId: String(p.id),
        url,
        category: typeof p.category === 'object' ? p.category.name : p.category,
        price: p.price ?? p.sale_price,
      };

      if (selectedLabelFields.has('brand'))     item.brand     = p.brand;
      if (selectedLabelFields.has('category'))  item.category  = typeof p.category === 'object' ? p.category.name : p.category;
      if (selectedLabelFields.has('price'))     item.price     = p.price ?? p.sale_price;
      if (selectedLabelFields.has('salePrice')) item.salePrice = p.sale_price;
      if (selectedLabelFields.has('color'))     item.color     = p.color;
      if (selectedLabelFields.has('size'))      item.size      = p.size;
      if (selectedLabelFields.has('stock'))     item.stock     = p.stock;
      if (selectedLabelFields.has('barcode'))   item.barcode   = p.barcode || p.upc || p.ean;

      return item;
    });

    if (items.length === 0) {
      showToast("No products selected", 'warning');
      return;
    }

    onImport(items);
    showToast(`Imported ${items.length} product(s) with selected label fields`, 'success');
  };
  const allVisibleSelected =
  filteredProducts.length > 0 &&
  filteredProducts.every(p => selectedIds.has(p.id));
  const deselectVisible = () => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      filteredProducts.forEach(p => next.delete(p.id));
      return next;
    });
  };
  const truncateWords = (text: string, limit = 8) => {
    const words = text.split(" ");
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "..."
      : text;
  };
  return (
    <TooltipProvider>
      <div className="space-y-6">

        {/* TABS */}
        <div className="grid grid-cols-3 gap-3">
          {(['csv', 'manual', 'select'] as const).map(method => (
            <button
              key={method}
              type="button"
              onClick={() => setImportMethod(method)}
              className={`
                py-3 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2
                ${importMethod === method
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
              `}
            >
              {method === "csv" && <FileUp className="h-5 w-5" />}
              {method === "manual" && <Edit3 className="h-5 w-5" />}
              {method === "select" && <ListChecks className="h-5 w-5" />}
              {/* <span className="capitalize">{method}</span> */}
            </button>
          ))}
        </div>

        {/* CSV AREA */}
        {importMethod === 'csv' && (
          <div className="space-y-4">
            <div
              className={`
                border-2 border-dashed rounded-xl p-10 text-center transition-all
                ${dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400 bg-gray-50'}
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-3">
                <p className="text-gray-600 font-medium">
                  Drag & drop CSV file here
                </p>
                <p className="text-sm text-gray-500">or</p>

                <label className="cursor-pointer">
                  <span className="
                    inline-block px-6 py-2.5 
                    bg-white border border-gray-300 
                    rounded-lg text-sm font-medium
                    hover:bg-gray-50 transition
                  ">
                    Choose File
                  </span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="text-xs text-gray-500 bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold mb-1.5">Expected columns (case insensitive):</p>
              <p>productName, sku, productId, url, qrData</p>
              <p className="mt-1">qrData will be auto-generated if missing</p>
            </div>
          </div>
        )}

        {/* MANUAL ENTRY */}
        {importMethod === 'manual' && (
          <div className="space-y-4">
            <textarea
              value={manualData}
              onChange={e => setManualData(e.target.value)}
              placeholder="One product per line (comma separated)\nProduct Name, SKU123, PID-001, https://example.com/product\nTest Item, ABC-999, 1001, https://..."
              rows={10}
              className="
                w-full p-4 rounded-lg border border-gray-300 
                font-mono text-sm resize-none
                focus:border-blue-500 focus:ring-1 focus:ring-blue-500
              "
            />

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {manualData.trim().split('\n').filter(Boolean).length} lines
              </span>

              <button
                onClick={handleManualImport}
                disabled={!manualData.trim()}
                className="
                  px-6 py-2.5 bg-blue-600 text-white rounded-lg
                  font-medium hover:bg-blue-700 disabled:bg-gray-400
                  disabled:cursor-not-allowed transition
                "
              >
                Import Lines
              </button>
            </div>
          </div>
        )}

        {/* SELECT PRODUCTS */}
        {importMethod === 'select' && (
          <div className="space-y-5">

            {/* Top bar – search + fields toggle */}
            <div className="sticky top-0 z-10 bg-white pb-3 border-b -mx-1 px-1">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by name, SKU, ID…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                  <button
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded font-medium ${
                      showFields
                        ? "bg-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                    onClick={() => setShowFields(!showFields)}
                    title="Show Fields"
                  >
                    <QrCode className="h-4 w-4" />

                    <span>Tags</span>

                    {selectedLabelFields.size > 0 && (
                      <span className="ml-1 rounded-full bg-blue-600 text-white text-xs px-2 py-0.5">
                        {selectedLabelFields.size}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Collapsible field selector */}
              {showFields && (
                <div className="mt-3 p-3 bg-gradient-50 border rounded-lg animate-in fade-in">
                  <p className="text-xs font-medium text-gray-700 mb-2">Show on label:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                    {AVAILABLE_LABEL_FIELDS.map(f => (
                      <label key={f.id} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          id={`f-${f.id}`}
                          checked={selectedLabelFields.has(f.id)}
                          onCheckedChange={() => toggleLabelField(f.id)}
                          className="h-4 w-4"
                        />
                        <span className="text-gray-700 text-sm truncate max-w-[120px]">  {truncateWords(f.label, 8)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Selection summary + bulk actions */}
              <div className="flex items-center justify-between text-sm mt-3">
                <span className="text-gray-600 font-medium">
                  {selectedIds.size} selected • {filteredProducts.length} visible
                </span>

                <div className="flex gap-4 text-xs items-center">
                  {/* Toggle Select Visible */}
                  <button
                    onClick={allVisibleSelected ? deselectVisible : selectAllVisible}
                    className="p-1 rounded text-blue-600 hover:bg-blue-50"
                    title={allVisibleSelected ? "Deselect visible" : "Select visible"}
                  >
                    {allVisibleSelected ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>

                  {/* Select / Deselect All */}
                  <button
                    onClick={selectAll}
                    className="text-blue-600 hover:underline"
                  >
                    {selectedIds.size === products.length ? "Deselect all" : "Select all"}
                  </button>
                </div>
              </div>
            </div>

            {/* Product list */}
            {loadingProducts ? (
              <div className="py-20 text-center text-gray-400">Loading products…</div>
            ) : productsError ? (
              <div className="py-12 text-center text-red-600">{productsError}</div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-16 text-center text-gray-500">
                {searchQuery ? "No matching products" : "No products found"}
              </div>
            ) : (
              <div className="
                 rounded-lg divide-y max-h-[420px] overflow-y-auto
                scrollbar-thin scrollbar-thumb-gray-300
              ">
                {filteredProducts.map(product => (
  <label
    key={product.id}
    className={`
      group flex items-center gap-3 px-4 py-2.5 flex items-center justify-between p-2 rounded hover:bg-gray-100 
      hover:bg-gray-50/80 transition-colors cursor-pointer
      ${selectedIds.has(product.id) 
        ? 'bg-indigo-50/40 border-l-4 border-indigo-400' 
        : 'border-l-4 border-transparent'
      }
    `}
  >
     <span className="text-xs truncate">#{product.id}</span>
    <Checkbox
      checked={selectedIds.has(product.id)}
      onCheckedChange={() => toggleSelect(product.id)}
      className="h-4 w-4 flex-shrink-0 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
    />

    <div className="flex-1 min-w-0">
      <div className="flex items-baseline gap-2 text-sm">
        <span className="flex-1 text-xs truncate">
          {product.name || 'Untitled Product'}
        </span>

        {product.sku && (
          <>
            <span className="text-gray-300">•</span>
            <span className="flex-1 text-xs truncate">
              {product.sku}
            </span>
          </>
        )}
      </div>

      {/* Optional subtle secondary line – only if you have useful extra info */}
      {(product.color || product.variant) && (
        <div className="text-xs text-gray-500 mt-0.5">
          {product.color && <span>{product.color}</span>}
          {product.variant && <span>{product.variant}</span>}
        </div>
      )}
    </div>

   
  </label>
))}
              </div>
            )}

            {/* Import button */}
            <div className="sticky bottom-0 left-0 right-0 bg-white pt-4 border-t -mx-1 px-1">
              <button
                onClick={importSelectedProducts}
                disabled={selectedIds.size === 0}
                className="
                  w-full py-3 bg-blue-600 text-white rounded-lg font-medium
                  disabled:bg-gray-300 disabled:cursor-not-allowed
                  shadow-md hover:bg-blue-700 transition
                "
              >
                Import Selected ({selectedIds.size})
              </button>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}