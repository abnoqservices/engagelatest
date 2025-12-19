module.exports = [
"[project]/components/tempcomponent/YouTube.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>YouTube
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axiosClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/axiosClient.ts [app-ssr] (ecmascript)");
;
;
;
function YouTube({ productId, YouTube = true }) {
    const [videoUrl, setVideoUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [isYouTube, setIsYouTube] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchProduct = async ()=>{
            try {
                setLoading(true);
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axiosClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(`/products/${productId}`);
                if (response.data.success) {
                    const url = response.data.data.video_url?.trim() || "";
                    if (url) {
                        setVideoUrl(url);
                        const isYt = url.includes("youtube.com") || url.includes("youtu.be") || url.includes("youtube-nocookie.com");
                        setIsYouTube(isYt);
                    } else {
                        setVideoUrl("");
                        setIsYouTube(false);
                    }
                }
            } catch (err) {
                console.error("Error fetching product video:", err);
                setVideoUrl("");
                setIsYouTube(false);
            } finally{
                setLoading(false);
            }
        };
        if (productId) {
            fetchProduct();
        }
    }, [
        productId
    ]);
    // Convert YouTube URL to embed URL
    const getYouTubeEmbedUrl = (url)=>{
        if (!url) return "";
        let videoId;
        if (url.includes("v=")) {
            videoId = url.split("v=")[1]?.split("&")[0]?.split("#")[0];
        } else if (url.includes("youtu.be/")) {
            videoId = url.split("youtu.be/")[1]?.split("?")[0]?.split("#")[0];
        } else if (url.includes("/embed/")) {
            videoId = url.split("/embed/")[1]?.split("?")[0];
        } else if (url.includes("/shorts/")) {
            videoId = url.split("/shorts/")[1]?.split("?")[0];
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    };
    const embedUrl = isYouTube ? getYouTubeEmbedUrl(videoUrl) : "";
    // Early returns
    if (!YouTube) return null;
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full aspect-video flex items-center justify-center bg-gray-100 rounded-lg",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-500",
                children: "Loading video..."
            }, void 0, false, {
                fileName: "[project]/components/tempcomponent/YouTube.tsx",
                lineNumber: 80,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/tempcomponent/YouTube.tsx",
            lineNumber: 79,
            columnNumber: 7
        }, this);
    }
    if (!videoUrl) {
        return null; // No video at all
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "card-header",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full aspect-video relative rounded-lg overflow-hidden shadow-lg bg-black py-4",
            children: isYouTube && embedUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
                src: embedUrl,
                className: "absolute top-0 left-0 w-full h-full",
                allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
                allowFullScreen: true,
                title: "Product Video"
            }, void 0, false, {
                fileName: "[project]/components/tempcomponent/YouTube.tsx",
                lineNumber: 94,
                columnNumber: 9
            }, this) : /* Direct Video File (MP4, etc.) */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                className: "absolute top-0 left-0 w-full h-full object-contain bg-black",
                controls: true,
                playsInline: true,
                preload: "metadata",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("source", {
                        src: videoUrl,
                        type: "video/mp4"
                    }, void 0, false, {
                        fileName: "[project]/components/tempcomponent/YouTube.tsx",
                        lineNumber: 109,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("source", {
                        src: videoUrl,
                        type: "video/webm"
                    }, void 0, false, {
                        fileName: "[project]/components/tempcomponent/YouTube.tsx",
                        lineNumber: 110,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("source", {
                        src: videoUrl,
                        type: "video/ogg"
                    }, void 0, false, {
                        fileName: "[project]/components/tempcomponent/YouTube.tsx",
                        lineNumber: 111,
                        columnNumber: 11
                    }, this),
                    "Your browser does not support the video tag."
                ]
            }, void 0, true, {
                fileName: "[project]/components/tempcomponent/YouTube.tsx",
                lineNumber: 103,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/tempcomponent/YouTube.tsx",
            lineNumber: 91,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/tempcomponent/YouTube.tsx",
        lineNumber: 90,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/tempcomponent/YouTube.tsx [app-ssr] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/tempcomponent/YouTube.tsx [app-ssr] (ecmascript)"));
}),
];

//# sourceMappingURL=components_tempcomponent_YouTube_tsx_268d41fd._.js.map