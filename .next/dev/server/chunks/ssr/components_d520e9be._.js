module.exports = [
"[project]/components/Template1.tsx [app-ssr] (ecmascript, next/dynamic entry, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/components_tempcomponent_ca630fa4._.js",
  "server/chunks/ssr/components_dfa890ed._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/components/Template1.tsx [app-ssr] (ecmascript, next/dynamic entry)");
    });
});
}),
"[project]/components/Template2.tsx [app-ssr] (ecmascript, next/dynamic entry, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/components_Template2_tsx_cda26fb1._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/components/Template2.tsx [app-ssr] (ecmascript, next/dynamic entry)");
    });
});
}),
];