"use client";
"use strict";
exports.__esModule = true;
var React = require("react");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var card_1 = require("@/components/ui/card");
var slider_1 = require("@/components/ui/slider");
var lucide_react_1 = require("lucide-react");
var select_1 = require("@/components/ui/select");
var tabs_1 = require("@/components/ui/tabs");
var switch_1 = require("@/components/ui/switch");
var layout_1 = require("@/components/dashboard/layout");
var templates = {
    "1": {
        name: "Classic",
        previewUrl: "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://example.com&ecc=H&color=000000&bgcolor=FFFFFF",
        dots: { type: "square", color: "#000000" },
        cornersSquare: { type: "square", color: "#000000" },
        cornersDot: { type: "square", color: "#000000" },
        bg: "#ffffff"
    },
    "2": {
        name: "Rounded Blue",
        previewUrl: "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://example.com&ecc=H&color=1e40af&bgcolor=FFFFFF&qzone=4&format=png",
        dots: { type: "square", color: "#1e40af" },
        cornersSquare: { type: "square", color: "#1e40af" },
        cornersDot: { type: "square", color: "#1e40af" },
        bg: "#ffffff"
    },
    "3": {
        name: "Neon Gradient",
        previewUrl: "https://quickchart.io/qr?text=https://example.com&size=100&margin=10&color=ec4899&dark=8b5cf6&light=ffffff&ecLevel=H",
        dots: { type: "square", gradient: { type: "linear", rotation: 45, colors: ["#ec4899", "#8b5cf6"] } },
        cornersSquare: { type: "square", color: "#ec4899" },
        cornersDot: { type: "square", color: "#8b5cf6" },
        bg: "#ffffff"
    },
    "4": {
        name: "Minimal Grey",
        previewUrl: "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://example.com&color=6b7280&bgcolor=FFFFFF",
        dots: { type: "square", color: "#6b7280" },
        cornersSquare: { type: "square", color: "#6b7280" },
        cornersDot: { type: "square", color: "#6b7280" },
        bg: "#ffffff"
    },
    "5": {
        name: "Bold Red",
        previewUrl: "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://example.com&color=dc2626&bgcolor=FFFFFF",
        dots: { type: "square", color: "#dc2626" },
        cornersSquare: { type: "square", color: "#dc2626" },
        cornersDot: { type: "square", color: "#dc2626" },
        bg: "#ffffff"
    },
    "6": {
        name: "Elegant Purple",
        previewUrl: "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://example.com&color=7c3aed&bgcolor=FFFFFF",
        dots: { type: "square", color: "#7c3aed" },
        cornersSquare: { type: "square", color: "#7c3aed" },
        cornersDot: { type: "square", color: "#7c3aed" },
        bg: "#ffffff"
    },
    "7": {
        name: "Ocean Wave",
        previewUrl: "https://quickchart.io/qr?text=https://example.com&size=100&color=0ea5e9&dark=06b6d4&ecLevel=H",
        dots: { type: "square", gradient: { type: "radial", colors: ["#0ea5e9", "#06b6d4"] } },
        cornersSquare: { type: "square", color: "#0ea5e9" },
        cornersDot: { type: "square", color: "#06b6d4" },
        bg: "#ffffff"
    },
    "8": {
        name: "Forest Classy",
        previewUrl: "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://example.com&color=059669&bgcolor=f0fdf4",
        dots: { type: "square", color: "#059669" },
        cornersSquare: { type: "square", color: "#059669" },
        cornersDot: { type: "square", color: "#059669" },
        bg: "#f0fdf4"
    }
};
var dotShapes = [
    { value: "square", label: "Square" },
    { value: "dots", label: "Dots" },
    { value: "rounded", label: "Rounded" },
    { value: "extra-rounded", label: "Extra Rounded" },
    { value: "classy", label: "Classy" },
    { value: "classy-rounded", label: "Classy Rounded" },
];
var cornerSquareShapes = [
    { value: "none", label: "None" },
    { value: "square", label: "Square" },
    { value: "dot", label: "Dot" },
    { value: "extra-rounded", label: "Extra Rounded" },
];
var cornerDotShapes = [
    { value: "none", label: "None" },
    { value: "square", label: "Square" },
    { value: "dot", label: "Dot" },
];
var gradientTypes = [
    { value: "linear", label: "Linear" },
    { value: "radial", label: "Radial" },
];
var errorCorrectionLevels = [
    { value: "L", label: "L (Low - 7%)" },
    { value: "M", label: "M (Medium - 15%)" },
    { value: "Q", label: "Q (Quartile - 25%)" },
    { value: "H", label: "H (High - 30%)" },
];
function QRDesigner() {
    var _a;
    var _b = React.useState("https://qr-code-styling.com"), url = _b[0], setUrl = _b[1];
    var _c = React.useState("1"), selectedTemplate = _c[0], setSelectedTemplate = _c[1];
    var _d = React.useState(300), width = _d[0], setWidth = _d[1];
    var _e = React.useState(300), height = _e[0], setHeight = _e[1];
    var _f = React.useState(10), margin = _f[0], setMargin = _f[1];
    var _g = React.useState("square"), dotShape = _g[0], setDotShape = _g[1];
    var _h = React.useState("single"), dotColorType = _h[0], setDotColorType = _h[1];
    var _j = React.useState("#000000"), dotColor = _j[0], setDotColor = _j[1];
    var _k = React.useState("linear"), dotGradientType = _k[0], setDotGradientType = _k[1];
    var _l = React.useState("#ec4899"), dotGradientColor1 = _l[0], setDotGradientColor1 = _l[1];
    var _m = React.useState("#8b5cf6"), dotGradientColor2 = _m[0], setDotGradientColor2 = _m[1];
    var _o = React.useState(0), dotGradientRotation = _o[0], setDotGradientRotation = _o[1];
    var _p = React.useState("square"), cornerSquareShape = _p[0], setCornerSquareShape = _p[1];
    var _q = React.useState("single"), cornerSquareColorType = _q[0], setCornerSquareColorType = _q[1];
    var _r = React.useState("#000000"), cornerSquareColor = _r[0], setCornerSquareColor = _r[1];
    var _s = React.useState("linear"), cornerSquareGradientType = _s[0], setCornerSquareGradientType = _s[1];
    var _t = React.useState("#ec4899"), cornerSquareGradientColor1 = _t[0], setCornerSquareGradientColor1 = _t[1];
    var _u = React.useState("#8b5cf6"), cornerSquareGradientColor2 = _u[0], setCornerSquareGradientColor2 = _u[1];
    var _v = React.useState(0), cornerSquareGradientRotation = _v[0], setCornerSquareGradientRotation = _v[1];
    var _w = React.useState("square"), cornerDotShape = _w[0], setCornerDotShape = _w[1];
    var _x = React.useState("single"), cornerDotColorType = _x[0], setCornerDotColorType = _x[1];
    var _y = React.useState("#000000"), cornerDotColor = _y[0], setCornerDotColor = _y[1];
    var _z = React.useState("linear"), cornerDotGradientType = _z[0], setCornerDotGradientType = _z[1];
    var _0 = React.useState("#ec4899"), cornerDotGradientColor1 = _0[0], setCornerDotGradientColor1 = _0[1];
    var _1 = React.useState("#8b5cf6"), cornerDotGradientColor2 = _1[0], setCornerDotGradientColor2 = _1[1];
    var _2 = React.useState(0), cornerDotGradientRotation = _2[0], setCornerDotGradientRotation = _2[1];
    var _3 = React.useState("single"), bgColorType = _3[0], setBgColorType = _3[1];
    var _4 = React.useState("#ffffff"), bgColor = _4[0], setBgColor = _4[1];
    var _5 = React.useState("linear"), bgGradientType = _5[0], setBgGradientType = _5[1];
    var _6 = React.useState("#ffffff"), bgGradientColor1 = _6[0], setBgGradientColor1 = _6[1];
    var _7 = React.useState("#f3f4f6"), bgGradientColor2 = _7[0], setBgGradientColor2 = _7[1];
    var _8 = React.useState(0), bgGradientRotation = _8[0], setBgGradientRotation = _8[1];
    var _9 = React.useState(null), customLogo = _9[0], setCustomLogo = _9[1];
    var _10 = React.useState(true), hideBackgroundDots = _10[0], setHideBackgroundDots = _10[1];
    var _11 = React.useState(0.4), imageSize = _11[0], setImageSize = _11[1];
    var _12 = React.useState(10), imageMargin = _12[0], setImageMargin = _12[1];
    var _13 = React.useState("H"), errorCorrectionLevel = _13[0], setErrorCorrectionLevel = _13[1];
    var previewRef = React.useRef(null);
    var applyTemplate = function (templateId) {
        var t = templates[templateId];
        if (!t)
            return;
        setDotShape(t.dots.type);
        if (t.dots.gradient) {
            setDotColorType("gradient");
            setDotGradientType(t.dots.gradient.type);
            setDotGradientColor1(t.dots.gradient.colors[0]);
            setDotGradientColor2(t.dots.gradient.colors[1]);
            setDotGradientRotation(t.dots.gradient.rotation || 0);
        }
        else {
            setDotColorType("single");
            setDotColor(t.dots.color);
        }
        setCornerSquareShape(t.cornersSquare.type);
        setCornerSquareColorType("single");
        setCornerSquareColor(t.cornersSquare.color);
        setCornerDotShape(t.cornersDot.type || "");
        setCornerDotColorType("single");
        setCornerDotColor(t.cornersDot.color);
        setBgColor(t.bg);
        setBgColorType("single");
    };
    React.useEffect(function () {
        if (!previewRef.current)
            return;
        previewRef.current.innerHTML = "";
        Promise.resolve().then(function () { return require("qr-code-styling"); }).then(function (module) {
            var QRCodeStyling = module["default"];
            var options = {
                width: width,
                height: height,
                data: url || "https://example.com",
                margin: margin,
                qrOptions: { errorCorrectionLevel: errorCorrectionLevel },
                backgroundOptions: bgColorType === "single"
                    ? { color: bgColor }
                    : { gradient: { type: bgGradientType, rotation: bgGradientRotation * Math.PI / 180, colorStops: [{ offset: 0, color: bgGradientColor1 }, { offset: 1, color: bgGradientColor2 }] } },
                dotsOptions: dotColorType === "single"
                    ? { type: dotShape, color: dotColor }
                    : { type: dotShape, gradient: { type: dotGradientType, rotation: dotGradientRotation * Math.PI / 180, colorStops: [{ offset: 0, color: dotGradientColor1 }, { offset: 1, color: dotGradientColor2 }] } },
                cornersSquareOptions: cornerSquareShape ? (cornerSquareColorType === "single"
                    ? { type: cornerSquareShape, color: cornerSquareColor }
                    : { type: cornerSquareShape, gradient: { type: cornerSquareGradientType, rotation: cornerSquareGradientRotation * Math.PI / 180, colorStops: [{ offset: 0, color: cornerSquareGradientColor1 }, { offset: 1, color: cornerSquareGradientColor2 }] } }) : undefined,
                cornersDotOptions: cornerDotShape ? (cornerDotColorType === "single"
                    ? { type: cornerDotShape, color: cornerDotColor }
                    : { type: cornerDotShape, gradient: { type: cornerDotGradientType, rotation: cornerDotGradientRotation * Math.PI / 180, colorStops: [{ offset: 0, color: cornerDotGradientColor1 }, { offset: 1, color: cornerDotGradientColor2 }] } }) : undefined
            };
            if (customLogo) {
                options.image = customLogo;
                options.imageOptions = {
                    hideBackgroundDots: hideBackgroundDots,
                    imageSize: imageSize,
                    margin: imageMargin,
                    crossOrigin: "anonymous"
                };
            }
            var qr = new QRCodeStyling(options);
            qr.append(previewRef.current);
        });
    }, [
        url, width, height, margin,
        dotShape, dotColorType, dotColor, dotGradientType, dotGradientColor1, dotGradientColor2, dotGradientRotation,
        cornerSquareShape, cornerSquareColorType, cornerSquareColor, cornerSquareGradientType, cornerSquareGradientColor1, cornerSquareGradientColor2, cornerSquareGradientRotation,
        cornerDotShape, cornerDotColorType, cornerDotColor, cornerDotGradientType, cornerDotGradientColor1, cornerDotGradientColor2, cornerDotGradientRotation,
        bgColorType, bgColor, bgGradientType, bgGradientColor1, bgGradientColor2, bgGradientRotation,
        customLogo, hideBackgroundDots, imageSize, imageMargin, errorCorrectionLevel
    ]);
    var downloadQR = function (format) {
        var _a;
        var canvas = (_a = previewRef.current) === null || _a === void 0 ? void 0 : _a.querySelector("canvas");
        if (!canvas)
            return;
        var link = document.createElement("a");
        link.download = "qr-" + Date.now() + "." + format;
        link.href = canvas.toDataURL("image/" + format);
        link.click();
        link.click();
    };
    var handleLogoUpload = function (e) {
        var _a;
        var file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            var reader_1 = new FileReader();
            reader_1.onload = function () { return setCustomLogo(reader_1.result); };
            reader_1.readAsDataURL(file);
        }
    };
    return (React.createElement(layout_1.DashboardLayout, null,
        React.createElement("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8" },
            React.createElement("div", { className: "max-w-7xl mx-auto" },
                React.createElement("div", { className: "flex items-center justify-between mb-8 flex-wrap gap-4" },
                    React.createElement("div", null,
                        React.createElement("h1", { className: "text-4xl font-bold flex items-center gap-3 text-slate-800" },
                            React.createElement(lucide_react_1.Palette, { className: "h-10 w-10 text-purple-600" }),
                            "QR Code Designer"),
                        React.createElement("p", { className: "text-slate-600 mt-2" }, "Professional QR code generator with full styling")),
                    React.createElement("div", { className: "flex gap-3" },
                        React.createElement(button_1.Button, { onClick: function () { return downloadQR("png"); }, size: "lg", className: "gap-2" },
                            React.createElement(lucide_react_1.Download, { className: "h-5 w-5" }),
                            " PNG"),
                        React.createElement(button_1.Button, { onClick: function () { return downloadQR("jpeg"); }, size: "lg", variant: "outline", className: "gap-2" },
                            React.createElement(lucide_react_1.Download, { className: "h-5 w-5" }),
                            " JPEG"))),
                React.createElement("div", { className: "grid lg:grid-cols-2 gap-8" },
                    React.createElement("div", { className: "space-y-6" },
                        React.createElement(card_1.Card, null,
                            React.createElement(card_1.CardHeader, { className: "bg-gradient-to-r" },
                                React.createElement(card_1.CardTitle, null, "Quick Templates")),
                            React.createElement(card_1.CardContent, { className: "pt-6" },
                                React.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" }, Object.entries(templates).map(function (_a) {
                                    var id = _a[0], template = _a[1];
                                    return (React.createElement("button", { key: id, onClick: function () {
                                            setSelectedTemplate(id);
                                            applyTemplate(id);
                                        }, className: "group relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl " + (selectedTemplate === id
                                            ? "border-purple-600 shadow-lg ring-4 ring-purple-200"
                                            : "border-slate-200 hover:border-purple-400") },
                                        React.createElement("div", { className: "aspect-square relative bg-white p-4" },
                                            React.createElement("img", { src: template.previewUrl, alt: template.name, className: "w-full h-full object-contain rounded-lg shadow-md group-hover:shadow-lg transition-shadow", loading: "lazy" }),
                                            React.createElement("div", { className: "absolute inset-0 bg-purple-600/0 group-hover:bg-purple-600/20 transition-colors rounded-lg" })),
                                        React.createElement("div", { className: "py-3 px-2 text-center" },
                                            React.createElement("p", { className: "text-sm font-semibold text-slate-700 group-hover:text-purple-700 transition-colors" }, template.name)),
                                        selectedTemplate === id && (React.createElement("div", { className: "absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center" },
                                            React.createElement("svg", { className: "w-4 h-4 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                                                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M5 13l4 4L19 7" }))))));
                                })))),
                        React.createElement(card_1.Card, null,
                            React.createElement(card_1.CardHeader, { className: "bg-gradient-to-r from-green-50 to-emerald-50" },
                                React.createElement(card_1.CardTitle, null, "Customize")),
                            React.createElement(card_1.CardContent, { className: "pt-6" },
                                React.createElement(tabs_1.Tabs, { defaultValue: "image", className: "w-full" },
                                    React.createElement(tabs_1.TabsList, { className: "grid w-full grid-cols-5" },
                                        React.createElement(tabs_1.TabsTrigger, { value: "image" }, "Logo"),
                                        React.createElement(tabs_1.TabsTrigger, { value: "dots" }, "Dots"),
                                        React.createElement(tabs_1.TabsTrigger, { value: "corners-sq" }, "Square"),
                                        React.createElement(tabs_1.TabsTrigger, { value: "corners-dot" }, "Dot"),
                                        React.createElement(tabs_1.TabsTrigger, { value: "background" }, "BG")),
                                    React.createElement(tabs_1.TabsContent, { value: "dots", className: "space-y-6 mt-6" },
                                        React.createElement("div", null,
                                            React.createElement(label_1.Label, null, "Data Dots Style"),
                                            React.createElement(select_1.Select, { value: dotShape, onValueChange: setDotShape },
                                                React.createElement(select_1.SelectTrigger, { className: "mt-2" },
                                                    React.createElement(select_1.SelectValue, null)),
                                                React.createElement(select_1.SelectContent, null, dotShapes.map(function (s) { return (React.createElement(select_1.SelectItem, { key: s.value, value: s.value }, s.label)); })))),
                                        React.createElement("div", null,
                                            React.createElement(label_1.Label, null, "Color Type"),
                                            React.createElement("div", { className: "flex gap-6 mt-2" },
                                                React.createElement("label", { className: "flex items-center gap-2" },
                                                    React.createElement("input", { type: "radio", checked: dotColorType === "single", onChange: function () { return setDotColorType("single"); } }),
                                                    React.createElement("span", null, "Single")),
                                                React.createElement("label", { className: "flex items-center gap-2" },
                                                    React.createElement("input", { type: "radio", checked: dotColorType === "gradient", onChange: function () { return setDotColorType("gradient"); } }),
                                                    React.createElement("span", null, "Gradient")))),
                                        dotColorType === "single" ? (React.createElement("div", { className: "flex gap-3 items-center" },
                                            React.createElement(input_1.Input, { type: "color", value: dotColor, onChange: function (e) { return setDotColor(e.target.value); }, className: "w-16 h-10 p-1" }),
                                            React.createElement(input_1.Input, { value: dotColor, onChange: function (e) { return setDotColor(e.target.value); } }))) : (React.createElement(React.Fragment, null,
                                            React.createElement("div", null,
                                                React.createElement(label_1.Label, null, "Gradient Type"),
                                                React.createElement(select_1.Select, { value: dotGradientType, onValueChange: setDotGradientType },
                                                    React.createElement(select_1.SelectTrigger, { className: "mt-2" },
                                                        React.createElement(select_1.SelectValue, null)),
                                                    React.createElement(select_1.SelectContent, null, gradientTypes.map(function (g) { return (React.createElement(select_1.SelectItem, { key: g.value, value: g.value }, g.label)); })))),
                                            React.createElement("div", { className: "grid grid-cols-2 gap-3" },
                                                React.createElement("div", null,
                                                    React.createElement(label_1.Label, { className: "text-xs" }, "Color 1"),
                                                    React.createElement(input_1.Input, { type: "color", value: dotGradientColor1, onChange: function (e) { return setDotGradientColor1(e.target.value); }, className: "w-full h-10 mt-1" })),
                                                React.createElement("div", null,
                                                    React.createElement(label_1.Label, { className: "text-xs" }, "Color 2"),
                                                    React.createElement(input_1.Input, { type: "color", value: dotGradientColor2, onChange: function (e) { return setDotGradientColor2(e.target.value); }, className: "w-full h-10 mt-1" }))),
                                            React.createElement("div", null,
                                                React.createElement(label_1.Label, null,
                                                    "Rotation: ",
                                                    dotGradientRotation,
                                                    "\u00B0"),
                                                React.createElement(slider_1.Slider, { value: [dotGradientRotation], onValueChange: function (_a) {
                                                        var v = _a[0];
                                                        return setDotGradientRotation(v);
                                                    }, min: 0, max: 360, step: 15, className: "mt-2" }))))),
                                    React.createElement(tabs_1.TabsContent, { value: "corners-sq", className: "space-y-4 mt-6" },
                                        React.createElement("div", null,
                                            React.createElement(label_1.Label, null, "Corners Square Style"),
                                            React.createElement(select_1.Select, { value: cornerSquareShape, onValueChange: setCornerSquareShape },
                                                React.createElement(select_1.SelectTrigger, { className: "mt-2" },
                                                    React.createElement(select_1.SelectValue, null)),
                                                React.createElement(select_1.SelectContent, null, cornerSquareShapes.map(function (s) { return (React.createElement(select_1.SelectItem, { key: s.value, value: s.value }, s.label)); })))),
                                        cornerSquareShape && cornerSquareShape !== "" && (React.createElement(React.Fragment, null,
                                            React.createElement("div", null,
                                                React.createElement(label_1.Label, null, "Color Type"),
                                                React.createElement("div", { className: "flex gap-6 mt-2" },
                                                    React.createElement("label", { className: "flex items-center gap-2" },
                                                        React.createElement("input", { type: "radio", checked: cornerSquareColorType === "single", onChange: function () { return setCornerSquareColorType("single"); } }),
                                                        React.createElement("span", null, "Single")),
                                                    React.createElement("label", { className: "flex items-center gap-2" },
                                                        React.createElement("input", { type: "radio", checked: cornerSquareColorType === "gradient", onChange: function () { return setCornerSquareColorType("gradient"); } }),
                                                        React.createElement("span", null, "Gradient")))),
                                            cornerSquareColorType === "single" ? (React.createElement("div", { className: "flex gap-3 items-center" },
                                                React.createElement(input_1.Input, { type: "color", value: cornerSquareColor, onChange: function (e) { return setCornerSquareColor(e.target.value); }, className: "w-16 h-10 p-1" }),
                                                React.createElement(input_1.Input, { value: cornerSquareColor, onChange: function (e) { return setCornerSquareColor(e.target.value); } }))) : (React.createElement(React.Fragment, null,
                                                React.createElement("div", null,
                                                    React.createElement(label_1.Label, null, "Gradient Type"),
                                                    React.createElement(select_1.Select, { value: cornerSquareGradientType, onValueChange: setCornerSquareGradientType },
                                                        React.createElement(select_1.SelectTrigger, { className: "mt-2" },
                                                            React.createElement(select_1.SelectValue, null)),
                                                        React.createElement(select_1.SelectContent, null, gradientTypes.map(function (g) { return (React.createElement(select_1.SelectItem, { key: g.value, value: g.value }, g.label)); })))),
                                                React.createElement("div", { className: "grid grid-cols-2 gap-3" },
                                                    React.createElement("div", null,
                                                        React.createElement(label_1.Label, { className: "text-xs" }, "Color 1"),
                                                        React.createElement(input_1.Input, { type: "color", value: cornerSquareGradientColor1, onChange: function (e) { return setCornerSquareGradientColor1(e.target.value); }, className: "w-full h-10 mt-1" })),
                                                    React.createElement("div", null,
                                                        React.createElement(label_1.Label, { className: "text-xs" }, "Color 2"),
                                                        React.createElement(input_1.Input, { type: "color", value: cornerSquareGradientColor2, onChange: function (e) { return setCornerSquareGradientColor2(e.target.value); }, className: "w-full h-10 mt-1" }))),
                                                React.createElement("div", null,
                                                    React.createElement(label_1.Label, null,
                                                        "Rotation: ",
                                                        cornerSquareGradientRotation,
                                                        "\u00B0"),
                                                    React.createElement(slider_1.Slider, { value: [cornerSquareGradientRotation], onValueChange: function (_a) {
                                                            var v = _a[0];
                                                            return setCornerSquareGradientRotation(v);
                                                        }, min: 0, max: 360, step: 15, className: "mt-2" }))))))),
                                    React.createElement(tabs_1.TabsContent, { value: "corners-dot", className: "space-y-4 mt-6" },
                                        React.createElement("div", null,
                                            React.createElement(label_1.Label, null, "Corners Dot Style"),
                                            React.createElement(select_1.Select, { value: cornerDotShape, onValueChange: setCornerDotShape },
                                                React.createElement(select_1.SelectTrigger, { className: "mt-2" },
                                                    React.createElement(select_1.SelectValue, null)),
                                                React.createElement(select_1.SelectContent, null, cornerDotShapes.map(function (s) { return (React.createElement(select_1.SelectItem, { key: s.value, value: s.value }, s.label)); })))),
                                        cornerDotShape && cornerDotShape !== "none" && (React.createElement(React.Fragment, null,
                                            React.createElement("div", null,
                                                React.createElement(label_1.Label, null, "Color Type"),
                                                React.createElement("div", { className: "flex gap-6 mt-2" },
                                                    React.createElement("label", { className: "flex items-center gap-2" },
                                                        React.createElement("input", { type: "radio", checked: cornerDotColorType === "single", onChange: function () { return setCornerDotColorType("single"); } }),
                                                        React.createElement("span", null, "Single")),
                                                    React.createElement("label", { className: "flex items-center gap-2" },
                                                        React.createElement("input", { type: "radio", checked: cornerDotColorType === "gradient", onChange: function () { return setCornerDotColorType("gradient"); } }),
                                                        React.createElement("span", null, "Gradient")))),
                                            cornerDotColorType === "single" ? (React.createElement("div", { className: "flex gap-3 items-center" },
                                                React.createElement(input_1.Input, { type: "color", value: cornerDotColor, onChange: function (e) { return setCornerDotColor(e.target.value); }, className: "w-16 h-10 p-1" }),
                                                React.createElement(input_1.Input, { value: cornerDotColor, onChange: function (e) { return setCornerDotColor(e.target.value); } }))) : (React.createElement(React.Fragment, null,
                                                React.createElement("div", null,
                                                    React.createElement(label_1.Label, null, "Gradient Type"),
                                                    React.createElement(select_1.Select, { value: cornerDotGradientType, onValueChange: setCornerDotGradientType },
                                                        React.createElement(select_1.SelectTrigger, { className: "mt-2" },
                                                            React.createElement(select_1.SelectValue, null)),
                                                        React.createElement(select_1.SelectContent, null, gradientTypes.map(function (g) { return (React.createElement(select_1.SelectItem, { key: g.value, value: g.value }, g.label)); })))),
                                                React.createElement("div", { className: "grid grid-cols-2 gap-3" },
                                                    React.createElement("div", null,
                                                        React.createElement(label_1.Label, { className: "text-xs" }, "Color 1"),
                                                        React.createElement(input_1.Input, { type: "color", value: cornerDotGradientColor1, onChange: function (e) { return setCornerDotGradientColor1(e.target.value); }, className: "w-full h-10 mt-1" })),
                                                    React.createElement("div", null,
                                                        React.createElement(label_1.Label, { className: "text-xs" }, "Color 2"),
                                                        React.createElement(input_1.Input, { type: "color", value: cornerDotGradientColor2, onChange: function (e) { return setCornerDotGradientColor2(e.target.value); }, className: "w-full h-10 mt-1" }))),
                                                React.createElement("div", null,
                                                    React.createElement(label_1.Label, null,
                                                        "Rotation: ",
                                                        cornerDotGradientRotation,
                                                        "\u00B0"),
                                                    React.createElement(slider_1.Slider, { value: [cornerDotGradientRotation], onValueChange: function (_a) {
                                                            var v = _a[0];
                                                            return setCornerDotGradientRotation(v);
                                                        }, min: 0, max: 360, step: 15, className: "mt-2" }))))))),
                                    React.createElement(tabs_1.TabsContent, { value: "background", className: "space-y-6 mt-6" },
                                        React.createElement("div", null,
                                            React.createElement(label_1.Label, null, "Background Type"),
                                            React.createElement("div", { className: "flex gap-6 mt-2" },
                                                React.createElement("label", { className: "flex items-center gap-2" },
                                                    React.createElement("input", { type: "radio", checked: bgColorType === "single", onChange: function () { return setBgColorType("single"); } }),
                                                    React.createElement("span", null, "Solid")),
                                                React.createElement("label", { className: "flex items-center gap-2" },
                                                    React.createElement("input", { type: "radio", checked: bgColorType === "gradient", onChange: function () { return setBgColorType("gradient"); } }),
                                                    React.createElement("span", null, "Gradient")))),
                                        bgColorType === "single" ? (React.createElement("div", { className: "flex gap-3 items-center" },
                                            React.createElement(input_1.Input, { type: "color", value: bgColor, onChange: function (e) { return setBgColor(e.target.value); }, className: "w-16 h-10 p-1" }),
                                            React.createElement(input_1.Input, { value: bgColor, onChange: function (e) { return setBgColor(e.target.value); } }))) : (React.createElement(React.Fragment, null,
                                            React.createElement("div", null,
                                                React.createElement(label_1.Label, null, "Gradient Type"),
                                                React.createElement(select_1.Select, { value: bgGradientType, onValueChange: setBgGradientType },
                                                    React.createElement(select_1.SelectTrigger, { className: "mt-2" },
                                                        React.createElement(select_1.SelectValue, null)),
                                                    React.createElement(select_1.SelectContent, null, gradientTypes.map(function (g) { return (React.createElement(select_1.SelectItem, { key: g.value, value: g.value }, g.label)); })))),
                                            React.createElement("div", { className: "grid grid-cols-2 gap-3" },
                                                React.createElement("div", null,
                                                    React.createElement(label_1.Label, { className: "text-xs" }, "Color 1"),
                                                    React.createElement(input_1.Input, { type: "color", value: bgGradientColor1, onChange: function (e) { return setBgGradientColor1(e.target.value); }, className: "w-full h-10 mt-1" })),
                                                React.createElement("div", null,
                                                    React.createElement(label_1.Label, { className: "text-xs" }, "Color 2"),
                                                    React.createElement(input_1.Input, { type: "color", value: bgGradientColor2, onChange: function (e) { return setBgGradientColor2(e.target.value); }, className: "w-full h-10 mt-1" }))),
                                            React.createElement("div", null,
                                                React.createElement(label_1.Label, null,
                                                    "Rotation: ",
                                                    bgGradientRotation,
                                                    "\u00B0"),
                                                React.createElement(slider_1.Slider, { value: [bgGradientRotation], onValueChange: function (_a) {
                                                        var v = _a[0];
                                                        return setBgGradientRotation(v);
                                                    }, min: 0, max: 360, step: 15, className: "mt-2" }))))),
                                    React.createElement(tabs_1.TabsContent, { value: "image", className: "space-y-6 mt-6" },
                                        React.createElement("div", null,
                                            React.createElement(label_1.Label, null, "Upload Logo (optional)"),
                                            React.createElement("div", { className: "mt-2 flex items-center gap-4" },
                                                React.createElement("label", { className: "cursor-pointer" },
                                                    React.createElement(input_1.Input, { type: "file", accept: "image/*", onChange: handleLogoUpload, className: "hidden" }),
                                                    React.createElement("div", { className: "flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition" },
                                                        React.createElement(lucide_react_1.Upload, { className: "h-4 w-4" }),
                                                        "Upload Image")),
                                                customLogo && (React.createElement(button_1.Button, { variant: "ghost", size: "sm", onClick: function () { return setCustomLogo(null); }, className: "text-red-600" },
                                                    React.createElement(lucide_react_1.X, { className: "h-4 w-4" }),
                                                    " Remove"))),
                                            customLogo && (React.createElement("div", { className: "mt-4" },
                                                React.createElement("img", { src: customLogo, alt: "Logo preview", className: "h-20 w-20 object-contain border rounded" })))),
                                        customLogo && (React.createElement(React.Fragment, null,
                                            React.createElement("div", { className: "flex items-center justify-between" },
                                                React.createElement(label_1.Label, null, "Hide dots behind logo"),
                                                React.createElement(switch_1.Switch, { checked: hideBackgroundDots, onCheckedChange: setHideBackgroundDots })),
                                            React.createElement("div", null,
                                                React.createElement(label_1.Label, null,
                                                    "Logo Size: ",
                                                    (imageSize * 100).toFixed(0),
                                                    "%"),
                                                React.createElement(slider_1.Slider, { value: [imageSize], onValueChange: function (_a) {
                                                        var v = _a[0];
                                                        return setImageSize(v);
                                                    }, min: 0.1, max: 0.6, step: 0.05, className: "mt-2" })),
                                            React.createElement("div", null,
                                                React.createElement(label_1.Label, null,
                                                    "Logo Margin: ",
                                                    imageMargin,
                                                    "px"),
                                                React.createElement(slider_1.Slider, { value: [imageMargin], onValueChange: function (_a) {
                                                        var v = _a[0];
                                                        return setImageMargin(v);
                                                    }, min: 0, max: 30, step: 2, className: "mt-2" })))))))),
                        React.createElement(card_1.Card, null,
                            React.createElement(card_1.CardHeader, { className: "bg-gradient-to-r from-amber-50 to-orange-50" },
                                React.createElement(card_1.CardTitle, null, "QR Options")),
                            React.createElement(card_1.CardContent, { className: "pt-6" },
                                React.createElement(label_1.Label, null, "Error Correction Level"),
                                React.createElement(select_1.Select, { value: errorCorrectionLevel, onValueChange: setErrorCorrectionLevel },
                                    React.createElement(select_1.SelectTrigger, { className: "mt-2" },
                                        React.createElement(select_1.SelectValue, null)),
                                    React.createElement(select_1.SelectContent, null, errorCorrectionLevels.map(function (l) { return (React.createElement(select_1.SelectItem, { key: l.value, value: l.value }, l.label)); })))))),
                    React.createElement("div", { className: "flex flex-col" },
                        React.createElement(card_1.Card, { className: "sticky top-8 shadow-2xl" },
                            React.createElement(card_1.CardHeader, { className: "text-center bg-gradient-to-r" },
                                React.createElement(card_1.CardTitle, { className: "text-2xl" }, "Live Preview"),
                                React.createElement("p", { className: "text-sm text-slate-600" }, ((_a = templates[selectedTemplate]) === null || _a === void 0 ? void 0 : _a.name) || "Custom Design")),
                            React.createElement(card_1.CardContent, { className: "p-10 bg-gradient-to-br from-slate-50 to-slate-100 flex justify-center items-center min-h-[500px]" },
                                React.createElement("div", { ref: previewRef, className: "shadow-2xl rounded-xl overflow-hidden" })),
                            React.createElement(card_1.CardContent, { className: "space-y-6 pt-6" },
                                React.createElement("div", null,
                                    React.createElement(label_1.Label, null, "Data (URL or Text)"),
                                    React.createElement(input_1.Input, { value: url, onChange: function (e) { return setUrl(e.target.value); }, placeholder: "https://example.com", className: "mt-2" })),
                                React.createElement("div", { className: "grid grid-cols-3 gap-4" },
                                    React.createElement("div", null,
                                        React.createElement(label_1.Label, null,
                                            "Width: ",
                                            width,
                                            "px"),
                                        React.createElement(slider_1.Slider, { value: [width], onValueChange: function (_a) {
                                                var v = _a[0];
                                                return setWidth(v);
                                            }, min: 200, max: 600, step: 10, className: "mt-2" })),
                                    React.createElement("div", null,
                                        React.createElement(label_1.Label, null,
                                            "Height: ",
                                            height,
                                            "px"),
                                        React.createElement(slider_1.Slider, { value: [height], onValueChange: function (_a) {
                                                var v = _a[0];
                                                return setHeight(v);
                                            }, min: 200, max: 600, step: 10, className: "mt-2" })),
                                    React.createElement("div", null,
                                        React.createElement(label_1.Label, null,
                                            "Margin: ",
                                            margin),
                                        React.createElement(slider_1.Slider, { value: [margin], onValueChange: function (_a) {
                                                var v = _a[0];
                                                return setMargin(v);
                                            }, min: 0, max: 50, step: 5, className: "mt-2" })))))))))));
}
exports["default"] = QRDesigner;
