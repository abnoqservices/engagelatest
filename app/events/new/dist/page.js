"use client";
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var React = require("react");
var layout_1 = require("@/components/dashboard/layout");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var card_1 = require("@/components/ui/card");
var switch_1 = require("@/components/ui/switch");
var calendar_1 = require("@/components/ui/calendar");
var popover_1 = require("@/components/ui/popover");
var dialog_1 = require("@/components/ui/dialog");
var checkbox_1 = require("@/components/ui/checkbox");
var lucide_react_1 = require("lucide-react");
var date_fns_1 = require("date-fns");
var utils_1 = require("@/lib/utils");
var axiosClient_1 = require("@/lib/axiosClient");
var navigation_1 = require("next/navigation");
var showToast_1 = require("@/lib/showToast");
var react_infinite_scroll_hook_1 = require("react-infinite-scroll-hook");
function NewEventPage() {
    var _this = this;
    var router = navigation_1.useRouter();
    // Event form state
    var _a = React.useState(""), name = _a[0], setName = _a[1];
    var _b = React.useState(""), location = _b[0], setLocation = _b[1];
    var _c = React.useState(), startDate = _c[0], setStartDate = _c[1];
    var _d = React.useState(), endDate = _d[0], setEndDate = _d[1];
    var _e = React.useState(false), isActive = _e[0], setIsActive = _e[1];
    // Booth state
    var _f = React.useState(""), boothName = _f[0], setBoothName = _f[1];
    var _g = React.useState(""), boothCode = _g[0], setBoothCode = _g[1];
    // Products selection
    var _h = React.useState([]), selectedProducts = _h[0], setSelectedProducts = _h[1];
    var _j = React.useState(false), isProductDialogOpen = _j[0], setIsProductDialogOpen = _j[1];
    // Product list state (for dialog)
    var _k = React.useState([]), products = _k[0], setProducts = _k[1];
    var _l = React.useState(""), productSearch = _l[0], setProductSearch = _l[1];
    var _m = React.useState(true), hasMore = _m[0], setHasMore = _m[1];
    var _o = React.useState(1), currentPage = _o[0], setCurrentPage = _o[1];
    var _p = React.useState(false), loadingProducts = _p[0], setLoadingProducts = _p[1];
    var perPage = 20;
    // Fetch products from API
    var fetchProducts = function (page, search) { return __awaiter(_this, void 0, void 0, function () {
        var params, res, newProducts_1, total, fetchedCount, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoadingProducts(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    params = new URLSearchParams(__assign(__assign({ per_page: perPage.toString(), page: page.toString() }, (search && { search: search })), { status: "published", is_active: "true" }));
                    return [4 /*yield*/, axiosClient_1["default"].get("/products?" + params)];
                case 2:
                    res = _a.sent();
                    newProducts_1 = res.data.data.data;
                    total = res.data.data.total;
                    fetchedCount = page === 1 ? newProducts_1.length : products.length + newProducts_1.length;
                    if (page === 1) {
                        setProducts(newProducts_1);
                    }
                    else {
                        setProducts(function (prev) { return __spreadArrays(prev, newProducts_1); });
                    }
                    setHasMore(fetchedCount < total);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    console.error("Failed to load products", err_1);
                    showToast_1.showToast("Failed to load products", "error");
                    setHasMore(false);
                    return [3 /*break*/, 5];
                case 4:
                    setLoadingProducts(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Load initial or searched products
    React.useEffect(function () {
        if (isProductDialogOpen) {
            setCurrentPage(1);
            setProducts([]);
            setHasMore(true);
            fetchProducts(1, productSearch);
        }
    }, [isProductDialogOpen, productSearch]);
    // Infinite scroll hook
    var sentryRef = react_infinite_scroll_hook_1["default"]({
        loading: loadingProducts,
        hasNextPage: hasMore,
        onLoadMore: function () {
            if (!loadingProducts && hasMore) {
                var nextPage = currentPage + 1;
                setCurrentPage(nextPage);
                fetchProducts(nextPage, productSearch);
            }
        },
        disabled: !isProductDialogOpen,
        rootMargin: "0px 0px 200px 0px"
    })[0];
    // Filter out selected products
    var availableProducts = products.filter(function (p) { return !selectedProducts.includes(p.id); });
    var toggleProduct = function (productId) {
        setSelectedProducts(function (prev) {
            return prev.includes(productId)
                ? prev.filter(function (id) { return id !== productId; })
                : __spreadArrays(prev, [productId]);
        });
    };
    var handleCreateEvent = function () { return __awaiter(_this, void 0, void 0, function () {
        var eventResponse, eventId, _i, selectedProducts_1, productId, err_2, error_1, message;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (!name.trim()) {
                        showToast_1.showToast("Event name is required", "error");
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 14, 15, 16]);
                    return [4 /*yield*/, axiosClient_1["default"].post("/events", {
                            name: name,
                            location: location || null,
                            start_date: startDate ? date_fns_1.format(startDate, "yyyy-MM-dd") : null,
                            end_date: endDate ? date_fns_1.format(endDate, "yyyy-MM-dd") : null,
                            is_active: isActive
                        })];
                case 2:
                    eventResponse = _f.sent();
                    eventId = eventResponse.data.data.id;
                    showToast_1.showToast("Event created successfully", "success");
                    if (!boothName.trim()) return [3 /*break*/, 4];
                    return [4 /*yield*/, axiosClient_1["default"].post("/events/" + eventId + "/booth", {
                            booth_name: boothName,
                            booth_code: boothCode || null
                        })];
                case 3:
                    _f.sent();
                    showToast_1.showToast("Booth created", "success");
                    _f.label = 4;
                case 4:
                    if (!(selectedProducts.length > 0)) return [3 /*break*/, 11];
                    _i = 0, selectedProducts_1 = selectedProducts;
                    _f.label = 5;
                case 5:
                    if (!(_i < selectedProducts_1.length)) return [3 /*break*/, 10];
                    productId = selectedProducts_1[_i];
                    _f.label = 6;
                case 6:
                    _f.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, axiosClient_1["default"].post("/events/" + eventId + "/products", {
                            product_id: productId
                        })];
                case 7:
                    _f.sent();
                    return [3 /*break*/, 9];
                case 8:
                    err_2 = _f.sent();
                    if ((_c = (_b = (_a = err_2.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.includes("already linked")) {
                        return [3 /*break*/, 9];
                    }
                    else {
                        throw err_2;
                    }
                    return [3 /*break*/, 9];
                case 9:
                    _i++;
                    return [3 /*break*/, 5];
                case 10:
                    showToast_1.showToast(selectedProducts.length + " product(s) linked", "success");
                    _f.label = 11;
                case 11:
                    if (!isActive) return [3 /*break*/, 13];
                    return [4 /*yield*/, axiosClient_1["default"].patch("/events/" + eventId + "/activate")];
                case 12:
                    _f.sent();
                    showToast_1.showToast("Event activated", "success");
                    _f.label = 13;
                case 13:
                    router.push("/events");
                    return [3 /*break*/, 16];
                case 14:
                    error_1 = _f.sent();
                    console.error("Event creation failed:", error_1);
                    message = ((_e = (_d = error_1.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.message) || "Failed to create event";
                    showToast_1.showToast(message, "error");
                    return [3 /*break*/, 16];
                case 15:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 16: return [2 /*return*/];
            }
        });
    }); };
    var _q = React.useState(false), loading = _q[0], setLoading = _q[1];
    return (React.createElement(layout_1.DashboardLayout, null,
        React.createElement("div", { className: "max-w-4xl mx-auto space-y-6 py-8" },
            React.createElement("div", { className: "flex items-center justify-between" },
                React.createElement("div", null,
                    React.createElement("h1", { className: "text-3xl font-bold text-foreground" }, "Create New Event"),
                    React.createElement("p", { className: "text-sm text-muted-foreground mt-1" }, "Configure your event, booth, and showcased products")),
                React.createElement("div", { className: "flex gap-2" },
                    React.createElement(button_1.Button, { onClick: handleCreateEvent, disabled: loading, className: "gap-2" }, loading ? (React.createElement(React.Fragment, null,
                        React.createElement(lucide_react_1.Loader2, { className: "h-4 w-4 animate-spin" }),
                        "Creating...")) : (React.createElement(React.Fragment, null,
                        React.createElement(lucide_react_1.Save, { className: "h-4 w-4" }),
                        "Create Event"))))),
            React.createElement("div", { className: "space-y-6" },
                React.createElement(card_1.Card, null,
                    React.createElement(card_1.CardHeader, null,
                        React.createElement(card_1.CardTitle, null, "Event Details"),
                        React.createElement(card_1.CardDescription, null, "Basic information about the event. Only one event can be active at a time.")),
                    React.createElement(card_1.CardContent, { className: "space-y-6" },
                        React.createElement("div", { className: "flex items-center space-x-2" },
                            React.createElement(switch_1.Switch, { id: "is-active", checked: isActive, onCheckedChange: setIsActive }),
                            React.createElement(label_1.Label, { htmlFor: "is-active" }, "Activate this event immediately")),
                        React.createElement("div", { className: "space-y-2" },
                            React.createElement(label_1.Label, { htmlFor: "event-name" }, "Event Name *"),
                            React.createElement(input_1.Input, { id: "event-name", placeholder: "", value: name, onChange: function (e) { return setName(e.target.value); } })),
                        React.createElement("div", { className: "space-y-2" },
                            React.createElement(label_1.Label, { htmlFor: "location" }, "Location"),
                            React.createElement("div", { className: "flex items-center gap-2" },
                                React.createElement(lucide_react_1.MapPin, { className: "h-5 w-5 text-muted-foreground" }),
                                React.createElement(input_1.Input, { id: "location", placeholder: "", value: location, onChange: function (e) { return setLocation(e.target.value); } }))),
                        React.createElement("div", { className: "grid gap-6 md:grid-cols-2" },
                            React.createElement("div", { className: "space-y-2" },
                                React.createElement(label_1.Label, null, "Start Date"),
                                React.createElement(popover_1.Popover, null,
                                    React.createElement(popover_1.PopoverTrigger, { asChild: true },
                                        React.createElement(button_1.Button, { variant: "outline", className: utils_1.cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground") },
                                            React.createElement(lucide_react_1.CalendarIcon, { className: "mr-2 h-4 w-4" }),
                                            startDate ? date_fns_1.format(startDate, "PPP") : "Pick a date")),
                                    React.createElement(popover_1.PopoverContent, { className: "w-auto p-0" },
                                        React.createElement(calendar_1.Calendar, { mode: "single", selected: startDate, onSelect: setStartDate, initialFocus: true })))),
                            React.createElement("div", { className: "space-y-2" },
                                React.createElement(label_1.Label, null, "End Date"),
                                React.createElement(popover_1.Popover, null,
                                    React.createElement(popover_1.PopoverTrigger, { asChild: true },
                                        React.createElement(button_1.Button, { variant: "outline", className: utils_1.cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground") },
                                            React.createElement(lucide_react_1.CalendarIcon, { className: "mr-2 h-4 w-4" }),
                                            endDate ? date_fns_1.format(endDate, "PPP") : "Pick a date")),
                                    React.createElement(popover_1.PopoverContent, { className: "w-auto p-0" },
                                        React.createElement(calendar_1.Calendar, { mode: "single", selected: endDate, onSelect: setEndDate, initialFocus: true }))))))),
                React.createElement(card_1.Card, null,
                    React.createElement(card_1.CardHeader, null,
                        React.createElement(card_1.CardTitle, null, "Event Booth"),
                        React.createElement(card_1.CardDescription, null, "Each event has exactly one booth.")),
                    React.createElement(card_1.CardContent, { className: "space-y-6" },
                        React.createElement("div", { className: "grid gap-6 md:grid-cols-2" },
                            React.createElement("div", { className: "space-y-2" },
                                React.createElement(label_1.Label, { htmlFor: "booth-name" }, "Booth Name *"),
                                React.createElement(input_1.Input, { id: "booth-name", placeholder: "", value: boothName, onChange: function (e) { return setBoothName(e.target.value); } })),
                            React.createElement("div", { className: "space-y-2" },
                                React.createElement(label_1.Label, { htmlFor: "booth-code" }, "Booth Code"),
                                React.createElement(input_1.Input, { id: "booth-code", placeholder: "", value: boothCode, onChange: function (e) { return setBoothCode(e.target.value); } }))),
                        React.createElement("div", { className: "pt-4 border-t" },
                            React.createElement("div", { className: "flex items-center justify-between mb-4" },
                                React.createElement("div", null,
                                    React.createElement(label_1.Label, null, "Products in Booth"),
                                    React.createElement("p", { className: "text-sm text-muted-foreground" },
                                        selectedProducts.length,
                                        " product(s) selected")),
                                React.createElement(button_1.Button, { onClick: function () {
                                        setProductSearch("");
                                        setIsProductDialogOpen(true);
                                    }, className: "gap-2" },
                                    React.createElement(lucide_react_1.Plus, { className: "h-4 w-4" }),
                                    "Manage Products")),
                            selectedProducts.length > 0 && (React.createElement("div", { className: "flex flex-wrap gap-2" }, selectedProducts.map(function (productId) {
                                var product = products.find(function (p) { return p.id === productId; }) ||
                                    { id: productId, name: "Product #" + productId, sku: "", url_slug: "" };
                                return (React.createElement("div", { key: productId, className: "flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm" },
                                    React.createElement(lucide_react_1.Package, { className: "h-3 w-3" }),
                                    product.name,
                                    React.createElement("button", { onClick: function () { return toggleProduct(productId); }, className: "ml-1 hover:text-destructive transition-colors text-lg leading-none", "aria-label": "Remove product" }, "\u00D7")));
                            }))))))),
            React.createElement(dialog_1.Dialog, { open: isProductDialogOpen, onOpenChange: setIsProductDialogOpen },
                React.createElement(dialog_1.DialogContent, { className: "max-w-3xl max-h-[80vh] flex flex-col" },
                    React.createElement(dialog_1.DialogHeader, null,
                        React.createElement(dialog_1.DialogTitle, null, "Select Products for Booth"),
                        React.createElement(dialog_1.DialogDescription, null,
                            "Currently selected: ",
                            selectedProducts.length,
                            " product(s)")),
                    React.createElement("div", { className: "relative" },
                        React.createElement(lucide_react_1.Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
                        React.createElement(input_1.Input, { placeholder: "Search by name, SKU or description...", className: "pl-9", value: productSearch, onChange: function (e) { return setProductSearch(e.target.value); } })),
                    React.createElement("div", { className: "flex-1 overflow-y-auto" }, loadingProducts && products.length === 0 ? (React.createElement("div", { className: "flex items-center justify-center py-12" },
                        React.createElement(lucide_react_1.Loader2, { className: "h-8 w-8 animate-spin" }))) : availableProducts.length === 0 ? (React.createElement("p", { className: "text-center text-muted-foreground py-12" }, productSearch
                        ? "No products match your search"
                        : "No products available")) : (React.createElement("div", { className: "space-y-2" },
                        availableProducts.map(function (product) { return (React.createElement("div", { key: product.id, className: "flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors cursor-pointer", onClick: function () { return toggleProduct(product.id); } },
                            React.createElement(checkbox_1.Checkbox, { checked: false, readOnly: true }),
                            React.createElement("div", { className: "flex-1" },
                                React.createElement("p", { className: "font-medium" }, product.name),
                                React.createElement("p", { className: "text-sm text-muted-foreground" },
                                    "SKU: ",
                                    product.sku,
                                    " ",
                                    product.category && "\u2022 " + product.category.name)))); }),
                        hasMore && (React.createElement("div", { ref: sentryRef, className: "flex justify-center py-4" },
                            React.createElement(lucide_react_1.Loader2, { className: "h-6 w-6 animate-spin" })))))),
                    React.createElement("div", { className: "flex justify-end gap-2 pt-4 border-t" },
                        React.createElement(button_1.Button, { variant: "outline", onClick: function () { return setIsProductDialogOpen(false); } }, "Cancel"),
                        React.createElement(button_1.Button, { onClick: function () { return setIsProductDialogOpen(false); } },
                            "Done (",
                            selectedProducts.length,
                            " selected)")))))));
}
exports["default"] = NewEventPage;
