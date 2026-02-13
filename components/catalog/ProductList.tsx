// components/catalog/ProductList.tsx
import { ChevronRight, ShoppingCart } from 'lucide-react';

interface Product {
  image: string;
  name: string;
  description: string;
  price: string;
  cta?: string;           // optional – fallback to "View Details"
  category?: string;      // optional – can show badge
  inStock?: boolean;      // optional – can show out-of-stock overlay
}

interface ProductListProps {
  products: Product[];
  onProductClick?: (product: Product) => void;  // optional – for opening modal/detail page
}

export default function ProductList({ products, onProductClick }: ProductListProps) {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Our Curated Collection
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
            Handcrafted pieces that blend timeless design with everyday luxury
          </p>
        </div>

        {/* Product grid */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            <div
              key={index}
              onClick={() => onProductClick?.(product)}
              className={`
                group relative bg-white rounded-2xl overflow-hidden 
                 border-slate-100 shadow-sm 
                transition-all duration-300 
                hover:shadow-2xl hover:-translate-y-2 hover:border-amber-200/60
                cursor-pointer
              `}
            >
              {/* Image container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Optional category badge */}
                {product.category && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-slate-800 shadow-sm">
                      {product.category}
                    </span>
                  </div>
                )}

                {/* Out of stock overlay */}
                {product.inStock === false && (
                  <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                    <span className="rounded-full bg-white px-6 py-2 text-base font-semibold text-slate-900 shadow-lg">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-slate-900 line-clamp-2 group-hover:text-amber-800 transition-colors">
                  {product.name}
                </h3>

                                <p 
                className="
                    text-sm text-slate-600 
                    leading-6
                    h-[4.5rem]               /* exactly 4.5rem high */
                    overflow-hidden
                    text-ellipsis
                "
                style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}
                >
                { product.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-2xl font-bold text-amber-700">
                    {product.price}
                  </span>

                  <button
                    className={`
                      inline-flex items-center gap-2 text-sm font-medium 
                      ${product.inStock !== false 
                        ? 'text-amber-700 hover:text-amber-900' 
                        : 'text-slate-400 cursor-not-allowed'}
                      transition-colors
                    `}
                    disabled={product.inStock === false}
                  >
                    {product.cta || 'View Details'}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Optional quick add to cart button (small) */}
                {product.inStock !== false && (
                  <button
                    className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-amber-700 hover:to-orange-700 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Added ${product.name} to cart!`);
                    }}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Quick Add
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Optional "View All" button if you have pagination or more products */}
        {products.length > 6 && (
          <div className="mt-12 text-center">
            <button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-base font-semibold text-white hover:bg-slate-800 transition-colors">
              View All Collections
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}