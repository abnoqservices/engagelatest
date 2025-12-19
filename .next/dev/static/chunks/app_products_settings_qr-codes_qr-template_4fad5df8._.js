(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/products/settings/qr-codes/qr-template/qrTemplates.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
        image: "https://static.vecteezy.com/system/resources/previews/008/296/267/non_2x/colorful-swirl-logo-design-concept-illustration-vector.jpg",
        imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.2,
            margin: 6,
            crossOrigin: "anonymous"
        }
    },
    "7": {
        dotsOptions: {
            type: "dots",
            color: "#ff1493"
        },
        cornersSquareOptions: {
            type: "extra-rounded",
            color: "#ff1493"
        },
        backgroundOptions: {
            color: "#fff0f5"
        },
        image: "https://raw.githubusercontent.com/kozakdenys/qr-code-styling/master/examples/images/heart.svg",
        imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.35,
            margin: 8,
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/products/settings/qr-codes/qr-template/QRPreview.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/components/qr/QRPreview.tsx
__turbopack_context__.s([
    "QRPreview",
    ()=>QRPreview
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$qr$2d$code$2d$styling$2f$lib$2f$qr$2d$code$2d$styling$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/qr-code-styling/lib/qr-code-styling.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$products$2f$settings$2f$qr$2d$codes$2f$qr$2d$template$2f$qrTemplates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/products/settings/qr-codes/qr-template/qrTemplates.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function QRPreview({ templateId, data = "https://example.com", size = 80 }) {
    _s();
    const ref = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "QRPreview.useEffect": ()=>{
            if (!ref.current) return;
            const specific = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$products$2f$settings$2f$qr$2d$codes$2f$qr$2d$template$2f$qrTemplates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["qrTemplates"][templateId] || {};
            // Critical fix: ONLY include image + imageOptions together, and ONLY if image actually exists
            const hasImage = !!specific.image && typeof specific.image === "string";
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
                    color: "#000000",
                    ...specific.cornersSquareOptions
                },
                cornersDotOptions: specific.cornersDotOptions,
                // Only pass these if we really have a valid image
                ...hasImage && {
                    image: specific.image,
                    imageOptions: {
                        hideBackgroundDots: true,
                        imageSize: 0.2,
                        margin: 6,
                        crossOrigin: "anonymous",
                        // This is the secret sauce — prevents crash even if image 404s
                        onLoad: ({
                            "QRPreview.useEffect": ()=>{}
                        })["QRPreview.useEffect"]
                    }
                }
            };
            // Extra safety — remove any accidentally leftover undefined imageOptions
            // @ts-ignore
            if (!hasImage && config.imageOptions === undefined) delete config.imageOptions;
            const qr = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$qr$2d$code$2d$styling$2f$lib$2f$qr$2d$code$2d$styling$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](config);
            qr.append(ref.current);
            return ({
                "QRPreview.useEffect": ()=>{
                    qr._canvas?.remove?.();
                }
            })["QRPreview.useEffect"];
        }
    }["QRPreview.useEffect"], [
        templateId,
        data,
        size
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: "flex justify-center"
    }, void 0, false, {
        fileName: "[project]/app/products/settings/qr-codes/qr-template/QRPreview.tsx",
        lineNumber: 66,
        columnNumber: 10
    }, this);
}
_s(QRPreview, "8uVE59eA/r6b92xF80p7sH8rXLk=");
_c = QRPreview;
var _c;
__turbopack_context__.k.register(_c, "QRPreview");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_products_settings_qr-codes_qr-template_4fad5df8._.js.map