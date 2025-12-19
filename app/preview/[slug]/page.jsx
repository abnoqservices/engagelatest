import { Metadata } from "next";
import LandingPageClient from "./LandingPageClient";
import axiosClient from "@/lib/axiosClient";


// export async function generateMetadata({ params }) {
//   const { slug } = await params;
//   const productId = Number(slug);

//   if (isNaN(productId)) {
//     return {
//       title: "Invalid Product",
//       description: "The product ID is invalid.",
//       robots: { index: false, follow: false },
//     };
//   }

//   try {
  

//     const res = await axiosClient.get(`/products/${slug}`);

//     if (res.data?.success && res.data?.data) {
//       const product = res.data.data;

//       return {
//         title: product.meta_title || product.name || "Product Preview",
//         description: product.meta_description || "Preview of the product landing page.",
//         keywords: product.keywords || undefined,
//         openGraph: {
//           title: product.meta_title || product.name || "Product Preview",
//           description: product.meta_description || "Preview of the product landing page.",
//           locale: "en_IN",
//           type: "website",
//         },
//         robots: { index: false, follow: false },
//       };
//     }
//   } catch (error) {
//     console.error("Failed to fetch metadata:", error.response?.status || error.message);
   
//   }

//   return {
//     title: "Product Preview",
//     description: "Loading product details...",
//     robots: { index: false, follow: false },
//   };
// }

export default async function LandingPage({ params }) {
  const { slug } = await params;
  const productId = Number(slug);

  // Optional: early invalid ID handling (you can also let client handle it)
  if (isNaN(productId)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl text-red-600">Invalid Product ID</p>
      </div>
    );
  }

  return <LandingPageClient slug={productId} />;
}