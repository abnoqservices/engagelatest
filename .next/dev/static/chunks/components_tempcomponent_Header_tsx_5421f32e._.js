(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/tempcomponent/Header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function Header({ data }) {
    // Find logo (has "url") and title (has "name" and "value")
    const logoField = data?.find((field)=>field.url);
    const titleField = data?.find((field)=>field.name === "title");
    const logoUrl = logoField?.url || "/F1.jpg"; // fallback image
    const title = titleField?.value || "Your Brand Name";
    const subtitleField = data?.find((field)=>field.name === "subtitle");
    const subtitle = subtitleField?.value || "Your subtitle text goes here. This can be one or two lines long.";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: " flex flex-col items-center text-center py-6 px-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-full shadow-xl p-1 mb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-24 h-24 rounded-full overflow-hidden",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: logoUrl,
                        alt: "Brand Logo",
                        className: "w-full h-full object-cover",
                        onError: (e)=>e.currentTarget.src = "/fallback-logo.png"
                    }, void 0, false, {
                        fileName: "[project]/components/tempcomponent/Header.tsx",
                        lineNumber: 18,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/tempcomponent/Header.tsx",
                    lineNumber: 17,
                    columnNumber: 7
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/tempcomponent/Header.tsx",
                lineNumber: 16,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-3xl font-bold text-gray-900 mb-2",
                children: title
            }, void 0, false, {
                fileName: "[project]/components/tempcomponent/Header.tsx",
                lineNumber: 28,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-600 text-base leading-relaxed max-w-md",
                children: subtitle
            }, void 0, false, {
                fileName: "[project]/components/tempcomponent/Header.tsx",
                lineNumber: 33,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/tempcomponent/Header.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/tempcomponent/Header.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/tempcomponent/Header.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=components_tempcomponent_Header_tsx_5421f32e._.js.map