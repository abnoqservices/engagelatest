(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/axiosClient.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const axiosClient = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: ("TURBOPACK compile-time value", "http://127.0.0.1:8000/api"),
    headers: {
        Accept: "application/json"
    }
});
//  Attach token to every request
axiosClient.interceptors.request.use((config)=>{
    if ("TURBOPACK compile-time truthy", 1) {
        const token = localStorage.getItem("token"); //  MUST be "token"
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});
const __TURBOPACK__default__export__ = axiosClient;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //  Auto logout on 401 (important)
 // axiosClient.interceptors.response.use(
 //   (response) => response,
 //   (error) => {
 //     if (error.response?.status === 401) {
 //       localStorage.removeItem("token");
 //       localStorage.removeItem("user");
 //       window.location.href = "/signin";
 //     }
 //     return Promise.reject(error);
 //   }
 // );
}),
"[project]/app/preview/layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LandingPageBuilder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axiosClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/axiosClient.ts [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/app/preview/Preview'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function LandingPageBuilder({ productId = 32 }) {
    _s();
    const [isLoading, setIsLoading] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](true);
    const [payload, setPayload] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "LandingPageBuilder.useEffect": ()=>{
            if (!productId) {
                setIsLoading(false);
                return;
            }
            const fetchPreviewData = {
                "LandingPageBuilder.useEffect.fetchPreviewData": async ()=>{
                    try {
                        setIsLoading(true);
                        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axiosClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/products/${productId}/landing-page`);
                        if (res.data?.success && res.data?.data?.sections?.length) {
                            const activeSections = res.data.data.sections.filter({
                                "LandingPageBuilder.useEffect.fetchPreviewData.activeSections": (sec)=>sec.is_published
                            }["LandingPageBuilder.useEffect.fetchPreviewData.activeSections"]).sort({
                                "LandingPageBuilder.useEffect.fetchPreviewData.activeSections": (a, b)=>a.sort_order - b.sort_order
                            }["LandingPageBuilder.useEffect.fetchPreviewData.activeSections"]);
                            setPayload({
                                templateName: "modern",
                                sections: activeSections.map({
                                    "LandingPageBuilder.useEffect.fetchPreviewData": (sec)=>({
                                            section: sec.global_section.key,
                                            content: sec.content ?? {}
                                        })
                                }["LandingPageBuilder.useEffect.fetchPreviewData"]),
                                styles: {
                                    primaryColor: "#ecedf4ff",
                                    backgroundColor: "#000000",
                                    textColor: "#a97d38",
                                    headlineSize: 28,
                                    paragraphSize: 16
                                }
                            });
                        } else {
                            setPayload({
                                templateName: "modern",
                                sections: [
                                    {
                                        section: "hero",
                                        content: {
                                            title: "No Sections Published",
                                            subtitle: "Enable sections in the builder to see them here."
                                        }
                                    }
                                ],
                                styles: {
                                    primaryColor: "#ecedf4ff",
                                    backgroundColor: "#000000",
                                    textColor: "#a97d38",
                                    headlineSize: 28,
                                    paragraphSize: 16
                                }
                            });
                        }
                    } catch (error) {
                        console.error("Failed to fetch landing page data", error);
                        setPayload({
                            templateName: "modern",
                            sections: [
                                {
                                    section: "hero",
                                    content: {
                                        title: "Error Loading Preview",
                                        subtitle: "Check console for details."
                                    }
                                }
                            ],
                            styles: {
                                primaryColor: "#ecedf4ff",
                                backgroundColor: "#000000",
                                textColor: "#a97d38",
                                headlineSize: 28,
                                paragraphSize: 16
                            }
                        });
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["LandingPageBuilder.useEffect.fetchPreviewData"];
            fetchPreviewData();
        }
    }["LandingPageBuilder.useEffect"], [
        productId
    ]);
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-screen",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                    className: "h-12 w-12 animate-spin"
                }, void 0, false, {
                    fileName: "[project]/app/preview/layout.tsx",
                    lineNumber: 113,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "ml-4 text-lg",
                    children: "Loading preview data..."
                }, void 0, false, {
                    fileName: "[project]/app/preview/layout.tsx",
                    lineNumber: 114,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/preview/layout.tsx",
            lineNumber: 112,
            columnNumber: 7
        }, this);
    }
    if (!payload) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-lg",
                children: "No preview data available."
            }, void 0, false, {
                fileName: "[project]/app/preview/layout.tsx",
                lineNumber: 122,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/preview/layout.tsx",
            lineNumber: 121,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Preview, {
        data: payload,
        productId: productId
    }, void 0, false, {
        fileName: "[project]/app/preview/layout.tsx",
        lineNumber: 127,
        columnNumber: 10
    }, this);
}
_s(LandingPageBuilder, "yLi0XGauL7LrL0ELc1+y8uLtwmA=");
_c = LandingPageBuilder;
var _c;
__turbopack_context__.k.register(_c, "LandingPageBuilder");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_932e9ae9._.js.map