(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/landing-pages/new/page.client.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// @/components/Template1.tsx
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
const sectionMap = {
    header: Header
};
function Template1({ data }) {
    const { sections = [] } = data;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-white",
        children: sections.map(({ section, content })=>{
            const SectionComponent = sectionMap[section];
            if (!SectionComponent) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "py-8 px-4 text-center text-gray-500 border-b",
                    children: [
                        'Section "',
                        section,
                        '" not implemented yet'
                    ]
                }, section, true, {
                    fileName: "[project]/app/landing-pages/new/page.client.tsx",
                    lineNumber: 34,
                    columnNumber: 13
                }, this);
            }
            // This is the key: pass ONLY content as prop
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionComponent, {
                content: content
            }, section, false, {
                fileName: "[project]/app/landing-pages/new/page.client.tsx",
                lineNumber: 44,
                columnNumber: 16
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/app/landing-pages/new/page.client.tsx",
        lineNumber: 28,
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
"[project]/app/landing-pages/new/page.client.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/landing-pages/new/page.client.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=app_landing-pages_new_page_client_tsx_7055c0b0._.js.map