(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/preview/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
;
;
"use client";
;
;
// Dynamically load templates (avoids SSR issues)
const Template1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(_c = ()=>__turbopack_context__.A("[project]/components/Template1.tsx [app-client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/components/Template1.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: true
});
_c1 = Template1;
const Template2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(_c2 = ()=>__turbopack_context__.A("[project]/components/Template2.tsx [app-client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/components/Template2.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: true
});
_c3 = Template2;
const Perview = ({ data })=>{
    const getTemplateComponent = (type)=>{
        switch(type){
            case "modern":
                return Template1;
            case "basic":
                return Template2;
            default:
                return null;
        }
    };
    const ContentComponent = getTemplateComponent(data.templateName);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: ContentComponent ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ContentComponent, {
            data: data
        }, void 0, false, {
            fileName: "[project]/app/preview/page.tsx",
            lineNumber: 37,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: "No template selected"
        }, void 0, false, {
            fileName: "[project]/app/preview/page.tsx",
            lineNumber: 39,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/app/preview/page.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c4 = Perview;
const __TURBOPACK__default__export__ = Perview;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "Template1$dynamic");
__turbopack_context__.k.register(_c1, "Template1");
__turbopack_context__.k.register(_c2, "Template2$dynamic");
__turbopack_context__.k.register(_c3, "Template2");
__turbopack_context__.k.register(_c4, "Perview");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
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
}),
"[project]/app/preview/page.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/preview/page.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=app_preview_page_tsx_b915c108._.js.map