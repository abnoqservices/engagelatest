// app/catalog/page.tsx   (or wherever your main catalog page lives)
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import CompanyHeaderCompact from '@/components/catalog/CompanyHeader'; // ← updated compact version
import HeroSection from '@/components/catalog/HeroSection';
import AboutSection from '@/components/catalog/AboutSection';
import ProductList from '@/components/catalog/ProductList';
import ProductModal from '@/components/catalog/ProductModal';
import ContactSection from '@/components/catalog/ContactSection';
import { mockData } from '@/lib/mockCatalogData';

// ─── Filter Type & Default ────────────────────────────────────────
interface ProductFilters {
  search: string;
  categories: string[];
  priceMin: number;
  priceMax: number;
}

const initialFilters: ProductFilters = {
  search: '',
  categories: [],
  priceMin: 0,
  priceMax: 100000, // covers all your current mock prices
};

export default function CatalogPage() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);

  const data = mockData;

  // ─── Filtering Logic ──────────────────────────────────────────────
  const filteredProducts = data.products.filter((product) => {
    // Search in name or description
    const matchesSearch =
      filters.search === '' ||
      product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.description.toLowerCase().includes(filters.search.toLowerCase());

    // Category filter
    const matchesCategory =
      filters.categories.length === 0 ||
      filters.categories.includes(product.category);

    // Price filter – parse ₹ and commas
    const priceNum = Number(product.price.replace(/[₹,]/g, '')) || 0;
    const matchesPrice = priceNum >= filters.priceMin && priceNum <= filters.priceMax;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-stone-100">
      {/* ─── Compact Header with Filters ─────────────────────────────── */}
      <CompanyHeaderCompact
        logo={data.logo}
        name={data.name}
        tagline={data.tagline}
        onSearch={(query) => setFilters((prev) => ({ ...prev, search: query }))} // optional – if you want header search separate
        viewMode={viewMode}
        onViewChange={setViewMode}
        filters={filters}
        setFilters={setFilters}
      />

      {/* Hero – kept as is */}
      <HeroSection
        logo={data.logo}
        name={data.name}
        tagline={data.tagline}
        description={data.description}
      />

      {/* Product List – now filtered */}
      <ProductList
        products={filteredProducts}           // ← filtered version
        onProductClick={setSelectedProduct}
        viewMode={viewMode}                   // pass if ProductList supports grid/list toggle
      />

      {/* About & Contact */}
      <AboutSection
        about={data.about}
        mission={data.mission}
        vision={data.vision}
      />

      <ContactSection
        address={data.address}
        phone={data.phone}
        email={data.email}
        website={data.website}
        socialLinks={data.socialLinks}
      />

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogTitle className="sr-only">{selectedProduct?.name}</DialogTitle>
        <DialogContent
          className="
            !max-w-[90vw] sm:!max-w-[820px] md:!max-w-[960px] lg:!max-w-[1100px]
            max-h-[92vh] sm:max-h-[88vh]
            p-0 overflow-hidden
            rounded-xl sm:rounded-2xl
            border border-gray-200/60 shadow-2xl
          "
        >
          {selectedProduct && (
            <ProductModal
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}