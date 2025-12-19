module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/products/loading.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/products/loading.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/products/settings/qr-codes/qr-template/qrTemplates.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/components/qr/qrTemplates.ts
__turbopack_context__.s([
    "qrTemplates",
    ()=>qrTemplates,
    "templateNames",
    ()=>templateNames
]);
const qrTemplates = {
    "1": {
        // Classic
        dotsOptions: {
            type: "square",
            color: "#000000"
        },
        cornersSquareOptions: {
            type: "square"
        }
    },
    "2": {
        // Rounded
        dotsOptions: {
            type: "rounded",
            color: "#1e40af"
        },
        cornersSquareOptions: {
            type: "rounded",
            color: "#1e40af"
        }
    },
    "3": {
        // Neon
        dotsOptions: {
            type: "dots",
            gradient: {
                type: "linear",
                rotation: 0,
                colorStops: [
                    {
                        offset: 0,
                        color: "#ec4899"
                    },
                    {
                        offset: 1,
                        color: "#8b5cf6"
                    }
                ]
            }
        },
        cornersSquareOptions: {
            type: "dots",
            gradient: {
                type: "linear",
                rotation: 0,
                colorStops: [
                    {
                        offset: 0,
                        color: "#ec4899"
                    },
                    {
                        offset: 1,
                        color: "#8b5cf6"
                    }
                ]
            }
        }
    },
    "4": {
        // Minimal
        dotsOptions: {
            type: "classy",
            color: "#6b7280"
        },
        cornersSquareOptions: {
            type: "classy",
            color: "#6b7280"
        }
    },
    "5": {
        // Bold Red
        dotsOptions: {
            type: "extra-rounded",
            color: "#dc2626"
        },
        cornersSquareOptions: {
            type: "extra-rounded",
            color: "#dc2626"
        }
    },
    "6": {
        // Elegant with logo
        dotsOptions: {
            type: "classy-rounded",
            color: "#7c3aed"
        },
        cornersDotOptions: {
            type: "dot",
            color: "#7c3aed"
        },
        image: "/logo.png",
        imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.2,
            margin: 6,
            crossOrigin: "anonymous"
        }
    }
};
const templateNames = {
    "1": "Classic",
    "2": "Rounded",
    "3": "Neon",
    "4": "Minimal",
    "5": "Bold Red",
    "6": "Elegant"
};
}),
"[project]/app/products/settings/qr-codes/qr-template/QRPreview.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/components/qr/QRPreview.tsx
__turbopack_context__.s([
    "QRPreview",
    ()=>QRPreview
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$qr$2d$code$2d$styling$2f$lib$2f$qr$2d$code$2d$styling$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/qr-code-styling/lib/qr-code-styling.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$products$2f$settings$2f$qr$2d$codes$2f$qr$2d$template$2f$qrTemplates$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/products/settings/qr-codes/qr-template/qrTemplates.ts [app-rsc] (ecmascript)");
;
;
;
;
function QRPreview({ templateId, data = "https://example.com", size = 80 }) {
    const ref = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useRef"](null);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (!ref.current) return;
        const specific = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$products$2f$settings$2f$qr$2d$codes$2f$qr$2d$template$2f$qrTemplates$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["qrTemplates"][templateId] || {};
        const config = {
            width: size,
            height: size,
            data,
            margin: 0,
            qrOptions: {
                errorCorrectionLevel: "H"
            },
            backgroundOptions: {
                color: "#ffffff"
            },
            dotsOptions: {
                type: "square",
                color: "#000000",
                ...specific.dotsOptions
            },
            cornersSquareOptions: {
                type: "square",
                ...specific.cornersSquareOptions
            },
            cornersDotOptions: specific.cornersDotOptions,
            image: specific.image,
            imageOptions: specific.image ? specific.imageOptions : undefined
        };
        const qr = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$qr$2d$code$2d$styling$2f$lib$2f$qr$2d$code$2d$styling$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"](config);
        qr.append(ref.current);
        return ()=>{
            qr._canvas?.remove();
        };
    }, [
        templateId,
        data,
        size
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref
    }, void 0, false, {
        fileName: "[project]/app/products/settings/qr-codes/qr-template/QRPreview.tsx",
        lineNumber: 42,
        columnNumber: 10
    }, this);
}
}),
"[project]/app/products/settings/qr-codes/qr-template/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Any other page or component
__turbopack_context__.s([
    "default",
    ()=>MyPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$products$2f$settings$2f$qr$2d$codes$2f$qr$2d$template$2f$QRPreview$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/products/settings/qr-codes/qr-template/QRPreview.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$products$2f$settings$2f$qr$2d$codes$2f$qr$2d$template$2f$qrTemplates$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/products/settings/qr-codes/qr-template/qrTemplates.ts [app-rsc] (ecmascript)");
;
;
;
function MyPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-10",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-2xl mb-6",
                children: "My Custom QR Codes"
            }, void 0, false, {
                fileName: "[project]/app/products/settings/qr-codes/qr-template/page.tsx",
                lineNumber: 8,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-3 gap-8",
                children: Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$products$2f$settings$2f$qr$2d$codes$2f$qr$2d$template$2f$qrTemplates$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["templateNames"]).map(([id, name])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$products$2f$settings$2f$qr$2d$codes$2f$qr$2d$template$2f$QRPreview$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QRPreview"], {
                                templateId: id,
                                data: "https://mysite.com",
                                size: 200
                            }, void 0, false, {
                                fileName: "[project]/app/products/settings/qr-codes/qr-template/page.tsx",
                                lineNumber: 12,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-3 font-medium",
                                children: name
                            }, void 0, false, {
                                fileName: "[project]/app/products/settings/qr-codes/qr-template/page.tsx",
                                lineNumber: 13,
                                columnNumber: 13
                            }, this)
                        ]
                    }, id, true, {
                        fileName: "[project]/app/products/settings/qr-codes/qr-template/page.tsx",
                        lineNumber: 11,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/products/settings/qr-codes/qr-template/page.tsx",
                lineNumber: 9,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/products/settings/qr-codes/qr-template/page.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/products/settings/qr-codes/qr-template/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/products/settings/qr-codes/qr-template/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__65b42876._.js.map