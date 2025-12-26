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
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var select_1 = require("@/components/ui/select");
var tabs_1 = require("@/components/ui/tabs");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var switch_1 = require("@/components/ui/switch");
var lucide_react_1 = require("lucide-react");
var dialog_1 = require("@/components/ui/dialog");
var layout_1 = require("@/components/dashboard/layout");
var spinner_1 = require("@/components/ui/spinner");
var axiosClient_1 = require("@/lib/axiosClient");
var showToast_1 = require("@/lib/showToast");
var DRAFT_KEY = "product_draft_v1";
function NewProductPage() {
    var _this = this;
    var _a = React.useState({
        name: "",
        sku: "",
        category: "",
        price: "",
        description: "",
        videoUrl: "",
        metaTitle: "",
        metaDescription: "",
        keywords: "",
        urlSlug: "",
        isActive: true
    }), formData = _a[0], setFormData = _a[1];
    var _b = React.useState([]), flatCategories = _b[0], setFlatCategories = _b[1];
    var _c = React.useState([]), treeCategories = _c[0], setTreeCategories = _c[1];
    var _d = React.useState(false), loadingCategories = _d[0], setLoadingCategories = _d[1];
    var _e = React.useState([]), selectedImages = _e[0], setSelectedImages = _e[1];
    var _f = React.useState([]), pdfFiles = _f[0], setPdfFiles = _f[1];
    var _g = React.useState([]), tags = _g[0], setTags = _g[1];
    var _h = React.useState(""), newTag = _h[0], setNewTag = _h[1];
    var _j = React.useState(null), productId = _j[0], setProductId = _j[1];
    var _k = React.useState("basic"), activeTab = _k[0], setActiveTab = _k[1];
    var _l = React.useState(false), isSavingBasic = _l[0], setIsSavingBasic = _l[1];
    var _m = React.useState(false), isSavingMedia = _m[0], setIsSavingMedia = _m[1];
    var _o = React.useState(false), isSavingSEO = _o[0], setIsSavingSEO = _o[1];
    var _p = React.useState({ type: "", message: "" }), alertMessage = _p[0], setAlertMessage = _p[1];
    var _q = React.useState(false), showPreview = _q[0], setShowPreview = _q[1];
    var _r = React.useState(false), previewLoading = _r[0], setPreviewLoading = _r[1];
    var _s = React.useState(null), qrimg = _s[0], setQr = _s[1];
    var showAlert = function (type, message, duration) {
        if (duration === void 0) { duration = 5000; }
        showToast_1.showToast(message, type);
        setTimeout(function () { return setAlertMessage({ type: "", message: "" }); }, duration);
    };
    var handleInputChange = function (field, value) {
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[field] = value, _a)));
        });
    };
    var generateSafeSku = function (name) {
        if (!name)
            return "PROD" + Date.now().toString().slice(-6);
        return name.toUpperCase().replace(/\s+/g, "").slice(0, 10) + "001";
    };
    var slugify = function (text) {
        return (text || "")
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w\-]+/g, "")
            .replace(/\-\-+/g, "-");
    };
    // === Category Tree ===
    var buildTree = function (flat) {
        var map = new Map();
        var roots = [];
        flat.forEach(function (cat) {
            map.set(cat.id, __assign(__assign({}, cat), { children: [] }));
        });
        flat.forEach(function (cat) {
            if (cat.parent_id && map.has(cat.parent_id)) {
                map.get(cat.parent_id).children.push(map.get(cat.id));
            }
            else {
                roots.push(map.get(cat.id));
            }
        });
        return roots;
    };
    var loadCategories = function () { return __awaiter(_this, void 0, void 0, function () {
        var res, flat, err_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, 3, 4]);
                    setLoadingCategories(true);
                    return [4 /*yield*/, axiosClient_1["default"].get("/product-categories")];
                case 1:
                    res = _c.sent();
                    if (res.data.success && Array.isArray(res.data.data)) {
                        flat = res.data.data;
                        setFlatCategories(flat);
                        setTreeCategories(buildTree(flat));
                    }
                    return [3 /*break*/, 4];
                case 2:
                    err_1 = _c.sent();
                    showToast_1.showToast(((_b = (_a = err_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Failed to load categories", "error");
                    return [3 /*break*/, 4];
                case 3:
                    setLoadingCategories(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var fetchQrCode = function (productId) { return __awaiter(_this, void 0, void 0, function () {
        var baseUrl, res, blob, previewUrl, qrFile, formData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    baseUrl = "http://localhost/preview/" + productId;
                    return [4 /*yield*/, fetch("/api/qr", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ baseUrl: baseUrl })
                        })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.blob()];
                case 2:
                    blob = _a.sent();
                    previewUrl = URL.createObjectURL(blob);
                    qrFile = new File([blob], "qr.png", { type: "image/png" });
                    formData = new FormData();
                    formData.append("qr_code", qrFile); // 👈 IMPORTANT
                    return [4 /*yield*/, axiosClient_1["default"].post("/products/" + productId + "/qr-code", formData, {
                            headers: {
                                "Content-Type": "multipart/form-data"
                            }
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    React.useEffect(function () {
        loadCategories();
    }, []);
    var renderCategoryTree = function (items, level) {
        if (level === void 0) { level = 0; }
        return items.map(function (cat) { return (React.createElement(React.Fragment, { key: cat.id },
            React.createElement(select_1.SelectItem, { value: cat.id.toString() },
                React.createElement("span", { style: { paddingLeft: level * 20 + "px" } },
                    level > 0 && "└─ ",
                    cat.name)),
            cat.children && cat.children.length > 0 && renderCategoryTree(cat.children, level + 1))); });
    };
    var saveDraft = function () {
        var draft = {
            formData: formData,
            selectedImages: selectedImages.map(function (img) { return (__assign(__assign({}, img), { base64: img.url.startsWith("data:") ? img.url : undefined })); }),
            pdfFiles: pdfFiles.map(function (pdf) { return (__assign(__assign({}, pdf), { base64: pdf.file ? URL.createObjectURL(pdf.file).startsWith("data:") ? undefined : undefined : undefined })); }),
            tags: tags,
            timestamp: Date.now()
        };
        var promises = selectedImages.map(function (img) { return __awaiter(_this, void 0, void 0, function () {
            var base64;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!img.file) return [3 /*break*/, 2];
                        return [4 /*yield*/, fileToBase64(img.file)];
                    case 1:
                        base64 = _a.sent();
                        return [2 /*return*/, __assign(__assign({}, img), { base64: base64 })];
                    case 2: return [2 /*return*/, img];
                }
            });
        }); });
        var pdfPromises = pdfFiles.map(function (pdf) { return __awaiter(_this, void 0, void 0, function () {
            var base64;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!pdf.file) return [3 /*break*/, 2];
                        return [4 /*yield*/, fileToBase64(pdf.file)];
                    case 1:
                        base64 = _a.sent();
                        return [2 /*return*/, __assign(__assign({}, pdf), { base64: base64 })];
                    case 2: return [2 /*return*/, pdf];
                }
            });
        }); });
        Promise.all(__spreadArrays(promises, pdfPromises)).then(function (resolved) {
            var _a = [resolved.slice(0, selectedImages.length), resolved.slice(selectedImages.length)], imagesResolved = _a[0], pdfsResolved = _a[1];
            var fullDraft = {
                formData: formData,
                selectedImages: imagesResolved,
                pdfFiles: pdfsResolved,
                tags: tags,
                timestamp: Date.now()
            };
            localStorage.setItem(DRAFT_KEY, JSON.stringify(fullDraft));
            showToast_1.showToast("Draft saved locally!", "success");
        });
    };
    var fileToBase64 = function (file) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function () { return resolve(reader.result); };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };
    var loadDraft = function () {
        var raw = localStorage.getItem(DRAFT_KEY);
        if (!raw)
            return;
        try {
            var draft = JSON.parse(raw);
            setFormData(draft.formData);
            setTags(draft.tags || []);
            // Restore images
            setSelectedImages(draft.selectedImages.map(function (img) { return (__assign(__assign({}, img), { url: img.base64 || img.url, file: undefined })); }));
            // Restore PDFs
            setPdfFiles(draft.pdfFiles.map(function (pdf) { return (__assign(__assign({}, pdf), { file: undefined })); }));
            showToast_1.showToast("Draft loaded from local storage!", "success");
        }
        catch (err) {
            showToast_1.showToast("Failed to load draft", "error");
        }
    };
    var clearDraft = function () {
        localStorage.removeItem(DRAFT_KEY);
    };
    React.useEffect(function () {
        if (!productId) {
            loadDraft();
        }
    }, []);
    // === File Uploads ===
    var handleImageUpload = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var files, newImages, i, file, url;
        return __generator(this, function (_a) {
            files = e.target.files;
            if (!files)
                return [2 /*return*/];
            newImages = [];
            for (i = 0; i < files.length; i++) {
                file = files[i];
                url = URL.createObjectURL(file);
                newImages.push({
                    id: "img-" + Date.now() + "-" + i,
                    url: url,
                    file: file
                });
            }
            setSelectedImages(function (prev) { return __spreadArrays(prev, newImages); });
            e.currentTarget.value = "";
            return [2 /*return*/];
        });
    }); };
    var removeImage = function (id) {
        setSelectedImages(function (prev) {
            var removed = prev.find(function (i) { return i.id === id; });
            if ((removed === null || removed === void 0 ? void 0 : removed.url) && removed.file)
                URL.revokeObjectURL(removed.url);
            return prev.filter(function (i) { return i.id !== id; });
        });
    };
    var handlePdfUpload = function (e) {
        var files = e.target.files;
        if (!files)
            return;
        var newPdfs = Array.from(files).map(function (file, idx) { return ({
            id: "pdf-" + Date.now() + "-" + idx,
            name: file.name,
            file: file
        }); });
        setPdfFiles(function (prev) { return __spreadArrays(prev, newPdfs); });
        e.currentTarget.value = "";
    };
    var removePdf = function (id) {
        setPdfFiles(function (prev) { return prev.filter(function (p) { return p.id !== id; }); });
    };
    var handleSaveBasic = function () { return __awaiter(_this, void 0, void 0, function () {
        var selectedCatId, payload, response, newProductId, error_1, msg;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (!formData.name.trim())
                        return [2 /*return*/, showToast_1.showToast("Product name is required", "error")];
                    if (!formData.category)
                        return [2 /*return*/, showToast_1.showToast("Category is required", "error")];
                    if (!formData.price || isNaN(Number(formData.price)))
                        return [2 /*return*/, showToast_1.showToast("Valid price is required", "error")];
                    setIsSavingBasic(true);
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 3, 4, 5]);
                    selectedCatId = parseInt(formData.category);
                    payload = {
                        name: formData.name.trim(),
                        sku: formData.sku || generateSafeSku(formData.name),
                        category_id: selectedCatId,
                        price: parseFloat(formData.price),
                        description: formData.description || null,
                        is_active: formData.isActive,
                        status: "draft",
                        tags: tags
                    };
                    return [4 /*yield*/, axiosClient_1["default"].post("/products", payload)];
                case 2:
                    response = _f.sent();
                    newProductId = ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.id) || ((_c = response.data) === null || _c === void 0 ? void 0 : _c.id);
                    if (!newProductId)
                        throw new Error("No product ID returned");
                    fetchQrCode(newProductId);
                    setProductId(newProductId);
                    clearDraft();
                    setActiveTab("media");
                    showToast_1.showToast("Product created successfully! ID: " + newProductId + ". Now upload media.", "success");
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _f.sent();
                    msg = ((_e = (_d = error_1 === null || error_1 === void 0 ? void 0 : error_1.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.message) || error_1.message || "Failed to create product";
                    showToast_1.showToast("Failed to save basic info: " + msg, "error");
                    return [3 /*break*/, 5];
                case 4:
                    setIsSavingBasic(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var toAbsoluteUrl = function (path) {
        if (path.startsWith("http"))
            return path;
        var encodedPath = path.split("/").map(encodeURIComponent).join("/");
        return "" + window.location.origin + encodedPath;
    };
    var uploadFile = function (file) { return __awaiter(_this, void 0, void 0, function () {
        var formData, res, json;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    formData = new FormData();
                    formData.append("file", file);
                    return [4 /*yield*/, fetch("/api/upload-images", {
                            method: "POST",
                            body: formData
                        })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    json = _a.sent();
                    if (!res.ok || !(json === null || json === void 0 ? void 0 : json.success)) {
                        throw new Error((json === null || json === void 0 ? void 0 : json.message) || "Upload API failed");
                    }
                    return [2 /*return*/, json.data];
            }
        });
    }); };
    var handleSaveMedia = function () { return __awaiter(_this, void 0, void 0, function () {
        var _i, _a, _b, index, img, uploaded, _c, pdfFiles_1, pdf, uploaded, error_2;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    setIsSavingMedia(true);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 12, 13, 14]);
                    _i = 0, _a = selectedImages.entries();
                    _d.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    _b = _a[_i], index = _b[0], img = _b[1];
                    if (!img.file)
                        return [3 /*break*/, 5];
                    return [4 /*yield*/, uploadFile(img.file)];
                case 3:
                    uploaded = _d.sent();
                    return [4 /*yield*/, axiosClient_1["default"].post("/product-images", {
                            product_id: productId,
                            url: toAbsoluteUrl(uploaded.url),
                            s3_key: uploaded.s3_key,
                            folder: "product-images",
                            type: "gallery",
                            name: uploaded.name || img.file.name,
                            size: img.file.size,
                            mime_type: img.file.type,
                            position: index + 1
                        })];
                case 4:
                    _d.sent();
                    _d.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6:
                    _c = 0, pdfFiles_1 = pdfFiles;
                    _d.label = 7;
                case 7:
                    if (!(_c < pdfFiles_1.length)) return [3 /*break*/, 11];
                    pdf = pdfFiles_1[_c];
                    if (!pdf.file)
                        return [3 /*break*/, 10];
                    return [4 /*yield*/, uploadFile(pdf.file)];
                case 8:
                    uploaded = _d.sent();
                    return [4 /*yield*/, axiosClient_1["default"].post("/product-documents", {
                            product_id: productId,
                            url: toAbsoluteUrl(uploaded.url),
                            s3_key: uploaded.s3_key,
                            folder: "product-documents",
                            name: uploaded.name || pdf.file.name,
                            size: pdf.file.size,
                            mime_type: pdf.file.type
                        })];
                case 9:
                    _d.sent();
                    _d.label = 10;
                case 10:
                    _c++;
                    return [3 /*break*/, 7];
                case 11:
                    setActiveTab("seo");
                    showToast_1.showToast("All media uploaded and linked successfully!", "success");
                    return [3 /*break*/, 14];
                case 12:
                    error_2 = _d.sent();
                    console.error("Media upload failed:", error_2);
                    showToast_1.showToast((error_2 === null || error_2 === void 0 ? void 0 : error_2.message) || "Something went wrong while uploading media", "error");
                    return [3 /*break*/, 14];
                case 13:
                    setIsSavingMedia(false);
                    return [7 /*endfinally*/];
                case 14: return [2 /*return*/];
            }
        });
    }); };
    var handlePublish = function () { return __awaiter(_this, void 0, void 0, function () {
        var payload, error_3, msg;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!productId)
                        return [2 /*return*/, showToast_1.showToast("Product not created", "error")];
                    setIsSavingSEO(true);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, 4, 5]);
                    payload = {
                        video_url: formData.videoUrl || null,
                        meta_title: formData.metaTitle || formData.name,
                        meta_description: formData.metaDescription || ((_a = formData.description) === null || _a === void 0 ? void 0 : _a.slice(0, 160)),
                        keywords: formData.keywords || null,
                        url_slug: formData.urlSlug || slugify(formData.name),
                        status: "published"
                    };
                    return [4 /*yield*/, axiosClient_1["default"].put("/products/" + productId, payload)];
                case 2:
                    _d.sent();
                    clearDraft();
                    showToast_1.showToast("Product published successfully!", "success");
                    return [3 /*break*/, 5];
                case 3:
                    error_3 = _d.sent();
                    msg = ((_c = (_b = error_3 === null || error_3 === void 0 ? void 0 : error_3.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || error_3.message || "Publish failed";
                    showToast_1.showToast("Publish failed: " + msg, "error");
                    return [3 /*break*/, 5];
                case 4:
                    setIsSavingSEO(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handlePreview = function () {
        setPreviewLoading(true);
        setTimeout(function () {
            setPreviewLoading(false);
            setShowPreview(true);
        }, 600);
    };
    var handleAddTag = function () {
        var tag = newTag.trim();
        if (tag && !tags.includes(tag)) {
            setTags(function (prev) { return __spreadArrays(prev, [tag]); });
            setNewTag("");
        }
    };
    var removeTag = function (idx) {
        setTags(function (prev) { return prev.filter(function (_, i) { return i !== idx; }); });
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
        return findName(treeCategories) || "Select category";
    };
    return (React.createElement(layout_1.DashboardLayout, null,
        React.createElement("div", { className: "min-h-screen bg-slate-50 p-6" },
            React.createElement("div", { className: "max-w-7xl mx-auto space-y-6" },
                React.createElement("div", { className: "flex items-center justify-between" },
                    React.createElement("div", null,
                        React.createElement("h1", { className: "text-3xl font-bold text-slate-900" }, "Add New Product"),
                        React.createElement("p", { className: "text-sm text-slate-600 mt-1" }, "Step-by-step product creation"),
                        productId && React.createElement("p", { className: "text-xs text-blue-600 mt-1" },
                            "Product ID: ",
                            productId)),
                    React.createElement("div", { className: "flex gap-2" },
                        React.createElement(button_1.Button, { variant: "outline", onClick: saveDraft, disabled: !!productId },
                            React.createElement(lucide_react_1.Save, { className: "h-4 w-4 mr-2" }),
                            "Save Draft"),
                        React.createElement(button_1.Button, { variant: "outline", onClick: handlePreview, disabled: previewLoading },
                            previewLoading ? React.createElement(spinner_1.Spinner, { className: "size-4 mr-2" }) : React.createElement(lucide_react_1.Eye, { className: "h-4 w-4 mr-2" }),
                            "Preview"),
                        activeTab === "seo" && (React.createElement(button_1.Button, { onClick: handlePublish, disabled: isSavingSEO, className: "bg-green-600 hover:bg-green-700" },
                            isSavingSEO ? React.createElement(spinner_1.Spinner, { className: "size-4 mr-2" }) : React.createElement(lucide_react_1.CheckCircle, { className: "h-4 w-4 mr-2" }),
                            "Publish Product")))),
                React.createElement(tabs_1.Tabs, { value: activeTab, onValueChange: setActiveTab, className: "space-y-6" },
                    React.createElement(tabs_1.TabsList, { className: "grid w-full grid-cols-3" },
                        React.createElement(tabs_1.TabsTrigger, { value: "basic", disabled: false }, "Basic Info"),
                        React.createElement(tabs_1.TabsTrigger, { value: "media", disabled: !productId }, "Demo Media"),
                        React.createElement(tabs_1.TabsTrigger, { value: "seo", disabled: !productId || (selectedImages.length === 0 && pdfFiles.length === 0 && !formData.videoUrl) }, "SEO & Publish")),
                    React.createElement(tabs_1.TabsContent, { value: "basic", className: "space-y-6" },
                        React.createElement(card_1.Card, null,
                            React.createElement(card_1.CardHeader, null,
                                React.createElement(card_1.CardTitle, null, "Product Details"),
                                React.createElement(card_1.CardDescription, null, "Fill in basic product information")),
                            React.createElement(card_1.CardContent, { className: "space-y-6" },
                                React.createElement("div", { className: "grid gap-6 md:grid-cols-2" },
                                    React.createElement("div", { className: "space-y-2" },
                                        React.createElement(label_1.Label, { htmlFor: "name" }, "Product Name *"),
                                        React.createElement(input_1.Input, { id: "name", value: formData.name, onChange: function (e) { return handleInputChange("name", e.target.value); } })),
                                    React.createElement("div", { className: "space-y-2" },
                                        React.createElement(label_1.Label, { htmlFor: "sku" }, "SKU (optional)"),
                                        React.createElement(input_1.Input, { id: "sku", value: formData.sku, onChange: function (e) { return handleInputChange("sku", e.target.value); } }))),
                                React.createElement("div", { className: "grid gap-6 md:grid-cols-2" },
                                    React.createElement("div", { className: "space-y-2" },
                                        React.createElement(label_1.Label, { htmlFor: "category" }, "Category *"),
                                        React.createElement(select_1.Select, { value: formData.category, onValueChange: function (v) { return handleInputChange("category", v); }, disabled: loadingCategories },
                                            React.createElement(select_1.SelectTrigger, null,
                                                React.createElement(select_1.SelectValue, { placeholder: loadingCategories ? "Loading categories..." : "Select category" }, loadingCategories ? "Loading..." : getSelectedCategoryName())),
                                            React.createElement(select_1.SelectContent, { className: "max-h-96" }, treeCategories.length > 0 ? (renderCategoryTree(treeCategories)) : (React.createElement("div", { className: "p-4 text-center text-muted-foreground" }, "No categories found"))))),
                                    React.createElement("div", { className: "space-y-2" },
                                        React.createElement(label_1.Label, { htmlFor: "price" }, "Price *"),
                                        React.createElement(input_1.Input, { id: "price", type: "number", value: formData.price, onChange: function (e) { return handleInputChange("price", e.target.value); } }))),
                                React.createElement("div", { className: "space-y-2" },
                                    React.createElement(label_1.Label, { htmlFor: "description" }, "Description"),
                                    React.createElement(textarea_1.Textarea, { id: "description", rows: 5, value: formData.description, onChange: function (e) { return handleInputChange("description", e.target.value); } })),
                                React.createElement("div", { className: "space-y-2" },
                                    React.createElement(label_1.Label, null, "Tags"),
                                    React.createElement("div", { className: "flex flex-wrap gap-2 mb-2" }, tags.map(function (tag, i) { return (React.createElement(badge_1.Badge, { key: i, variant: "secondary", className: "gap-1" },
                                        tag,
                                        React.createElement("button", { onClick: function () { return removeTag(i); } },
                                            React.createElement(lucide_react_1.X, { className: "h-3 w-3" })))); })),
                                    React.createElement("div", { className: "flex gap-2" },
                                        React.createElement(input_1.Input, { placeholder: "Add tag...", value: newTag, onChange: function (e) { return setNewTag(e.target.value); }, onKeyDown: function (e) { return e.key === "Enter" && (e.preventDefault(), handleAddTag()); } }),
                                        React.createElement(button_1.Button, { onClick: handleAddTag, size: "sm" },
                                            React.createElement(lucide_react_1.Plus, { className: "h-4 w-4 mr-1" }),
                                            "Add"))),
                                React.createElement("div", { className: "flex items-center justify-between rounded-lg border p-4" },
                                    React.createElement("div", null,
                                        React.createElement("p", { className: "font-medium" }, "Product Active"),
                                        React.createElement("p", { className: "text-sm text-slate-500" }, "Visible to customers after publish")),
                                    React.createElement(switch_1.Switch, { checked: formData.isActive, onCheckedChange: function (c) { return handleInputChange("isActive", c); } })),
                                React.createElement("div", { className: "flex justify-end gap-3" },
                                    React.createElement(button_1.Button, { variant: "outline", onClick: saveDraft, disabled: !!productId },
                                        React.createElement(lucide_react_1.Save, { className: "h-4 w-4 mr-2" }),
                                        " Save as Draft"),
                                    React.createElement(button_1.Button, { onClick: handleSaveBasic, disabled: isSavingBasic, size: "lg" },
                                        isSavingBasic ? React.createElement(spinner_1.Spinner, { className: "mr-2" }) : null,
                                        "Save & Continue to Media"))))),
                    React.createElement(tabs_1.TabsContent, { value: "media", className: "space-y-6" },
                        React.createElement(card_1.Card, null,
                            React.createElement(card_1.CardHeader, null,
                                React.createElement(card_1.CardTitle, null, "Demo Media"),
                                React.createElement(card_1.CardDescription, null, "Upload images, PDFs, and video")),
                            React.createElement(card_1.CardContent, { className: "space-y-6" },
                                React.createElement("div", { className: "space-y-2" },
                                    React.createElement(label_1.Label, { htmlFor: "video" }, "Video URL (optional)"),
                                    React.createElement(input_1.Input, { id: "video", placeholder: "https://youtube.com/...", value: formData.videoUrl, onChange: function (e) { return handleInputChange("videoUrl", e.target.value); } })),
                                React.createElement("div", { className: "space-y-2" },
                                    React.createElement(label_1.Label, null, "Product Images"),
                                    React.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4" },
                                        selectedImages.map(function (img, i) { return (React.createElement("div", { key: img.id, className: "relative group aspect-square" },
                                            React.createElement("img", { src: img.url, alt: "", className: "w-full h-full rounded-lg object-cover" }),
                                            React.createElement("button", { onClick: function () { return removeImage(img.id); }, className: "absolute top-2 right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100" },
                                                React.createElement(lucide_react_1.X, { className: "h-3 w-3 text-white" })),
                                            i === 0 && React.createElement(badge_1.Badge, { className: "absolute bottom-2 left-2" }, "Primary"))); }),
                                        React.createElement("label", { className: "flex aspect-square items-center justify-center rounded-lg border-2 border-dashed cursor-pointer" },
                                            React.createElement("input", { type: "file", accept: "image/*", multiple: true, onChange: handleImageUpload, className: "hidden" }),
                                            React.createElement(lucide_react_1.Upload, { className: "h-8 w-8 text-slate-400" })))),
                                React.createElement("div", { className: "space-y-2" },
                                    React.createElement(label_1.Label, null, "PDF Documents"),
                                    pdfFiles.map(function (pdf) { return (React.createElement("div", { key: pdf.id, className: "flex items-center justify-between p-3 bg-slate-50 rounded-lg" },
                                        React.createElement("div", { className: "flex items-center gap-2" },
                                            React.createElement(lucide_react_1.FileText, { className: "h-5 w-5 text-red-500" }),
                                            React.createElement("span", null, pdf.name)),
                                        React.createElement(button_1.Button, { variant: "ghost", size: "sm", onClick: function () { return removePdf(pdf.id); } },
                                            React.createElement(lucide_react_1.X, { className: "h-4 w-4" })))); }),
                                    React.createElement("label", { className: "flex w-full items-center justify-center rounded-lg border-2 border-dashed p-8 cursor-pointer" },
                                        React.createElement("input", { type: "file", accept: ".pdf", multiple: true, onChange: handlePdfUpload, className: "hidden" }),
                                        React.createElement("div", { className: "text-center" },
                                            React.createElement(lucide_react_1.FileText, { className: "mx-auto h-12 w-12 text-slate-400" }),
                                            React.createElement("p", { className: "mt-2 font-medium" }, "Upload PDF")))),
                                React.createElement("div", { className: "flex justify-end" },
                                    React.createElement(button_1.Button, { onClick: handleSaveMedia, disabled: isSavingMedia || (selectedImages.length === 0 && pdfFiles.length === 0 && !formData.videoUrl), size: "lg" },
                                        isSavingMedia ? React.createElement(spinner_1.Spinner, { className: "mr-2" }) : null,
                                        "Save Media & Continue to SEO"))))),
                    React.createElement(tabs_1.TabsContent, { value: "seo", className: "space-y-6" },
                        React.createElement(card_1.Card, null,
                            React.createElement(card_1.CardHeader, null,
                                React.createElement(card_1.CardTitle, null, "SEO & Final Settings"),
                                React.createElement(card_1.CardDescription, null, "Optimize for search engines and publish")),
                            React.createElement(card_1.CardContent, { className: "space-y-6" },
                                React.createElement("div", { className: "space-y-2" },
                                    React.createElement(label_1.Label, { htmlFor: "meta-title" }, "Meta Title"),
                                    React.createElement(input_1.Input, { id: "meta-title", value: formData.metaTitle, onChange: function (e) { return handleInputChange("metaTitle", e.target.value); } }),
                                    React.createElement("p", { className: "text-xs text-slate-500" },
                                        formData.metaTitle.length,
                                        "/60 characters")),
                                React.createElement("div", { className: "space-y-2" },
                                    React.createElement(label_1.Label, { htmlFor: "meta-description" }, "Meta Description"),
                                    React.createElement(textarea_1.Textarea, { id: "meta-description", rows: 3, value: formData.metaDescription, onChange: function (e) { return handleInputChange("metaDescription", e.target.value); } }),
                                    React.createElement("p", { className: "text-xs text-slate-500" },
                                        formData.metaDescription.length,
                                        "/160 characters")),
                                React.createElement("div", { className: "grid gap-6 md:grid-cols-2" },
                                    React.createElement("div", { className: "space-y-2" },
                                        React.createElement(label_1.Label, { htmlFor: "keywords" }, "Keywords"),
                                        React.createElement(input_1.Input, { id: "keywords", value: formData.keywords, onChange: function (e) { return handleInputChange("keywords", e.target.value); } })),
                                    React.createElement("div", { className: "space-y-2" },
                                        React.createElement(label_1.Label, { htmlFor: "url-slug" }, "URL Slug"),
                                        React.createElement(input_1.Input, { id: "url-slug", value: formData.urlSlug, onChange: function (e) { return handleInputChange("urlSlug", e.target.value); } }))),
                                React.createElement("div", { className: "flex justify-end gap-3 pt-6 border-t" },
                                    React.createElement(button_1.Button, { variant: "outline", onClick: function () { return setActiveTab("media"); } }, "Back"),
                                    React.createElement(button_1.Button, { onClick: handlePublish, disabled: isSavingSEO, size: "lg", className: "bg-green-600" },
                                        isSavingSEO ? React.createElement(spinner_1.Spinner, { className: "mr-2" }) : React.createElement(lucide_react_1.CheckCircle, { className: "h-5 w-5 mr-2" }),
                                        "Publish Product")))))),
                React.createElement(dialog_1.Dialog, { open: showPreview, onOpenChange: setShowPreview },
                    React.createElement(dialog_1.DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto" },
                        React.createElement(dialog_1.DialogHeader, null,
                            React.createElement(dialog_1.DialogTitle, null, "Product Preview"),
                            React.createElement(dialog_1.DialogDescription, null, "Preview of your product as it will appear")),
                        React.createElement("div", { className: "space-y-8 py-6" },
                            React.createElement("div", { className: "space-y-4" },
                                React.createElement("h3", { className: "text-2xl font-bold" }, formData.name || "Untitled Product"),
                                React.createElement("p", { className: "text-3xl font-semibold text-green-600" },
                                    "$",
                                    formData.price || "0.00"),
                                React.createElement("p", { className: "text-sm text-slate-600" },
                                    "Category: ",
                                    getSelectedCategoryName()),
                                tags.length > 0 && (React.createElement("div", { className: "flex flex-wrap gap-2" }, tags.map(function (tag, i) { return (React.createElement(badge_1.Badge, { key: i, variant: "secondary" }, tag)); })))),
                            formData.description && (React.createElement("div", null,
                                React.createElement("h4", { className: "font-semibold mb-2" }, "Description"),
                                React.createElement("p", { className: "text-slate-700 whitespace-pre-wrap" }, formData.description))),
                            formData.videoUrl && (React.createElement("div", null,
                                React.createElement("h4", { className: "font-semibold mb-2" }, "Video"),
                                React.createElement("div", { className: "bg-slate-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center" },
                                    React.createElement("p", { className: "text-slate-500" },
                                        "Video: ",
                                        formData.videoUrl)))),
                            selectedImages.length > 0 && (React.createElement("div", null,
                                React.createElement("h4", { className: "font-semibold mb-4" },
                                    "Images (",
                                    selectedImages.length,
                                    ")"),
                                React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4" }, selectedImages.map(function (img, i) { return (React.createElement("div", { key: img.id, className: "relative aspect-square rounded-lg overflow-hidden border" },
                                    React.createElement("img", { src: img.url, alt: "Preview " + (i + 1), className: "w-full h-full object-cover" }),
                                    i === 0 && React.createElement(badge_1.Badge, { className: "absolute top-2 left-2" }, "Primary"))); })))),
                            pdfFiles.length > 0 && (React.createElement("div", null,
                                React.createElement("h4", { className: "font-semibold mb-2" },
                                    "PDF Documents (",
                                    pdfFiles.length,
                                    ")"),
                                React.createElement("div", { className: "space-y-2" }, pdfFiles.map(function (pdf) { return (React.createElement("div", { key: pdf.id, className: "flex items-center gap-3 p-3 bg-slate-50 rounded-lg" },
                                    React.createElement(lucide_react_1.FileText, { className: "h-6 w-6 text-red-600" }),
                                    React.createElement("span", { className: "font-medium" }, pdf.name))); })))),
                            (formData.metaTitle || formData.metaDescription) && (React.createElement("div", { className: "border-t pt-6" },
                                React.createElement("h4", { className: "font-semibold mb-4" }, "SEO Preview"),
                                React.createElement("div", { className: "space-y-2 text-sm" },
                                    React.createElement("p", null,
                                        React.createElement("strong", null, "Title:"),
                                        " ",
                                        formData.metaTitle || formData.name),
                                    React.createElement("p", null,
                                        React.createElement("strong", null, "Description:"),
                                        " ",
                                        formData.metaDescription || "No description"),
                                    React.createElement("p", null,
                                        React.createElement("strong", null, "Keywords:"),
                                        " ",
                                        formData.keywords || "None"),
                                    React.createElement("p", null,
                                        React.createElement("strong", null, "Slug:"),
                                        " /",
                                        formData.urlSlug || slugify(formData.name)))))),
                        React.createElement("div", { className: "flex justify-end" },
                            React.createElement(button_1.Button, { variant: "outline", onClick: function () { return setShowPreview(false); } }, "Close"))))))));
}
exports["default"] = NewProductPage;
