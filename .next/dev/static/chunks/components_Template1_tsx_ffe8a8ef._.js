(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/Template1.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
;
;
const Template1 = ({ data })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-white",
        children: data?.sections?.map((item, index)=>{
            const SectionName = item.section;
            // Dynamically load component
            const Component = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.f({
                    "@/components/tempcomponent/CTA.tsx": {
                        id: ()=>"[project]/components/tempcomponent/CTA.tsx [app-client] (ecmascript, async loader)",
                        module: ()=>__turbopack_context__.A("[project]/components/tempcomponent/CTA.tsx [app-client] (ecmascript, async loader)")
                    },
                    "@/components/tempcomponent/Contact.tsx": {
                        id: ()=>"[project]/components/tempcomponent/Contact.tsx [app-client] (ecmascript, async loader)",
                        module: ()=>__turbopack_context__.A("[project]/components/tempcomponent/Contact.tsx [app-client] (ecmascript, async loader)")
                    },
                    "@/components/tempcomponent/Description.tsx": {
                        id: ()=>"[project]/components/tempcomponent/Description.tsx [app-client] (ecmascript, async loader)",
                        module: ()=>__turbopack_context__.A("[project]/components/tempcomponent/Description.tsx [app-client] (ecmascript, async loader)")
                    },
                    "@/components/tempcomponent/Header.tsx": {
                        id: ()=>"[project]/components/tempcomponent/Header.tsx [app-client] (ecmascript, async loader)",
                        module: ()=>__turbopack_context__.A("[project]/components/tempcomponent/Header.tsx [app-client] (ecmascript, async loader)")
                    },
                    "@/components/tempcomponent/Social.tsx": {
                        id: ()=>"[project]/components/tempcomponent/Social.tsx [app-client] (ecmascript, async loader)",
                        module: ()=>__turbopack_context__.A("[project]/components/tempcomponent/Social.tsx [app-client] (ecmascript, async loader)")
                    },
                    "@/components/tempcomponent/Specification.tsx": {
                        id: ()=>"[project]/components/tempcomponent/Specification.tsx [app-client] (ecmascript, async loader)",
                        module: ()=>__turbopack_context__.A("[project]/components/tempcomponent/Specification.tsx [app-client] (ecmascript, async loader)")
                    },
                    "@/components/tempcomponent/YouTube.tsx": {
                        id: ()=>"[project]/components/tempcomponent/YouTube.tsx [app-client] (ecmascript, async loader)",
                        module: ()=>__turbopack_context__.A("[project]/components/tempcomponent/YouTube.tsx [app-client] (ecmascript, async loader)")
                    },
                    "@/components/tempcomponent/slider.tsx": {
                        id: ()=>"[project]/components/tempcomponent/slider.tsx [app-client] (ecmascript, async loader)",
                        module: ()=>__turbopack_context__.A("[project]/components/tempcomponent/slider.tsx [app-client] (ecmascript, async loader)")
                    },
                    "@/components/tempcomponent/sliderThree.tsx": {
                        id: ()=>"[project]/components/tempcomponent/sliderThree.tsx [app-client] (ecmascript, async loader)",
                        module: ()=>__turbopack_context__.A("[project]/components/tempcomponent/sliderThree.tsx [app-client] (ecmascript, async loader)")
                    },
                    "@/components/tempcomponent/sliderTwo.tsx": {
                        id: ()=>"[project]/components/tempcomponent/sliderTwo.tsx [app-client] (ecmascript, async loader)",
                        module: ()=>__turbopack_context__.A("[project]/components/tempcomponent/sliderTwo.tsx [app-client] (ecmascript, async loader)")
                    }
                }).import(`@/components/tempcomponent/${SectionName}.tsx`), {
                ssr: false,
                loading: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Loading ",
                            SectionName,
                            "..."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Template1.tsx",
                        lineNumber: 14,
                        columnNumber: 40
                    }, ("TURBOPACK compile-time value", void 0))
            });
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
                data: item.fields
            }, index, false, {
                fileName: "[project]/components/Template1.tsx",
                lineNumber: 18,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0));
        })
    }, void 0, false, {
        fileName: "[project]/components/Template1.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = Template1;
const __TURBOPACK__default__export__ = Template1;
var _c;
__turbopack_context__.k.register(_c, "Template1");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Template1.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/Template1.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=components_Template1_tsx_ffe8a8ef._.js.map