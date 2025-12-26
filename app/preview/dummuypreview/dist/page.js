"use client";
"use strict";
exports.__esModule = true;
exports.dynamic = void 0;
exports.dynamic = "force-dynamic";
var react_1 = require("react");
var dynamic_1 = require("next/dynamic");
var skeleton_1 = require("@/components/ui/skeleton");
var Template1 = dynamic_1["default"](function () { return Promise.resolve().then(function () { return require("@/components/Template1"); }); }, {
    ssr: true,
    loading: function () { return null; }
});
var Template2 = dynamic_1["default"](function () { return Promise.resolve().then(function () { return require("@/components/Template2"); }); }, {
    ssr: true,
    loading: function () { return null; }
});
function Preview(_a) {
    var data = _a.data, productId = _a.productId;
    var _b = react_1["default"].useState(false), localLoading = _b[0], setLocalLoading = _b[1];
    if (!data) {
        return react_1["default"].createElement("div", null, "No preview data found");
    }
    var getTemplateComponent = function (type) {
        switch (type) {
            case "modern":
                return Template1;
            case "basic":
                return Template2;
            default:
                return null;
        }
    };
    var ContentComponent = react_1["default"].useMemo(function () { return getTemplateComponent((data === null || data === void 0 ? void 0 : data.templateName) || ""); }, [data === null || data === void 0 ? void 0 : data.templateName]);
    react_1["default"].useEffect(function () {
        setLocalLoading(true);
        var t = setTimeout(function () { return setLocalLoading(false); }, 300);
        return function () { return clearTimeout(t); };
    }, [data]);
    return (react_1["default"].createElement("div", { className: "relative" },
        localLoading && (react_1["default"].createElement("div", { className: "relative min-h-screen bg-background" },
            react_1["default"].createElement("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none z-10" },
                react_1["default"].createElement("div", { className: "rounded-2xl p-8 shadow-1xl animate-pulse" },
                    react_1["default"].createElement("img", { src: "https://media.geeksforgeeks.org/wp-content/uploads/20210511160843/gfgQR.png", alt: "Company Logo", className: "h-16 w-16 object-contain" }))),
            react_1["default"].createElement("div", { className: "max-w-md mx-auto px-4 py-6 space-y-6" },
                react_1["default"].createElement("div", { className: "space-y-4" },
                    react_1["default"].createElement(skeleton_1.Skeleton, { className: "h-6 w-3/4" }),
                    "   ",
                    react_1["default"].createElement(skeleton_1.Skeleton, { className: "h-4 w-full" }),
                    "  ",
                    react_1["default"].createElement(skeleton_1.Skeleton, { className: "h-4 w-5/6" }),
                    react_1["default"].createElement(skeleton_1.Skeleton, { className: "h-10 w-full rounded-lg" }),
                    " "),
                react_1["default"].createElement(skeleton_1.Skeleton, { className: "h-48 w-full rounded-xl" }),
                [1, 2, 3].map(function (_, i) { return (react_1["default"].createElement("div", { key: i, className: "p-4 rounded-xl border bg-white space-y-3" },
                    react_1["default"].createElement(skeleton_1.Skeleton, { className: "h-5 w-1/2" }),
                    "     ",
                    react_1["default"].createElement(skeleton_1.Skeleton, { className: "h-4 w-full" }),
                    react_1["default"].createElement(skeleton_1.Skeleton, { className: "h-4 w-4/5" }),
                    react_1["default"].createElement(skeleton_1.Skeleton, { className: "h-9 w-full rounded-md" }),
                    " ")); })))),
        ContentComponent ? (react_1["default"].createElement(ContentComponent, { data: data, productId: productId })) : (react_1["default"].createElement("div", null, "No template selected"))));
}
;
exports["default"] = react_1["default"].memo(Preview);
