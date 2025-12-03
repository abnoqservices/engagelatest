"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamically load templates (avoids SSR issues)
const Template1 = dynamic(() => import("@/components/Template1"), { ssr: true });
const Template2 = dynamic(() => import("@/components/Template2"), { ssr: true });

interface PreviewData {
  templateName: string;
  sections?: any[];
  [key: string]: any;
}

interface PerviewProps {
  data: PreviewData;
}

const Perview: React.FC<PerviewProps> = ({ data }) => {
  const getTemplateComponent = (type: string) => {
    switch (type) {
      case "modern":
        return Template1;
      case "basic":
        return Template2;
      default:
        return null;
    }
  };

  const ContentComponent = getTemplateComponent(data.templateName);

  return (
    <div>
      {ContentComponent ? (
        <ContentComponent data={data} />
      ) : (
        <div>No template selected</div>
      )}
    </div>
  );
};

export default Perview;

// "use client";

// import React from "react";
// import dynamic from "next/dynamic";
// import { Skeleton } from "@/components/ui/skeleton"
// // ⛔ Prevent Next.js preloading chunks
// const Template1 = dynamic(() => import("@/components/Template1"), {
//   ssr: true,
//   loading: () => null,
// });

// const Template2 = dynamic(() => import("@/components/Template2"), {
//   ssr: true,
//   loading: () => null,
// });

// interface PreviewData {
//   templateName: string;
//   sections?: any[];
//   [key: string]: any;
// }

// interface PerviewProps {
//   data: PreviewData;
// }

// const Perview: React.FC<PerviewProps> = ({ data }) => {
//   const [localLoading, setLocalLoading] = React.useState(false);

//   const getTemplateComponent = (type: string) => {
//     switch (type) {
//       case "modern":
//         return Template1;
//       case "basic":
//         return Template2;
//       default:
//         return null;
//     }
//   };

//   // Only switch templates when name changes
//   const ContentComponent = React.useMemo(
//     () => getTemplateComponent(data.templateName),
//     [data.templateName]
//   );

//   // 🔥 Show loader ONLY inside this component
//   React.useEffect(() => {
//     setLocalLoading(true);
//     const t = setTimeout(() => setLocalLoading(false), 300);
//     return () => clearTimeout(t);
//   }, [data]); // runs whenever preview data updates

//   return (
//     <div className="relative">
//       {/* Local Loader */}
//       {localLoading && (
//             <div className="relative min-h-screen bg-background">
//             {/* Centered Logo while loading */}
//             <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
//               <div className="rounded-2xl p-8 shadow-1xl animate-pulse">
//                 <img 
//                   src="https://www.abnoq.com/images/Abnoq-logo.svg" 
//                   alt="Company Logo" 
//                   className="h-16 w-16 object-contain" 
//                 />
//               </div>
//             </div>
          
//             {/* Your existing skeleton content */}
//             <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
//               {/* Header Skeleton */}
//               <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//                 <div className="space-y-2">
//                   <Skeleton className="h-8 w-[200px]" />
//                   <Skeleton className="h-4 w-[300px]" />
//                 </div>
//                 <Skeleton className="h-10 w-[140px]" />
//               </div>
          
//               {/* Filters Bar Skeleton */}
//               <div className="rounded-xl border border-slate-200 bg-card p-4 shadow-sm">
//                 <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//                   <Skeleton className="h-10 w-full max-w-md" />
//                   <div className="flex flex-wrap gap-2">
//                     <Skeleton className="h-10 w-[140px]" />
//                     <Skeleton className="h-10 w-[120px]" />
//                     <Skeleton className="h-10 w-10" />
//                     <Skeleton className="h-10 w-[120px]" />
//                   </div>
//                 </div>
//               </div>
//               <div className="rounded-xl border border-slate-200 bg-card p-4 shadow-sm">
//                 <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//                   <Skeleton className="h-10 w-full max-w-md" />
//                   <div className="flex flex-wrap gap-2">
//                     <Skeleton className="h-10 w-[140px]" />
//                     <Skeleton className="h-10 w-[120px]" />
//                     <Skeleton className="h-10 w-10" />
//                     <Skeleton className="h-10 w-[120px]" />
//                   </div>
//                 </div>
//               </div>
            
//               {/* Table Skeleton */}
            
//             </div>
//           </div>
//       )}

//       {/* Render Template */}
//       {ContentComponent ? (
//         <ContentComponent data={data} />
//       ) : (
//         <div>No template selected</div>
//       )}
//     </div>
//   );
// };

// export default React.memo(Perview);

