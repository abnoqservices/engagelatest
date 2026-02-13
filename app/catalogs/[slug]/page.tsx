'use client';

import { useState } from 'react';
import { Dialog,DialogContent } from '@/components/ui/dialog'; // your dialog primitive
import CompanyHeader from '@/components/catalog/CompanyHeader';
import HeroSection from '@/components/catalog/HeroSection';
import AboutSection from '@/components/catalog/AboutSection';
import ProductList from '@/components/catalog/ProductList';
import ProductModal from '@/components/catalog/ProductModal';
import ContactSection from '@/components/catalog/ContactSection';
import { mockData } from '@/lib/mockCatalogData';
const data = mockData;

export default function CatalogPage() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const data = mockData; // replace with real data fetch

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-stone-100">
      <CompanyHeader
        logo={data.logo}
        name={data.name}
        tagline={data.tagline}
        description={data.description}
      />

      <HeroSection />

      <AboutSection
        about={data.about}
        mission={data.mission}
        vision={data.vision}
      />

<ProductList 
  products={data.products} 
  onProductClick={setSelectedProduct} 
/> 

      <ContactSection
  address={data.address}
  phone={data.phone}
  email={data.email}
  website={data.website}
  socialLinks={data.socialLinks}
/>
<Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
  <DialogContent className="!max-w-5xl p-0 sm:max-w-[90vw] overflow-hidden">
    {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
  </DialogContent>
</Dialog>
    </div>
  );
}