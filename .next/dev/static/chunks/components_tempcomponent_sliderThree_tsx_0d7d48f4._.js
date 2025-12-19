(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/tempcomponent/sliderThree.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SliderThree
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$swiper$2d$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/swiper/swiper-react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/swiper/modules/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$navigation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Navigation$3e$__ = __turbopack_context__.i("[project]/node_modules/swiper/modules/navigation.mjs [app-client] (ecmascript) <export default as Navigation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$pagination$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pagination$3e$__ = __turbopack_context__.i("[project]/node_modules/swiper/modules/pagination.mjs [app-client] (ecmascript) <export default as Pagination>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$autoplay$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Autoplay$3e$__ = __turbopack_context__.i("[project]/node_modules/swiper/modules/autoplay.mjs [app-client] (ecmascript) <export default as Autoplay>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axiosClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/axiosClient.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
const DEFAULT_IMAGE = "https://lh3.googleusercontent.com/hzTpTV1Qwyi4crcaB_lEaRTg603ttzm_6Uw8SwBC-iQ9-PeWdFdNpejyPzFdVqWLBjf8o58sDjs8M9wV01MCyjJ3XX6GBIiUrLRiQi9ui8m0tp0";
function SliderThree({ productId }) {
    _s();
    const [images, setImages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [product, setProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SliderThree.useEffect": ()=>{
            const fetchData = {
                "SliderThree.useEffect.fetchData": async ()=>{
                    if (!productId) {
                        setImages([
                            {
                                id: 0,
                                url: DEFAULT_IMAGE,
                                position: 1
                            }
                        ]);
                        setProduct(null);
                        setLoading(false);
                        return;
                    }
                    try {
                        setLoading(true);
                        setError(null);
                        // Fetch product name and price
                        const productRes = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axiosClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/products/${productId}`);
                        if (!productRes.data?.success && !productRes.data?.name) {
                            // Some APIs return data directly, others wrap in { success, data }
                            throw new Error("Failed to load product details");
                        }
                        const productData = productRes.data.data || productRes.data;
                        setProduct({
                            name: productData.name || "Untitled Product",
                            price: parseFloat(productData.price) || 0
                        });
                        // Fetch gallery images (same as original Slider)
                        const imagesRes = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axiosClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/product-images", {
                            params: {
                                product_id: productId
                            }
                        });
                        if (!imagesRes.data?.success) {
                            throw new Error(imagesRes.data?.message || "API returned success: false");
                        }
                        const galleryImages = (imagesRes.data.data || []).filter({
                            "SliderThree.useEffect.fetchData.galleryImages": (item)=>item.type === "gallery" && item.url?.trim()
                        }["SliderThree.useEffect.fetchData.galleryImages"]).map({
                            "SliderThree.useEffect.fetchData.galleryImages": (item)=>({
                                    id: item.id,
                                    url: item.url.trim(),
                                    position: item.position ?? 999
                                })
                        }["SliderThree.useEffect.fetchData.galleryImages"]).sort({
                            "SliderThree.useEffect.fetchData.galleryImages": (a, b)=>a.position - b.position
                        }["SliderThree.useEffect.fetchData.galleryImages"]);
                        setImages(galleryImages.length > 0 ? galleryImages : [
                            {
                                id: 0,
                                url: DEFAULT_IMAGE,
                                position: 1
                            }
                        ]);
                    } catch (err) {
                        console.error("Error fetching data:", err);
                        const message = err.response?.data?.message || err.message || "Failed to load product data";
                        setError(message);
                        setImages([
                            {
                                id: 0,
                                url: DEFAULT_IMAGE,
                                position: 1
                            }
                        ]);
                        setProduct({
                            name: "Product Unavailable",
                            price: 0
                        });
                    } finally{
                        setLoading(false);
                    }
                }
            }["SliderThree.useEffect.fetchData"];
            fetchData();
        }
    }["SliderThree.useEffect"], [
        productId
    ]);
    // Loading state
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-[1200px] mx-auto aspect-square flex items-center justify-center bg-muted rounded-xl",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-muted-foreground",
                children: "Loading product..."
            }, void 0, false, {
                fileName: "[project]/components/tempcomponent/sliderThree.tsx",
                lineNumber: 108,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/tempcomponent/sliderThree.tsx",
            lineNumber: 107,
            columnNumber: 7
        }, this);
    }
    // Error state
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-[1200px] mx-auto aspect-square flex items-center justify-center bg-destructive/10 rounded-xl",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-destructive",
                children: [
                    "Error: ",
                    error
                ]
            }, void 0, true, {
                fileName: "[project]/components/tempcomponent/sliderThree.tsx",
                lineNumber: 117,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/tempcomponent/sliderThree.tsx",
            lineNumber: 116,
            columnNumber: 7
        }, this);
    }
    const title = product?.name || "No Product Name";
    const subtitle = product?.price > 0 ? `$${product.price.toFixed(2)}` : "";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "card-header-slider",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$swiper$2d$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Swiper"], {
            modules: [
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$navigation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Navigation$3e$__["Navigation"],
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$pagination$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pagination$3e$__["Pagination"],
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$autoplay$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Autoplay$3e$__["Autoplay"]
            ],
            spaceBetween: 20,
            slidesPerView: 1,
            navigation: true,
            pagination: {
                clickable: true
            },
            autoplay: {
                delay: 2500,
                disableOnInteraction: false
            },
            loop: images.length > 1,
            children: images.map((img)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$swiper$2d$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SwiperSlide"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative w-full  mx-auto aspect-square",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: img.url,
                                alt: title,
                                className: "w-full h-full object-cover rounded-xl shadow-lg",
                                loading: "lazy",
                                onError: (e)=>{
                                    e.target.src = DEFAULT_IMAGE;
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/tempcomponent/sliderThree.tsx",
                                lineNumber: 143,
                                columnNumber: 15
                            }, this),
                            (title || subtitle) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute bottom-6 left-1/2 -translate-x-1/2 text-white drop-shadow-lg text-center w-auto px-6 py-3 bg-black/50 backdrop-blur-sm rounded-xl",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-sl md:text-sl font-bold leading-tight",
                                        children: title
                                    }, void 0, false, {
                                        fileName: "[project]/components/tempcomponent/sliderThree.tsx",
                                        lineNumber: 155,
                                        columnNumber: 19
                                    }, this),
                                    subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sl md:text-sl font-semibold mt-1",
                                        children: subtitle
                                    }, void 0, false, {
                                        fileName: "[project]/components/tempcomponent/sliderThree.tsx",
                                        lineNumber: 159,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/tempcomponent/sliderThree.tsx",
                                lineNumber: 154,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/tempcomponent/sliderThree.tsx",
                        lineNumber: 142,
                        columnNumber: 13
                    }, this)
                }, img.id, false, {
                    fileName: "[project]/components/tempcomponent/sliderThree.tsx",
                    lineNumber: 141,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "[project]/components/tempcomponent/sliderThree.tsx",
            lineNumber: 127,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/tempcomponent/sliderThree.tsx",
        lineNumber: 126,
        columnNumber: 5
    }, this);
}
_s(SliderThree, "M6YkPKVirxdcij2umhpv5yPhUyE=");
_c = SliderThree;
var _c;
__turbopack_context__.k.register(_c, "SliderThree");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/tempcomponent/sliderThree.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/tempcomponent/sliderThree.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=components_tempcomponent_sliderThree_tsx_0d7d48f4._.js.map