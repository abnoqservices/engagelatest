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
"[externals]/fs/promises [external] (fs/promises, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs/promises", () => require("fs/promises"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/app/api/upload-images/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/api/upload-images/route.ts
__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs/promises [external] (fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
async function POST(request) {
    try {
        const data = await request.json();
        const { images, gallery, pdfs } = data;
        // Ensure upload directories exist
        const imageUploadDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'public', 'upload', 'productgallery');
        const pdfUploadDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'public', 'upload', 'productdocs');
        await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["mkdir"])(imageUploadDir, {
            recursive: true
        });
        await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["mkdir"])(pdfUploadDir, {
            recursive: true
        });
        const savedImages = [];
        const savedGallery = [];
        const savedPdfs = [];
        // Process product images
        if (images && Array.isArray(images)) {
            for (const img of images){
                if (img.base64 && img.base64.startsWith('data:')) {
                    // Extract base64 data
                    const base64Data = img.base64.split(',')[1];
                    const buffer = Buffer.from(base64Data, 'base64');
                    // Generate unique filename
                    const timestamp = Date.now();
                    const randomStr = Math.random().toString(36).substring(2, 8);
                    const ext = img.name.split('.').pop() || 'jpg';
                    const filename = `product-${timestamp}-${randomStr}.${ext}`;
                    const filepath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(imageUploadDir, filename);
                    // Save file
                    await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["writeFile"])(filepath, buffer);
                    savedImages.push({
                        id: img.id,
                        name: img.name,
                        url: `/upload/productgallery/${filename}`,
                        savedPath: filepath
                    });
                }
            }
        }
        // Process gallery images
        if (gallery && Array.isArray(gallery)) {
            for (const img of gallery){
                if (img.base64 && img.base64.startsWith('data:')) {
                    const base64Data = img.base64.split(',')[1];
                    const buffer = Buffer.from(base64Data, 'base64');
                    const timestamp = Date.now();
                    const randomStr = Math.random().toString(36).substring(2, 8);
                    const ext = img.name.split('.').pop() || 'jpg';
                    const filename = `gallery-${timestamp}-${randomStr}.${ext}`;
                    const filepath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(imageUploadDir, filename);
                    await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["writeFile"])(filepath, buffer);
                    savedGallery.push({
                        id: img.id,
                        name: img.name,
                        url: `/upload/productgallery/${filename}`,
                        savedPath: filepath
                    });
                }
            }
        }
        // Process PDF documents
        if (pdfs && Array.isArray(pdfs)) {
            for (const pdf of pdfs){
                if (pdf.base64 && pdf.base64.startsWith('data:')) {
                    const base64Data = pdf.base64.split(',')[1];
                    const buffer = Buffer.from(base64Data, 'base64');
                    const timestamp = Date.now();
                    const randomStr = Math.random().toString(36).substring(2, 8);
                    // Sanitize filename - remove special characters
                    const sanitizedName = pdf.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                    const nameWithoutExt = sanitizedName.replace('.pdf', '');
                    const filename = `${nameWithoutExt}-${timestamp}-${randomStr}.pdf`;
                    const filepath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(pdfUploadDir, filename);
                    await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["writeFile"])(filepath, buffer);
                    savedPdfs.push({
                        id: pdf.id,
                        name: pdf.name,
                        url: `/upload/productdocs/${filename}`,
                        size: pdf.size || buffer.length,
                        savedPath: filepath
                    });
                }
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'Files saved successfully',
            data: {
                images: savedImages,
                gallery: savedGallery,
                pdfs: savedPdfs
            }
        });
    } catch (error) {
        console.error('Error saving files:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: error.message || 'Failed to save files'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f2f86c8c._.js.map