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
"[project]/components/tempcomponent/sliderTwo.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SliderTwo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$swiper$2d$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/swiper/swiper-react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/swiper/modules/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$effect$2d$coverflow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EffectCoverflow$3e$__ = __turbopack_context__.i("[project]/node_modules/swiper/modules/effect-coverflow.mjs [app-client] (ecmascript) <export default as EffectCoverflow>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$autoplay$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Autoplay$3e$__ = __turbopack_context__.i("[project]/node_modules/swiper/modules/autoplay.mjs [app-client] (ecmascript) <export default as Autoplay>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$pagination$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pagination$3e$__ = __turbopack_context__.i("[project]/node_modules/swiper/modules/pagination.mjs [app-client] (ecmascript) <export default as Pagination>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axiosClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/axiosClient.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
const DEFAULT_IMAGE = "https://lh3.googleusercontent.com/hzTpTV1Qwyi4crcaB_lEaRTg603ttzm_6Uw8SwBC-iQ9-PeWdFdNpejyPzFdVqWLBjf8o58sDjs8M9wV01MCyjJ3XX6GBIiUrLRiQi9ui8m0tp0";
function SliderTwo({ productId }) {
    _s();
    const [images, setImages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SliderTwo.useEffect": ()=>{
            const fetchImages = {
                "SliderTwo.useEffect.fetchImages": async ()=>{
                    if (!productId) {
                        setImages([
                            {
                                id: 0,
                                url: DEFAULT_IMAGE,
                                position: 1
                            }
                        ]);
                        setLoading(false);
                        return;
                    }
                    try {
                        setLoading(true);
                        setError(null);
                        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axiosClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/product-images", {
                            params: {
                                product_id: productId
                            }
                        });
                        if (!res.data?.success) {
                            throw new Error(res.data?.message || "API returned success: false");
                        }
                        const galleryImages = (res.data.data || []).filter({
                            "SliderTwo.useEffect.fetchImages.galleryImages": (item)=>item.type === "gallery" && item.url?.trim()
                        }["SliderTwo.useEffect.fetchImages.galleryImages"]).map({
                            "SliderTwo.useEffect.fetchImages.galleryImages": (item)=>({
                                    id: item.id,
                                    url: item.url.trim(),
                                    position: item.position ?? 999
                                })
                        }["SliderTwo.useEffect.fetchImages.galleryImages"]).sort({
                            "SliderTwo.useEffect.fetchImages.galleryImages": (a, b)=>a.position - b.position
                        }["SliderTwo.useEffect.fetchImages.galleryImages"]);
                        setImages(galleryImages.length > 0 ? galleryImages : [
                            {
                                id: 0,
                                url: DEFAULT_IMAGE,
                                position: 1
                            }
                        ]);
                    } catch (err) {
                        console.error("Error fetching images:", err);
                        const message = err.response?.data?.message || err.message || "Failed to load gallery images";
                        setError(message);
                        setImages([
                            {
                                id: 0,
                                url: DEFAULT_IMAGE,
                                position: 1
                            }
                        ]);
                    } finally{
                        setLoading(false);
                    }
                }
            }["SliderTwo.useEffect.fetchImages"];
            fetchImages();
        }
    }["SliderTwo.useEffect"], [
        productId
    ]);
    // Loading state – same look as previous sliders
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-[900px] mx-auto h-[300px] flex items-center justify-center bg-muted rounded-xl",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-muted-foreground",
                children: "Loading beautiful slides..."
            }, void 0, false, {
                fileName: "[project]/components/tempcomponent/sliderTwo.tsx",
                lineNumber: 83,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/tempcomponent/sliderTwo.tsx",
            lineNumber: 82,
            columnNumber: 7
        }, this);
    }
    // Error state
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-[900px] mx-auto h-[300px] flex items-center justify-center bg-destructive/10 rounded-xl",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-destructive",
                children: [
                    "Error: ",
                    error
                ]
            }, void 0, true, {
                fileName: "[project]/components/tempcomponent/sliderTwo.tsx",
                lineNumber: 92,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/tempcomponent/sliderTwo.tsx",
            lineNumber: 91,
            columnNumber: 7
        }, this);
    }
    // No images (won’t happen because we always have fallback)
    if (images.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$swiper$2d$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Swiper"], {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        loop: images.length > 1,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false
        },
        coverflowEffect: {
            rotate: 50,
            stretch: 30,
            depth: 350,
            modifier: 19,
            slideShadows: true
        },
        pagination: {
            clickable: true
        },
        modules: [
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$effect$2d$coverflow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EffectCoverflow$3e$__["EffectCoverflow"],
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$autoplay$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Autoplay$3e$__["Autoplay"],
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$pagination$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pagination$3e$__["Pagination"]
        ],
        children: images.map((img)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$swiper$2d$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SwiperSlide"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "card-header-slider",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: img.url,
                        className: "w-full h-full object-cover rounded-xl",
                        alt: "Gallery slide",
                        loading: "lazy",
                        onError: (e)=>{
                            e.target.src = DEFAULT_IMAGE;
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/tempcomponent/sliderTwo.tsx",
                        lineNumber: 123,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/tempcomponent/sliderTwo.tsx",
                    lineNumber: 122,
                    columnNumber: 11
                }, this)
            }, img.id, false, {
                fileName: "[project]/components/tempcomponent/sliderTwo.tsx",
                lineNumber: 120,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/tempcomponent/sliderTwo.tsx",
        lineNumber: 101,
        columnNumber: 5
    }, this);
}
_s(SliderTwo, "IrokolCHfUdIuHik0hRB+6GzpFc=");
_c = SliderTwo;
var _c;
__turbopack_context__.k.register(_c, "SliderTwo");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/tempcomponent/sliderTwo.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/tempcomponent/sliderTwo.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=_5c33b6bf._.js.map