module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/jsdom [external] (jsdom, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("jsdom", () => require("jsdom"));

module.exports = mod;
}),
"[externals]/canvas [external] (canvas, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("canvas", () => require("canvas"));

module.exports = mod;
}),
"[project]/app/api/qr/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/api/products/route.ts
__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$qr$2d$code$2d$styling$2f$lib$2f$qr$2d$code$2d$styling$2e$common$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/qr-code-styling/lib/qr-code-styling.common.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$jsdom__$5b$external$5d$__$28$jsdom$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/jsdom [external] (jsdom, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$canvas__$5b$external$5d$__$28$canvas$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/canvas [external] (canvas, cjs)");
(()=>{
    const e = new Error("Cannot find module 'uuid'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
;
;
;
// ──────────────────────────────────────────────────────────────
// Server-side QR generation configuration
// You can expand this later with more styling options coming from the request
// ──────────────────────────────────────────────────────────────
const getQrOptions = (data)=>({
        width: 400,
        height: 400,
        data,
        margin: 5,
        type: "png",
        qrOptions: {
            errorCorrectionLevel: "H"
        },
        dotsOptions: {
            type: "rounded",
            color: "#000000"
        },
        backgroundOptions: {
            color: "#ffffff"
        }
    });
async function POST(req) {
    try {
        const body = await req.json();
        const { name, price, description, // ... other product fields you need
        baseUrl = "https://yourdomain.com/product" } = body;
        if (!name) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Product name is required"
            }, {
                status: 400
            });
        }
        // 1. Generate unique product identifier
        // (in real app you would save to database first and use real ID)
        const productId = uuidv4();
        // 2. Create the URL that the QR code should point to
        const qrTargetUrl = `${baseUrl}/${productId}`;
        // 3. Generate QR code on the server
        const dom = new __TURBOPACK__imported__module__$5b$externals$5d2f$jsdom__$5b$external$5d$__$28$jsdom$2c$__cjs$29$__["JSDOM"]("<!DOCTYPE html><div id='qr-container'></div>");
        const document = dom.window.document;
        const qr = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$qr$2d$code$2d$styling$2f$lib$2f$qr$2d$code$2d$styling$2e$common$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]({
            ...getQrOptions(qrTargetUrl),
            jsdom: __TURBOPACK__imported__module__$5b$externals$5d2f$jsdom__$5b$external$5d$__$28$jsdom$2c$__cjs$29$__["JSDOM"],
            nodeCanvas: __TURBOPACK__imported__module__$5b$externals$5d2f$canvas__$5b$external$5d$__$28$canvas$2c$__cjs$29$__["createCanvas"]
        });
        // Get raw PNG buffer
        const qrBuffer = await qr.getRawData("png");
        // 4. Convert buffer → base64 string (safe to send in JSON)
        const qrBase64 = qrBuffer.toString("base64");
        // 5. In real application → save product to database here
        // Example (commented):
        //
        // await prisma.product.create({
        //   data: {
        //     id: productId,
        //     name,
        //     price: price ? Number(price) : null,
        //     description,
        //     qrCodeBase64: qrBase64,           // or save to public/uploads/ folder
        //     qrTargetUrl,
        //   }
        // });
        // 6. Return response with everything frontend might need
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            productId,
            qrTargetUrl,
            qrImageBase64: `data:image/png;base64,${qrBase64}`,
            // You can also return other product data if needed
            name,
            price,
            description
        });
    } catch (err) {
        console.error("Product + QR creation failed:", err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to create product and generate QR code",
            details: err.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__90ee005a._.js.map