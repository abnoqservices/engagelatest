(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/preview/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Template1
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/components/sections/Header'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
// ... import other section components
// Map section key → component
const sectionComponents = {
    header: Header,
    hero: HeroSection,
    features: Features,
    image_gallery: ImageGallery,
    testimonials: Testimonials,
    faq: FAQ,
    cta_banner: CTABanner
};
function Template1({ data }) {
    const { sections = [] } = data;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-white",
        children: sections.map(({ section, content })=>{
            const Component = sectionComponents[section];
            if (!Component) {
                console.warn(`No component found for section: ${section}`);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-8 text-center text-gray-400 border border-dashed",
                    children: [
                        "Missing component: ",
                        section
                    ]
                }, section, true, {
                    fileName: "[project]/app/preview/page.tsx",
                    lineNumber: 36,
                    columnNumber: 13
                }, this);
            }
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
                content: content
            }, section, false, {
                fileName: "[project]/app/preview/page.tsx",
                lineNumber: 42,
                columnNumber: 16
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/app/preview/page.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
_c = Template1;
var _c;
__turbopack_context__.k.register(_c, "Template1");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/preview/page.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/preview/page.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=app_preview_page_tsx_b915c108._.js.map