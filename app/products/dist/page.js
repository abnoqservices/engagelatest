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
var navigation_1 = require("next/navigation");
var select_1 = require("@/components/ui/select");
var table_1 = require("@/components/ui/table");
var dropdown_menu_1 = require("@/components/ui/dropdown-menu");
var badge_1 = require("@/components/ui/badge");
var checkbox_1 = require("@/components/ui/checkbox");
var switch_1 = require("@/components/ui/switch");
var lucide_react_1 = require("lucide-react");
var image_1 = require("next/image");
var link_1 = require("next/link");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var sheet_1 = require("@/components/ui/sheet");
var axiosClient_1 = require("@/lib/axiosClient");
var use_toast_1 = require("@/components/ui/use-toast");
function ProductsPage() {
    var _this = this;
    var _a = React.useState([]), products = _a[0], setProducts = _a[1];
    var _b = React.useState([]), categories = _b[0], setCategories = _b[1];
    var _c = React.useState([]), selectedProducts = _c[0], setSelectedProducts = _c[1];
    var _d = React.useState(""), searchQuery = _d[0], setSearchQuery = _d[1];
    var _e = React.useState("all"), categoryFilter = _e[0], setCategoryFilter = _e[1];
    var _f = React.useState("all"), statusFilter = _f[0], setStatusFilter = _f[1];
    var _g = React.useState(1), page = _g[0], setPage = _g[1];
    var _h = React.useState(10), perPage = _h[0], setPerPage = _h[1];
    var _j = React.useState(0), totalItems = _j[0], setTotalItems = _j[1];
    var _k = React.useState(false), isLoading = _k[0], setIsLoading = _k[1];
    // Edit Drawer State
    var _l = React.useState(false), editDrawerOpen = _l[0], setEditDrawerOpen = _l[1];
    var _m = React.useState(null), editingProduct = _m[0], setEditingProduct = _m[1];
    var _o = React.useState(false), isSaving = _o[0], setIsSaving = _o[1];
    var _p = React.useState(false), isDeleting = _p[0], setIsDeleting = _p[1];
    var router = navigation_1.useRouter();
    // Form states for edit drawer
    var _q = React.useState({
        name: "",
        sku: "",
        price: "",
        categoryId: "none",
        description: "",
        is_active: true
    }), formData = _q[0], setFormData = _q[1];
    var toast = use_toast_1.useToast().toast;
    var allSelected = selectedProducts.length === products.length && products.length > 0;
    var someSelected = selectedProducts.length > 0 && !allSelected;
    // Load Categories
    var loadCategories = function () { return __awaiter(_this, void 0, void 0, function () {
        var res, err_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axiosClient_1["default"].get("/product-categories")];
                case 1:
                    res = _c.sent();
                    if (res.data.success) {
                        setCategories(res.data.data || []);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _c.sent();
                    toast({
                        title: "Error",
                        description: ((_b = (_a = err_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Failed to load categories",
                        variant: "destructive"
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Fetch Products List
    var fetchProducts = function () { return __awaiter(_this, void 0, void 0, function () {
        var params, res, apiData, pagination, productData, e_1;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    setIsLoading(true);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, 4, 5]);
                    params = {
                        page: page,
                        per_page: perPage
                    };
                    if (searchQuery.trim())
                        params.search = searchQuery.trim();
                    if (categoryFilter !== "all")
                        params.category_id = categoryFilter;
                    if (statusFilter !== "all")
                        params.is_active = statusFilter === "active" ? 1 : 0;
                    return [4 /*yield*/, axiosClient_1["default"].get("/products", { params: params })];
                case 2:
                    res = _d.sent();
                    if (res.data.success && res.data.data) {
                        apiData = res.data.data.data || [];
                        pagination = res.data.data;
                        productData = apiData.map(function (item) {
                            var _a, _b, _c, _d, _e;
                            return ({
                                id: item.id,
                                image: ((_b = (_a = item.images) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.url) || "https://www.thekeepingroomnc.com/wp-content/uploads/2020/04/image-placeholder.jpg",
                                name: item.name,
                                sku: item.sku || "N/A",
                                category: ((_c = item.category) === null || _c === void 0 ? void 0 : _c.name) || "Uncategorized",
                                categoryId: ((_d = item.category) === null || _d === void 0 ? void 0 : _d.id) || 0,
                                price: item.price ? "$" + parseFloat(item.price).toFixed(2) : "$0.00",
                                scans: item.scans || 0,
                                views: item.views || 0,
                                leads: item.leads || 0,
                                status: (_e = item.is_active) !== null && _e !== void 0 ? _e : true,
                                description: item.description
                            });
                        });
                        setProducts(productData);
                        setTotalItems(pagination.total || ((_a = pagination.meta) === null || _a === void 0 ? void 0 : _a.total) || productData.length);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    e_1 = _d.sent();
                    console.error("Failed to fetch products", e_1);
                    toast({
                        title: "Error",
                        description: ((_c = (_b = e_1.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "Failed to load products",
                        variant: "destructive"
                    });
                    setProducts([]);
                    setTotalItems(0);
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Load full product for editing
    var loadProductForEdit = function (productId) { return __awaiter(_this, void 0, void 0, function () {
        var res, item, err_2;
        var _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    _h.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axiosClient_1["default"].get("/products/" + productId)];
                case 1:
                    res = _h.sent();
                    if (res.data.success) {
                        item = res.data.data;
                        setFormData({
                            name: item.name || "",
                            sku: item.sku || "",
                            price: ((_a = item.price) === null || _a === void 0 ? void 0 : _a.toString()) || "",
                            // If there is no category_id or category.id → "none", otherwise convert to string
                            categoryId: item.category_id || ((_b = item.category) === null || _b === void 0 ? void 0 : _b.id) ? String((_c = item.category_id) !== null && _c !== void 0 ? _c : (_d = item.category) === null || _d === void 0 ? void 0 : _d.id) : "none",
                            description: item.description || "",
                            is_active: (_e = item.is_active) !== null && _e !== void 0 ? _e : true
                        });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _h.sent();
                    toast({
                        title: "Error",
                        description: ((_g = (_f = err_2.response) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.message) || "Failed to load product details",
                        variant: "destructive"
                    });
                    throw err_2;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Save edited product
    var saveProduct = function () { return __awaiter(_this, void 0, void 0, function () {
        var priceValue, categoryId, payload, res, err_3;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!editingProduct)
                        return [2 /*return*/];
                    setIsSaving(true);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    priceValue = formData.price.trim();
                    categoryId = formData.categoryId === "none" ? null : formData.categoryId ? parseInt(formData.categoryId) : null;
                    payload = {
                        name: formData.name,
                        sku: formData.sku,
                        price: priceValue ? parseFloat(priceValue) : null,
                        category_id: categoryId,
                        description: formData.description,
                        is_active: formData.is_active
                    };
                    return [4 /*yield*/, axiosClient_1["default"].put("/products/" + editingProduct.id, payload)];
                case 2:
                    res = _c.sent();
                    if (res.data.success) {
                        toast({
                            title: "Success",
                            description: "Product updated successfully"
                        });
                        setEditDrawerOpen(false);
                        fetchProducts(); // Refresh list
                    }
                    return [3 /*break*/, 5];
                case 3:
                    err_3 = _c.sent();
                    toast({
                        title: "Error",
                        description: ((_b = (_a = err_3.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Failed to update product",
                        variant: "destructive"
                    });
                    return [3 /*break*/, 5];
                case 4:
                    setIsSaving(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Delete single product
    var deleteProduct = function (productId) { return __awaiter(_this, void 0, void 0, function () {
        var err_4;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!confirm("Are you sure you want to delete this product? This action cannot be undone."))
                        return [2 /*return*/];
                    setIsDeleting(true);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, axiosClient_1["default"]["delete"]("/products/" + productId)];
                case 2:
                    _c.sent();
                    toast({
                        title: "Deleted",
                        description: "Product deleted successfully"
                    });
                    fetchProducts();
                    return [3 /*break*/, 5];
                case 3:
                    err_4 = _c.sent();
                    toast({
                        title: "Error",
                        description: ((_b = (_a = err_4.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Failed to delete product",
                        variant: "destructive"
                    });
                    return [3 /*break*/, 5];
                case 4:
                    setIsDeleting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Effects
    React.useEffect(function () {
        fetchProducts();
    }, [page, perPage, searchQuery, categoryFilter, statusFilter]);
    React.useEffect(function () {
        loadCategories();
    }, []);
    React.useEffect(function () {
        setPage(1);
    }, [searchQuery, categoryFilter, statusFilter, perPage]);
    // Selection Handlers
    var toggleAll = function () {
        setSelectedProducts(allSelected ? [] : products.map(function (p) { return p.id.toString(); }));
    };
    var toggleProduct = function (id) {
        var idStr = id.toString();
        setSelectedProducts(function (prev) {
            return prev.includes(idStr) ? prev.filter(function (p) { return p !== idStr; }) : __spreadArrays(prev, [idStr]);
        });
    };
    var openEditDrawer = function (product) { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setEditingProduct(product);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, loadProductForEdit(product.id)];
                case 2:
                    _a.sent();
                    setEditDrawerOpen(true);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Failed to open edit drawer:", error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var openfullupdate = function (product) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            router.push("/products/update?id=" + product.id);
            return [2 /*return*/];
        });
    }); };
    // Recursive Category Options
    // Recursive Category Options - FIXED for clean hierarchy
    var renderCategoryTree = function (items, level) {
        if (level === void 0) { level = 0; }
        return items.map(function (cat) { return (React.createElement(React.Fragment, { key: cat.id },
            React.createElement(select_1.SelectItem, { value: cat.id.toString() },
                React.createElement("span", { style: { paddingLeft: level * 20 + "px" } },
                    level > 0 && "└─ ",
                    cat.name)),
            cat.children && cat.children.length > 0 && renderCategoryTree(cat.children, level + 1))); });
    };
    var getSelectedCategoryName = function () {
        var findName = function (cats) {
            for (var _i = 0, cats_1 = cats; _i < cats_1.length; _i++) {
                var cat = cats_1[_i];
                if (cat.id.toString() === formData.category)
                    return cat.name;
                if (cat.children.length > 0) {
                    var found = findName(cat.children);
                    if (found)
                        return found;
                }
            }
        };
        return findName(categories) || "Select category";
    };
    var totalPages = totalItems > 0 ? Math.ceil(totalItems / perPage) : 1;
    var startItem = totalItems === 0 ? 0 : (page - 1) * perPage + 1;
    var endItem = Math.min(page * perPage, totalItems);
    return (React.createElement(layout_1.DashboardLayout, null,
        React.createElement("div", { className: "space-y-6" },
            React.createElement("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" },
                React.createElement("div", null,
                    React.createElement("h1", { className: "text-3xl font-bold text-foreground" }, "Products"),
                    React.createElement("p", { className: "text-sm text-muted-foreground mt-1" }, "Manage your product catalog and QR codes")),
                React.createElement(link_1["default"], { href: "/products/new" },
                    React.createElement(button_1.Button, { className: "gap-2" },
                        React.createElement(lucide_react_1.Plus, { className: "h-4 w-4" }),
                        "Add Product"))),
            React.createElement("div", { className: "flex flex-col gap-4 rounded-xl border border-slate-200 bg-card p-4 shadow-sm" },
                React.createElement("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between" },
                    React.createElement("div", { className: "relative flex-1 max-w-md" },
                        React.createElement(lucide_react_1.Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
                        React.createElement(input_1.Input, { placeholder: "Search by name or SKU...", value: searchQuery, onChange: function (e) { return setSearchQuery(e.target.value); }, className: "pl-10" })),
                    React.createElement("div", { className: "flex flex-wrap gap-2" },
                        React.createElement(select_1.Select, { value: categoryFilter, onValueChange: setCategoryFilter },
                            React.createElement(select_1.SelectTrigger, { className: "w-[180px]" },
                                React.createElement(select_1.SelectValue, { placeholder: "All Categories" })),
                            React.createElement(select_1.SelectContent, null,
                                React.createElement(select_1.SelectItem, { value: "all" }, "All Categories"),
                                renderCategoryTree(categories))),
                        React.createElement(select_1.Select, { value: statusFilter, onValueChange: setStatusFilter },
                            React.createElement(select_1.SelectTrigger, { className: "w-[140px]" },
                                React.createElement(select_1.SelectValue, { placeholder: "All Status" })),
                            React.createElement(select_1.SelectContent, null,
                                React.createElement(select_1.SelectItem, { value: "all" }, "All Status"),
                                React.createElement(select_1.SelectItem, { value: "active" }, "Active"),
                                React.createElement(select_1.SelectItem, { value: "inactive" }, "Inactive"))),
                        React.createElement(button_1.Button, { variant: "outline", size: "icon", disabled: true },
                            React.createElement(lucide_react_1.Filter, { className: "h-4 w-4" })),
                        React.createElement(dropdown_menu_1.DropdownMenu, null,
                            React.createElement(dropdown_menu_1.DropdownMenuTrigger, { asChild: true },
                                React.createElement(button_1.Button, { variant: "outline", className: "gap-2" },
                                    React.createElement(lucide_react_1.Download, { className: "h-4 w-4" }),
                                    "Export")),
                            React.createElement(dropdown_menu_1.DropdownMenuContent, { align: "end" },
                                React.createElement(dropdown_menu_1.DropdownMenuItem, null, "Export as CSV"),
                                React.createElement(dropdown_menu_1.DropdownMenuItem, null, "Export as XLSX"))))),
                selectedProducts.length > 0 && (React.createElement("div", { className: "flex items-center gap-3 rounded-lg bg-primary/10 px-4 py-2 text-sm" },
                    React.createElement("span", { className: "font-medium text-primary" },
                        selectedProducts.length,
                        " selected"),
                    React.createElement("div", { className: "flex gap-2" },
                        React.createElement(button_1.Button, { variant: "outline", size: "sm" }, "Bulk Edit"),
                        React.createElement(button_1.Button, { variant: "outline", size: "sm" }, "Generate QRs"),
                        React.createElement(button_1.Button, { variant: "outline", size: "sm" }, "Export"),
                        React.createElement(button_1.Button, { variant: "outline", size: "sm", className: "text-destructive" },
                            React.createElement(lucide_react_1.Trash2, { className: "h-3 w-3 mr-1" }),
                            " Delete"))))),
            React.createElement("div", { className: "rounded-xl border bg-card shadow-sm overflow-x-auto" },
                React.createElement(table_1.Table, null,
                    React.createElement(table_1.TableHeader, null,
                        React.createElement(table_1.TableRow, null,
                            React.createElement(table_1.TableHead, { className: "w-12" },
                                React.createElement(checkbox_1.Checkbox, { checked: allSelected ? true : someSelected ? "indeterminate" : false, onCheckedChange: toggleAll })),
                            React.createElement(table_1.TableHead, null, "Image"),
                            React.createElement(table_1.TableHead, null, "Name"),
                            React.createElement(table_1.TableHead, null, "SKU"),
                            React.createElement(table_1.TableHead, null, "Category"),
                            React.createElement(table_1.TableHead, null, "Price"),
                            React.createElement(table_1.TableHead, { className: "text-center" }, "Scans"),
                            React.createElement(table_1.TableHead, { className: "text-center" }, "Views"),
                            React.createElement(table_1.TableHead, { className: "text-center" }, "Leads"),
                            React.createElement(table_1.TableHead, { className: "text-center" }, "Status"),
                            React.createElement(table_1.TableHead, { className: "text-right" }, "Actions"))),
                    React.createElement(table_1.TableBody, null, isLoading ? (React.createElement(table_1.TableRow, null,
                        React.createElement(table_1.TableCell, { colSpan: 11, className: "text-center py-10" }, "Loading products..."))) : products.length === 0 ? (React.createElement(table_1.TableRow, null,
                        React.createElement(table_1.TableCell, { colSpan: 11, className: "text-center py-10 text-muted-foreground" }, searchQuery || categoryFilter !== "all" || statusFilter !== "all"
                            ? "No products match your filters"
                            : "No products found"))) : (products.map(function (p) { return (React.createElement(table_1.TableRow, { key: p.id },
                        React.createElement(table_1.TableCell, null,
                            React.createElement(checkbox_1.Checkbox, { checked: selectedProducts.includes(p.id.toString()), onCheckedChange: function () { return toggleProduct(p.id); } })),
                        React.createElement(table_1.TableCell, null,
                            React.createElement(image_1["default"], { src: p.image, alt: p.name, width: 40, height: 40, className: "rounded-md object-cover" })),
                        React.createElement(table_1.TableCell, null,
                            React.createElement("button", { onClick: function () { return openEditDrawer(p); }, className: "font-medium text-blue-600 hover:underline" }, p.name)),
                        React.createElement(table_1.TableCell, { className: "font-mono text-sm" }, p.sku),
                        React.createElement(table_1.TableCell, null,
                            React.createElement(badge_1.Badge, { variant: "outline" }, p.category)),
                        React.createElement(table_1.TableCell, { className: "font-semibold" }, p.price),
                        React.createElement(table_1.TableCell, { className: "text-center" }, p.scans),
                        React.createElement(table_1.TableCell, { className: "text-center" }, p.views),
                        React.createElement(table_1.TableCell, { className: "text-center" }, p.leads),
                        React.createElement(table_1.TableCell, { className: "text-center" },
                            React.createElement(switch_1.Switch, { checked: p.status, disabled: true })),
                        React.createElement(table_1.TableCell, { className: "text-right" },
                            React.createElement(dropdown_menu_1.DropdownMenu, null,
                                React.createElement(dropdown_menu_1.DropdownMenuTrigger, { asChild: true },
                                    React.createElement(button_1.Button, { variant: "ghost", size: "icon" },
                                        React.createElement(lucide_react_1.MoreVertical, { className: "h-4 w-4" }))),
                                React.createElement(dropdown_menu_1.DropdownMenuContent, { align: "end" },
                                    React.createElement(dropdown_menu_1.DropdownMenuItem, { onClick: function () { return openfullupdate(p); } },
                                        React.createElement(lucide_react_1.Edit, { className: "mr-2 h-4 w-4" }),
                                        " Edit"),
                                    React.createElement(dropdown_menu_1.DropdownMenuItem, null,
                                        React.createElement(lucide_react_1.Copy, { className: "mr-2 h-4 w-4" }),
                                        " Clone"),
                                    React.createElement(dropdown_menu_1.DropdownMenuItem, null,
                                        React.createElement(lucide_react_1.QrCode, { className: "mr-2 h-4 w-4" }),
                                        " QR Code"),
                                    React.createElement(dropdown_menu_1.DropdownMenuItem, { asChild: true },
                                        React.createElement(link_1["default"], { href: "/products/" + p.id + "/landing-page" },
                                            React.createElement(lucide_react_1.Globe, { className: "mr-2 h-4 w-4" }),
                                            " Landing Page")),
                                    React.createElement(dropdown_menu_1.DropdownMenuSeparator, null),
                                    React.createElement(dropdown_menu_1.DropdownMenuItem, { className: "text-destructive", onClick: function () { return deleteProduct(p.id); }, disabled: isDeleting },
                                        React.createElement(lucide_react_1.Trash2, { className: "mr-2 h-4 w-4" }),
                                        " Delete")))))); }))))),
            React.createElement("div", { className: "flex items-center justify-between border-t bg-card px-6 py-4" },
                React.createElement("div", { className: "text-sm text-muted-foreground" }, totalItems > 0 ? (React.createElement(React.Fragment, null,
                    "Showing ",
                    React.createElement("strong", null,
                        startItem,
                        "\u2013",
                        endItem),
                    " of ",
                    React.createElement("strong", null, totalItems),
                    " products")) : ("No products to display")),
                React.createElement("div", { className: "flex items-center gap-3" },
                    React.createElement(select_1.Select, { value: perPage.toString(), onValueChange: function (v) { return setPerPage(Number(v)); } },
                        React.createElement(select_1.SelectTrigger, { className: "w-[100px]" },
                            React.createElement(select_1.SelectValue, null)),
                        React.createElement(select_1.SelectContent, null,
                            React.createElement(select_1.SelectItem, { value: "10" }, "10 / page"),
                            React.createElement(select_1.SelectItem, { value: "20" }, "20 / page"),
                            React.createElement(select_1.SelectItem, { value: "50" }, "50 / page"),
                            React.createElement(select_1.SelectItem, { value: "100" }, "100 / page"))),
                    React.createElement("div", { className: "flex gap-1" },
                        React.createElement(button_1.Button, { variant: "outline", size: "icon", disabled: page <= 1 || isLoading, onClick: function () { return setPage(function (p) { return p - 1; }); } },
                            React.createElement(lucide_react_1.ChevronLeft, { className: "h-4 w-4" })),
                        React.createElement(button_1.Button, { variant: "outline", size: "icon", disabled: page >= totalPages || isLoading, onClick: function () { return setPage(function (p) { return p + 1; }); } },
                            React.createElement(lucide_react_1.ChevronRight, { className: "h-4 w-4" })))))),
        React.createElement(sheet_1.Sheet, { open: editDrawerOpen, onOpenChange: setEditDrawerOpen },
            React.createElement(sheet_1.SheetContent, { className: "w-full sm:max-w-2xl overflow-y-auto" },
                React.createElement("div", { className: "sticky top-0 bg-background border-b z-10" },
                    React.createElement(sheet_1.SheetHeader, { className: "px-6 py-4" },
                        React.createElement(sheet_1.SheetTitle, { className: "text-2xl font-bold" }, "Edit Product"),
                        React.createElement(sheet_1.SheetDescription, null, "Update product information"))),
                React.createElement("div", { className: "space-y-6 p-6" },
                    React.createElement("div", { className: "grid gap-4" },
                        React.createElement("div", null,
                            React.createElement(label_1.Label, { htmlFor: "name" }, "Product Name"),
                            React.createElement(input_1.Input, { id: "name", value: formData.name, onChange: function (e) { return setFormData(__assign(__assign({}, formData), { name: e.target.value })); } })),
                        React.createElement("div", null,
                            React.createElement(label_1.Label, { htmlFor: "sku" }, "SKU"),
                            React.createElement(input_1.Input, { id: "sku", value: formData.sku, onChange: function (e) { return setFormData(__assign(__assign({}, formData), { sku: e.target.value })); } })),
                        React.createElement("div", null,
                            React.createElement(label_1.Label, { htmlFor: "price" }, "Price"),
                            React.createElement(input_1.Input, { id: "price", type: "number", step: "0.01", value: formData.price, onChange: function (e) { return setFormData(__assign(__assign({}, formData), { price: e.target.value })); } })),
                        React.createElement("div", null,
                            React.createElement(label_1.Label, null, "Category"),
                            React.createElement(select_1.Select, { value: formData.categoryId, onValueChange: function (value) { return setFormData(__assign(__assign({}, formData), { categoryId: value })); } },
                                React.createElement(select_1.SelectTrigger, null,
                                    React.createElement(select_1.SelectValue, { placeholder: "Select category" })),
                                React.createElement(select_1.SelectContent, null,
                                    React.createElement(select_1.SelectItem, { value: "none" }, "No Category"),
                                    renderCategoryTree(categories)))),
                        React.createElement("div", null,
                            React.createElement(label_1.Label, { htmlFor: "description" }, "Description"),
                            React.createElement(textarea_1.Textarea, { id: "description", rows: 4, value: formData.description, onChange: function (e) { return setFormData(__assign(__assign({}, formData), { description: e.target.value })); } })),
                        React.createElement("div", { className: "flex items-center space-x-2" },
                            React.createElement(switch_1.Switch, { id: "status", checked: formData.is_active, onCheckedChange: function (checked) { return setFormData(__assign(__assign({}, formData), { is_active: checked })); } }),
                            React.createElement(label_1.Label, { htmlFor: "status" }, "Active"))),
                    React.createElement("div", { className: "flex gap-3 pt-6 border-t sticky bottom-0 bg-background" },
                        React.createElement(button_1.Button, { variant: "outline", className: "flex-1", onClick: function () { return setEditDrawerOpen(false); }, disabled: isSaving }, "Cancel"),
                        React.createElement(button_1.Button, { className: "flex-1", onClick: saveProduct, disabled: isSaving }, isSaving ? "Saving..." : "Save Changes")))))));
}
exports["default"] = ProductsPage;
