"use client";
"use strict";
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
exports.__esModule = true;
var react_1 = require("react");
var react_2 = require("swiper/react");
var modules_1 = require("swiper/modules");
require("swiper/css");
require("swiper/css/navigation");
require("swiper/css/pagination");
var axiosClient_1 = require("@/lib/axiosClient");
var DEFAULT_IMAGE = "https://lh3.googleusercontent.com/hzTpTV1Qwyi4crcaB_lEaRTg603ttzm_6Uw8SwBC-iQ9-PeWdFdNpejyPzFdVqWLBjf8o58sDjs8M9wV01MCyjJ3XX6GBIiUrLRiQi9ui8m0tp0";
function SliderThree(_a) {
    var _this = this;
    var productId = _a.productId;
    var _b = react_1.useState([]), images = _b[0], setImages = _b[1];
    var _c = react_1.useState(null), product = _c[0], setProduct = _c[1];
    var _d = react_1.useState(true), loading = _d[0], setLoading = _d[1];
    var _e = react_1.useState(null), error = _e[0], setError = _e[1];
    react_1.useEffect(function () {
        var fetchData = function () { return __awaiter(_this, void 0, void 0, function () {
            var productRes, productData, imagesRes, galleryImages, err_1, message;
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (!productId) {
                            setImages([{ id: 0, url: DEFAULT_IMAGE, position: 1 }]);
                            setProduct(null);
                            setLoading(false);
                            return [2 /*return*/];
                        }
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 4, 5, 6]);
                        setLoading(true);
                        setError(null);
                        return [4 /*yield*/, axiosClient_1["default"].get("/products/" + productId)];
                    case 2:
                        productRes = _g.sent();
                        if (!((_a = productRes.data) === null || _a === void 0 ? void 0 : _a.success) && !((_b = productRes.data) === null || _b === void 0 ? void 0 : _b.name)) {
                            // Some APIs return data directly, others wrap in { success, data }
                            throw new Error("Failed to load product details");
                        }
                        productData = productRes.data.data || productRes.data;
                        setProduct({
                            name: productData.name || "Untitled Product",
                            price: parseFloat(productData.price) || 0
                        });
                        return [4 /*yield*/, axiosClient_1["default"].get("/product-images", {
                                params: { product_id: productId }
                            })];
                    case 3:
                        imagesRes = _g.sent();
                        if (!((_c = imagesRes.data) === null || _c === void 0 ? void 0 : _c.success)) {
                            throw new Error(((_d = imagesRes.data) === null || _d === void 0 ? void 0 : _d.message) || "API returned success: false");
                        }
                        galleryImages = (imagesRes.data.data || [])
                            .filter(function (item) { var _a; return item.type === "gallery" && ((_a = item.url) === null || _a === void 0 ? void 0 : _a.trim()); })
                            .map(function (item) {
                            var _a;
                            return ({
                                id: item.id,
                                url: item.url.trim(),
                                position: (_a = item.position) !== null && _a !== void 0 ? _a : 999
                            });
                        })
                            .sort(function (a, b) { return a.position - b.position; });
                        setImages(galleryImages.length > 0
                            ? galleryImages
                            : [{ id: 0, url: DEFAULT_IMAGE, position: 1 }]);
                        return [3 /*break*/, 6];
                    case 4:
                        err_1 = _g.sent();
                        console.error("Error fetching data:", err_1);
                        message = ((_f = (_e = err_1.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.message) ||
                            err_1.message ||
                            "Failed to load product data";
                        setError(message);
                        setImages([{ id: 0, url: DEFAULT_IMAGE, position: 1 }]);
                        setProduct({ name: "Product Unavailable", price: 0 });
                        return [3 /*break*/, 6];
                    case 5:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        fetchData();
    }, [productId]);
    // Loading state
    if (loading) {
        return (react_1["default"].createElement("div", { className: "w-full max-w-[1200px] mx-auto aspect-square flex items-center justify-center bg-muted rounded-xl" },
            react_1["default"].createElement("p", { className: "text-muted-foreground" }, "Loading product...")));
    }
    // Error state
    if (error) {
        return (react_1["default"].createElement("div", { className: "w-full max-w-[1200px] mx-auto aspect-square flex items-center justify-center bg-destructive/10 rounded-xl" },
            react_1["default"].createElement("p", { className: "text-destructive" },
                "Error: ",
                error)));
    }
    var title = (product === null || product === void 0 ? void 0 : product.name) || "No Product Name";
    var subtitle = (product === null || product === void 0 ? void 0 : product.price) > 0 ? "$" + product.price.toFixed(2) : "";
    return (react_1["default"].createElement("div", { className: "card-header-slider" },
        react_1["default"].createElement(react_2.Swiper, { modules: [modules_1.Navigation, modules_1.Pagination, modules_1.Autoplay], spaceBetween: 20, slidesPerView: 1, navigation: true, pagination: { clickable: true }, autoplay: {
                delay: 2500,
                disableOnInteraction: false
            }, loop: images.length > 1 }, images.map(function (img) { return (react_1["default"].createElement(react_2.SwiperSlide, { key: img.id },
            react_1["default"].createElement("div", { className: "relative w-full  mx-auto aspect-square" },
                react_1["default"].createElement("img", { src: img.url, alt: title, className: "w-full h-full object-cover rounded-xl shadow-lg", loading: "lazy", onError: function (e) {
                        e.target.src = DEFAULT_IMAGE;
                    } }),
                (title || subtitle) && (react_1["default"].createElement("div", { className: "absolute bottom-6 left-1/2 -translate-x-1/2 text-white drop-shadow-lg text-center w-auto px-6 py-3 bg-black/50 backdrop-blur-sm rounded-xl" },
                    react_1["default"].createElement("h2", { className: "text-sl md:text-sl font-bold leading-tight" }, title),
                    subtitle && (react_1["default"].createElement("p", { className: "text-sl md:text-sl font-semibold mt-1" }, subtitle))))))); }))));
}
exports["default"] = SliderThree;
