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
var textarea_1 = require("@/components/ui/textarea");
var select_1 = require("@/components/ui/select");
var card_1 = require("@/components/ui/card");
var checkbox_1 = require("@/components/ui/checkbox");
var lucide_react_1 = require("lucide-react");
var link_1 = require("next/link");
var navigation_1 = require("next/navigation");
var axiosClient_1 = require("@/lib/axiosClient");
var showToast_1 = require("@/lib/showToast");
var core_1 = require("@dnd-kit/core");
var sortable_1 = require("@dnd-kit/sortable");
var sortable_2 = require("@dnd-kit/sortable");
var utilities_1 = require("@dnd-kit/utilities");
var LivePreview_1 = require("@/components/form-component/LivePreview");
var lucide_react_2 = require("lucide-react");
var fieldTypes = [
    { value: "text", label: "Text Input", icon: lucide_react_2.Type },
    { value: "textarea", label: "Textarea", icon: lucide_react_2.Type },
    { value: "email", label: "Email", icon: lucide_react_2.Mail },
    { value: "number", label: "Number", icon: lucide_react_2.Hash },
    { value: "phone", label: "Phone", icon: lucide_react_2.Phone },
    { value: "password", label: "Password", icon: lucide_react_2.Lock },
    { value: "date", label: "Date", icon: lucide_react_2.Calendar },
    { value: "time", label: "Time", icon: lucide_react_2.Clock },
    { value: "datetime", label: "Date & Time", icon: lucide_react_2.CalendarClock },
    { value: "select", label: "Dropdown", icon: lucide_react_1.ChevronDown },
    { value: "multi_select", label: "Multi-Select", icon: lucide_react_1.ChevronDown },
    { value: "radio", label: "Radio Group", icon: lucide_react_2.CheckSquare },
    { value: "checkbox", label: "Checkbox Group", icon: lucide_react_2.CheckSquare },
    { value: "toggle", label: "Toggle Switch", icon: lucide_react_2.ToggleLeft },
    { value: "file", label: "File Upload", icon: lucide_react_2.Upload },
    { value: "image", label: "Image Upload", icon: lucide_react_2.Image },
    { value: "url", label: "URL", icon: lucide_react_2.Link2 },
    { value: "rating", label: "Rating", icon: lucide_react_2.Star },
    { value: "range", label: "Range Slider", icon: lucide_react_2.SlidersHorizontal },
    { value: "color", label: "Color Picker", icon: lucide_react_2.Palette },
    { value: "hidden", label: "Hidden Field", icon: lucide_react_2.EyeOff },
];
function CreateFormPage() {
    var _this = this;
    var params = navigation_1.useParams();
    var router = navigation_1.useRouter();
    var formId = params === null || params === void 0 ? void 0 : params.id;
    var _a = React.useState(true), loading = _a[0], setLoading = _a[1];
    var _b = React.useState(false), saving = _b[0], setSaving = _b[1];
    var _c = React.useState({
        name: "",
        description: "",
        status: "draft",
        success_message: "Thank you for your submission! We'll get back to you soon.",
        redirect_url: "",
        send_notification: true,
        captcha: true,
        gdpr: false,
        auto_respond: true
    }), formData = _c[0], setFormData = _c[1];
    var _d = React.useState([]), sections = _d[0], setSections = _d[1];
    var sensors = core_1.useSensors(core_1.useSensor(core_1.PointerSensor), core_1.useSensor(core_1.KeyboardSensor, { coordinateGetter: sortable_1.sortableKeyboardCoordinates }));
    React.useEffect(function () {
        if (formId) {
            loadForm();
        }
        else {
            setSections([
                {
                    tempId: "main",
                    title: "Main Section",
                    order: 0,
                    fields: [
                        { tempId: "1", type: "text", label: "Full Name", required: true, placeholder: "John Doe", order: 0, rules: [], conditions: null },
                        { tempId: "2", type: "email", label: "Email Address", required: true, placeholder: "you@example.com", order: 1, rules: [], conditions: null },
                    ]
                },
            ]);
            setLoading(false);
        }
    }, [formId]);
    var loadForm = function () { return __awaiter(_this, void 0, void 0, function () {
        var res, data_1, sectionsRes, loadedSections, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, 5, 6]);
                    return [4 /*yield*/, axiosClient_1["default"].get("/forms/" + formId)];
                case 1:
                    res = _a.sent();
                    if (!res.data.success) return [3 /*break*/, 3];
                    data_1 = res.data.data;
                    setFormData(function (prev) { return (__assign(__assign({}, prev), { name: data_1.name || "", description: data_1.description || "", status: data_1.is_active ? "active" : "draft" })); });
                    return [4 /*yield*/, axiosClient_1["default"].get("/forms/" + formId + "/sections")];
                case 2:
                    sectionsRes = _a.sent();
                    if (sectionsRes.data.success && sectionsRes.data.data.length > 0) {
                        loadedSections = sectionsRes.data.data.map(function (sec, secIndex) {
                            var _a;
                            return ({
                                id: sec.id,
                                tempId: "sec-" + (sec.id || Date.now()),
                                title: sec.title || "Untitled Section",
                                order: (_a = sec.order) !== null && _a !== void 0 ? _a : secIndex,
                                collapsed: false,
                                fields: (sec.fields || []).map(function (f, fIndex) {
                                    var _a, _b, _c;
                                    return ({
                                        id: f.id,
                                        tempId: "field-" + (f.id || Date.now()) + "-" + Math.random(),
                                        type: f.type,
                                        label: f.label,
                                        required: f.is_required,
                                        key: f.key,
                                        placeholder: ((_a = f.options) === null || _a === void 0 ? void 0 : _a.placeholder) || "",
                                        options: ((_b = f.options) === null || _b === void 0 ? void 0 : _b.choices) || f.options || undefined,
                                        rules: f.rules || [],
                                        conditions: f.conditions || null,
                                        order: (_c = f.order) !== null && _c !== void 0 ? _c : fIndex
                                    });
                                })
                            });
                        });
                        loadedSections.sort(function (a, b) { return a.order - b.order; });
                        loadedSections.forEach(function (sec) { return sec.fields.sort(function (a, b) { return a.order - b.order; }); });
                        setSections(loadedSections);
                    }
                    _a.label = 3;
                case 3: return [3 /*break*/, 6];
                case 4:
                    err_1 = _a.sent();
                    showToast_1.showToast("Failed to load form", "error");
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var addSection = function () {
        var newSection = {
            tempId: Date.now().toString(),
            title: "New Section",
            order: sections.length,
            fields: [],
            collapsed: false
        };
        setSections(function (prev) { return __spreadArrays(prev, [newSection]); });
    };
    var updateSection = function (tempId, updates) {
        setSections(function (prev) { return prev.map(function (s) { return s.tempId === tempId ? __assign(__assign({}, s), updates) : s; }); });
    };
    var deleteSection = function (section) { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!section.id) return [3 /*break*/, 4];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axiosClient_1["default"]["delete"]("/sections/" + section.id)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    showToast_1.showToast("Failed to delete section from server", "error");
                    return [3 /*break*/, 4];
                case 4:
                    setSections(function (prev) { return prev.filter(function (s) { return s.tempId !== section.tempId; }); });
                    return [2 /*return*/];
            }
        });
    }); };
    var addField = function (sectionTempId, type) {
        if (type === void 0) { type = "text"; }
        var section = sections.find(function (s) { return s.tempId === sectionTempId; });
        if (!section)
            return;
        var newField = {
            tempId: Date.now().toString(),
            type: type,
            label: "New Field",
            required: false,
            placeholder: ["text", "textarea", "email", "url", "password", "number", "phone", "date", "time", "datetime"].includes(type) ? "" : undefined,
            options: ["select", "multi_select", "radio", "checkbox"].includes(type)
                ? [{ label: "Option 1", value: "option1" }]
                : ["rating", "range", "file", "image"].includes(type) ? {} : undefined,
            rules: [],
            conditions: null,
            order: section.fields.length
        };
        setSections(function (prev) {
            return prev.map(function (s) {
                return s.tempId === sectionTempId
                    ? __assign(__assign({}, s), { fields: __spreadArrays(s.fields, [newField]) }) : s;
            });
        });
    };
    var updateField = function (sectionTempId, fieldTempId, updates) {
        setSections(function (prev) {
            return prev.map(function (s) {
                return s.tempId === sectionTempId
                    ? __assign(__assign({}, s), { fields: s.fields.map(function (f) { return f.tempId === fieldTempId ? __assign(__assign({}, f), updates) : f; }) }) : s;
            });
        });
    };
    var removeField = function (sectionTempId, fieldTempId) {
        setSections(function (prev) {
            return prev.map(function (s) {
                return s.tempId === sectionTempId
                    ? __assign(__assign({}, s), { fields: s.fields.filter(function (f) { return f.tempId !== fieldTempId; }) }) : s;
            });
        });
    };
    var generateKey = function (label) {
        return label
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^a-z0-9_]/g, "");
    };
    var handleDragEnd = function (event) {
        var active = event.active, over = event.over;
        if (!over || active.id === over.id)
            return;
        var activeId = active.id;
        var overId = over.id;
        if (activeId.startsWith("section-")) {
            var activeIndex = sections.findIndex(function (s) { return s.tempId === activeId.replace("section-", ""); });
            var overIndex = sections.findIndex(function (s) { return s.tempId === overId.replace("section-", ""); });
            if (activeIndex !== -1 && overIndex !== -1) {
                setSections(sortable_1.arrayMove(sections, activeIndex, overIndex).map(function (s, idx) { return (__assign(__assign({}, s), { order: idx })); }));
            }
        }
        else {
            // Field drag (same section only in this version)
            var fromSection_1;
            var fromIndex = -1;
            var toSection = void 0;
            var toIndex = -1;
            for (var _i = 0, sections_1 = sections; _i < sections_1.length; _i++) {
                var sec = sections_1[_i];
                var fIdx = sec.fields.findIndex(function (f) { return f.tempId === activeId; });
                if (fIdx !== -1) {
                    fromSection_1 = sec;
                    fromIndex = fIdx;
                }
                var tIdx = sec.fields.findIndex(function (f) { return f.tempId === overId; });
                if (tIdx !== -1) {
                    toSection = sec;
                    toIndex = tIdx;
                }
            }
            if (fromSection_1 && toSection && fromSection_1.tempId === toSection.tempId) {
                var newFields_1 = sortable_1.arrayMove(fromSection_1.fields, fromIndex, toIndex);
                setSections(function (prev) {
                    return prev.map(function (s) {
                        return s.tempId === fromSection_1.tempId
                            ? __assign(__assign({}, s), { fields: newFields_1.map(function (f, i) { return (__assign(__assign({}, f), { order: i })); }) }) : s;
                    });
                });
            }
        }
    };
    var saveForm = function (publish) {
        if (publish === void 0) { publish = false; }
        return __awaiter(_this, void 0, void 0, function () {
            var savedFormId, formPayload, res, _i, sections_2, section, sectionId, res, _a, _b, field, fieldPayload, err_2;
            var _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!formData.name.trim()) {
                            showToast_1.showToast("Form name is required", "error");
                            return [2 /*return*/];
                        }
                        setSaving(true);
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 18, 19, 20]);
                        savedFormId = formId;
                        formPayload = {
                            name: formData.name,
                            description: formData.description || null,
                            is_active: publish || formData.status === "active"
                        };
                        if (!formId) return [3 /*break*/, 3];
                        return [4 /*yield*/, axiosClient_1["default"].put("/forms/" + formId, formPayload)];
                    case 2:
                        _e.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, axiosClient_1["default"].post("/forms", formPayload)];
                    case 4:
                        res = _e.sent();
                        savedFormId = res.data.data.id;
                        router.replace("/forms/" + savedFormId + "/edit");
                        _e.label = 5;
                    case 5:
                        _i = 0, sections_2 = sections;
                        _e.label = 6;
                    case 6:
                        if (!(_i < sections_2.length)) return [3 /*break*/, 17];
                        section = sections_2[_i];
                        sectionId = section.id;
                        if (!!sectionId) return [3 /*break*/, 8];
                        return [4 /*yield*/, axiosClient_1["default"].post("/forms/" + savedFormId + "/sections", {
                                title: section.title,
                                order: section.order
                            })];
                    case 7:
                        res = _e.sent();
                        sectionId = res.data.data.id;
                        return [3 /*break*/, 10];
                    case 8: return [4 /*yield*/, axiosClient_1["default"].put("/sections/" + sectionId, {
                            title: section.title,
                            order: section.order
                        })];
                    case 9:
                        _e.sent();
                        _e.label = 10;
                    case 10:
                        _a = 0, _b = section.fields;
                        _e.label = 11;
                    case 11:
                        if (!(_a < _b.length)) return [3 /*break*/, 16];
                        field = _b[_a];
                        fieldPayload = {
                            form_section_id: sectionId,
                            label: field.label,
                            key: field.key || generateKey(field.label),
                            type: field.type,
                            options: ["select", "multi_select", "radio", "checkbox"].includes(field.type)
                                ? { choices: field.options || [] }
                                : field.options || { placeholder: field.placeholder || "" },
                            rules: field.rules || [],
                            conditions: field.conditions,
                            is_required: field.required,
                            is_active: true,
                            order: field.order
                        };
                        if (!field.id) return [3 /*break*/, 13];
                        return [4 /*yield*/, axiosClient_1["default"].put("/fields/" + field.id, fieldPayload)];
                    case 12:
                        _e.sent();
                        return [3 /*break*/, 15];
                    case 13: return [4 /*yield*/, axiosClient_1["default"].post("/forms/" + savedFormId + "/fields", fieldPayload)];
                    case 14:
                        _e.sent();
                        _e.label = 15;
                    case 15:
                        _a++;
                        return [3 /*break*/, 11];
                    case 16:
                        _i++;
                        return [3 /*break*/, 6];
                    case 17:
                        showToast_1.showToast(publish ? "Form published!" : "Form saved as draft", "success");
                        return [3 /*break*/, 20];
                    case 18:
                        err_2 = _e.sent();
                        console.error(err_2);
                        showToast_1.showToast(((_d = (_c = err_2.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) || "Failed to save form", "error");
                        return [3 /*break*/, 20];
                    case 19:
                        setSaving(false);
                        return [7 /*endfinally*/];
                    case 20: return [2 /*return*/];
                }
            });
        });
    };
    if (loading) {
        return React.createElement(layout_1.DashboardLayout, null,
            React.createElement("div", { className: "p-8 text-center" }, "Loading..."));
    }
    return (React.createElement(layout_1.DashboardLayout, null,
        React.createElement("div", { className: "space-y-6" },
            React.createElement(Header, { formId: formId, saving: saving, onSaveDraft: function () { return saveForm(false); }, onPublish: function () { return saveForm(true); } }),
            React.createElement("div", { className: "grid gap-6 lg:grid-cols-3" },
                React.createElement("div", { className: "lg:col-span-2 space-y-6" },
                    React.createElement(FormDetails, { formData: formData, setFormData: setFormData }),
                    React.createElement(SectionsEditor, { sections: sections, setSections: setSections, sensors: sensors, handleDragEnd: handleDragEnd, addSection: addSection, updateSection: updateSection, deleteSection: deleteSection, addField: addField, updateField: updateField, removeField: removeField }),
                    React.createElement(SuccessSettings, { formData: formData, setFormData: setFormData })),
                React.createElement(LivePreview_1["default"], { formData: formData, sections: sections })))));
}
exports["default"] = CreateFormPage;
// ──────────────────────────────────────────────
// Header, FormDetails, SuccessSettings (unchanged)
// ──────────────────────────────────────────────
function Header(_a) {
    var formId = _a.formId, saving = _a.saving, onSaveDraft = _a.onSaveDraft, onPublish = _a.onPublish;
    return (React.createElement("div", { className: "flex items-center justify-between" },
        React.createElement("div", { className: "flex items-center gap-4" },
            React.createElement(link_1["default"], { href: "/forms" },
                React.createElement(button_1.Button, { variant: "ghost", size: "icon" },
                    React.createElement(lucide_react_1.ArrowLeft, { className: "h-5 w-5" }))),
            React.createElement("div", null,
                React.createElement("h1", { className: "text-3xl font-bold" }, formId ? "Edit Form" : "Create Form"),
                React.createElement("p", { className: "text-sm text-muted-foreground mt-1" }, "Design a custom form with sections and ordering"))),
        React.createElement("div", { className: "flex gap-2" },
            React.createElement(button_1.Button, { variant: "outline", onClick: onSaveDraft, disabled: saving },
                React.createElement(lucide_react_1.Save, { className: "h-4 w-4 mr-2" }),
                " Save Draft"),
            React.createElement(button_1.Button, { variant: "outline" },
                React.createElement(lucide_react_1.Eye, { className: "h-4 w-4 mr-2" }),
                " Preview"),
            React.createElement(button_1.Button, { onClick: onPublish, disabled: saving },
                React.createElement(lucide_react_1.Check, { className: "h-4 w-4 mr-2" }),
                formId ? "Update & Publish" : "Publish Form"))));
}
function FormDetails(_a) {
    var formData = _a.formData, setFormData = _a.setFormData;
    return (React.createElement(card_1.Card, null,
        React.createElement(card_1.CardHeader, null,
            React.createElement(card_1.CardTitle, null, "Form Details")),
        React.createElement(card_1.CardContent, { className: "space-y-4" },
            React.createElement("div", { className: "space-y-2" },
                React.createElement(label_1.Label, null, "Form Name"),
                React.createElement(input_1.Input, { value: formData.name, onChange: function (e) { return setFormData(function (p) { return (__assign(__assign({}, p), { name: e.target.value })); }); }, placeholder: "e.g., Contact Form" })),
            React.createElement("div", { className: "space-y-2" },
                React.createElement(label_1.Label, null, "Description"),
                React.createElement(textarea_1.Textarea, { value: formData.description, onChange: function (e) { return setFormData(function (p) { return (__assign(__assign({}, p), { description: e.target.value })); }); }, rows: 3 })))));
}
function SuccessSettings(_a) {
    var formData = _a.formData, setFormData = _a.setFormData;
    return (React.createElement(card_1.Card, null,
        React.createElement(card_1.CardHeader, null,
            React.createElement(card_1.CardTitle, null, "Success Settings")),
        React.createElement(card_1.CardContent, { className: "space-y-6" },
            React.createElement("div", { className: "space-y-2" },
                React.createElement(label_1.Label, null, "Success Message"),
                React.createElement(textarea_1.Textarea, { value: formData.success_message, onChange: function (e) { return setFormData(function (p) { return (__assign(__assign({}, p), { success_message: e.target.value })); }); }, rows: 3 })),
            React.createElement("div", { className: "space-y-2" },
                React.createElement(label_1.Label, null, "Redirect URL (Optional)"),
                React.createElement(input_1.Input, { type: "url", value: formData.redirect_url, onChange: function (e) { return setFormData(function (p) { return (__assign(__assign({}, p), { redirect_url: e.target.value })); }); } })))));
}
// ──────────────────────────────────────────────
// SectionsEditor + SortableSection (minor changes)
// ──────────────────────────────────────────────
function SectionsEditor(props) {
    var sections = props.sections, setSections = props.setSections, sensors = props.sensors, handleDragEnd = props.handleDragEnd, addSection = props.addSection, updateSection = props.updateSection, deleteSection = props.deleteSection, addField = props.addField, updateField = props.updateField, removeField = props.removeField;
    return (React.createElement(card_1.Card, null,
        React.createElement(card_1.CardHeader, null,
            React.createElement("div", { className: "flex items-center justify-between" },
                React.createElement("div", null,
                    React.createElement(card_1.CardTitle, null, "Form Sections & Fields"),
                    React.createElement(card_1.CardDescription, null, "Organize your form into sections")),
                React.createElement(button_1.Button, { onClick: addSection, size: "sm" },
                    React.createElement(lucide_react_1.Plus, { className: "h-4 w-4 mr-2" }),
                    " Add Section"))),
        React.createElement(card_1.CardContent, null,
            React.createElement(core_1.DndContext, { sensors: sensors, collisionDetection: core_1.closestCenter, onDragEnd: handleDragEnd },
                React.createElement(sortable_1.SortableContext, { items: sections.map(function (s) { return "section-" + s.tempId; }), strategy: sortable_1.verticalListSortingStrategy }, sections.map(function (section) { return (React.createElement(SortableSection, { key: section.tempId, section: section, updateSection: updateSection, deleteSection: deleteSection, addField: addField, updateField: updateField, removeField: removeField })); }))),
            sections.length === 0 && (React.createElement("div", { className: "text-center py-8 text-muted-foreground" }, "No sections yet. Add one to start building your form.")))));
}
function SortableSection(_a) {
    var section = _a.section, updateSection = _a.updateSection, deleteSection = _a.deleteSection, addField = _a.addField, updateField = _a.updateField, removeField = _a.removeField;
    var _b = sortable_2.useSortable({ id: "section-" + section.tempId }), attributes = _b.attributes, listeners = _b.listeners, setNodeRef = _b.setNodeRef, transform = _b.transform, transition = _b.transition, isDragging = _b.isDragging;
    var style = {
        transform: utilities_1.CSS.Transform.toString(transform),
        transition: transition,
        opacity: isDragging ? 0.6 : 1
    };
    return (React.createElement("div", { ref: setNodeRef, style: style, className: "mb-4 border border-gray-300 rounded-md bg-[#f5f5f5] shadow-sm" },
        React.createElement("div", { className: "flex items-center gap-2 px-3 py-2 border-b bg-[#eaeaea] rounded-t-md" },
            React.createElement("div", __assign({}, attributes, listeners, { className: "cursor-move text-gray-500 hover:text-gray-700" }),
                React.createElement(lucide_react_1.GripVertical, { className: "h-4 w-4" })),
            React.createElement(input_1.Input, { value: section.title, onChange: function (e) {
                    return updateSection(section.tempId, { title: e.target.value });
                }, placeholder: "Section title", className: "h-7 text-sm font-medium bg-white border-gray-300 focus:ring-0 focus:border-blue-500" }),
            React.createElement("div", { className: "flex gap-1 ml-auto" },
                React.createElement(button_1.Button, { variant: "ghost", size: "icon", className: "h-7 w-7", onClick: function () {
                        return updateSection(section.tempId, {
                            collapsed: !section.collapsed
                        });
                    } }, section.collapsed ? (React.createElement(lucide_react_1.ChevronDown, { className: "h-4 w-4" })) : (React.createElement(lucide_react_1.ChevronUp, { className: "h-4 w-4" }))),
                React.createElement(button_1.Button, { variant: "ghost", size: "icon", className: "h-7 w-7 text-red-600 hover:bg-red-100", onClick: function () { return deleteSection(section); } },
                    React.createElement(lucide_react_1.Trash2, { className: "h-4 w-4" })))),
        !section.collapsed && (React.createElement("div", { className: "p-3 bg-[#fafafa]" },
            React.createElement(sortable_1.SortableContext, { items: section.fields.map(function (f) { return f.tempId; }), strategy: sortable_1.verticalListSortingStrategy },
                React.createElement("div", { className: "space-y-2 pl-4 border-l border-gray-300" }, section.fields.map(function (field) { return (React.createElement(SortableField, { key: field.tempId, sectionTempId: section.tempId, field: field, updateField: updateField, removeField: removeField })); }))),
            React.createElement("div", { className: "mt-3" },
                React.createElement(select_1.Select, { onValueChange: function (type) { return addField(section.tempId, type); } },
                    React.createElement(select_1.SelectTrigger, { className: "h-8 text-sm bg-white border-gray-300" },
                        React.createElement(select_1.SelectValue, { placeholder: "+ Add field" })),
                    React.createElement(select_1.SelectContent, null, fieldTypes.map(function (type) {
                        var Icon = type.icon;
                        return (React.createElement(select_1.SelectItem, { key: type.value, value: type.value },
                            React.createElement("div", { className: "flex items-center gap-2" },
                                React.createElement(Icon, { className: "h-4 w-4" }),
                                type.label)));
                    }))))))));
}
// ──────────────────────────────────────────────
// SortableField – now with Rules & Conditions
// ──────────────────────────────────────────────
function SortableField(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j;
    var sectionTempId = _a.sectionTempId, field = _a.field, updateField = _a.updateField, removeField = _a.removeField;
    var _k = sortable_2.useSortable({ id: field.tempId }), attributes = _k.attributes, listeners = _k.listeners, setNodeRef = _k.setNodeRef, transform = _k.transform, transition = _k.transition;
    var style = { transform: utilities_1.CSS.Transform.toString(transform), transition: transition };
    var addRule = function () {
        var newRule = { type: "min_length", value: 0, message: "" };
        updateField(sectionTempId, field.tempId, { rules: __spreadArrays((field.rules || []), [newRule]) });
    };
    var updateRule = function (index, updates) {
        var newRules = __spreadArrays((field.rules || []));
        newRules[index] = __assign(__assign({}, newRules[index]), updates);
        updateField(sectionTempId, field.tempId, { rules: newRules });
    };
    var removeRule = function (index) {
        var newRules = (field.rules || []).filter(function (_, i) { return i !== index; });
        updateField(sectionTempId, field.tempId, { rules: newRules });
    };
    var addCondition = function () {
        var newCond = { fieldKey: "", operator: "equals", value: "", action: "show" };
        var current = field.conditions || [];
        updateField(sectionTempId, field.tempId, { conditions: __spreadArrays(current, [newCond]) });
    };
    var updateCondition = function (index, updates) {
        var conds = __spreadArrays((field.conditions || []));
        conds[index] = __assign(__assign({}, conds[index]), updates);
        updateField(sectionTempId, field.tempId, { conditions: conds });
    };
    var removeCondition = function (index) {
        var conds = (field.conditions || []).filter(function (_, i) { return i !== index; });
        updateField(sectionTempId, field.tempId, { conditions: conds.length ? conds : null });
    };
    return (React.createElement("div", { ref: setNodeRef, style: style, className: "flex items-start gap-3 rounded-lg border bg-secondary/30 p-4" },
        React.createElement("div", __assign({}, attributes, listeners, { className: "cursor-move mt-2" }),
            React.createElement(lucide_react_1.GripVertical, { className: "h-5 w-5 text-muted-foreground" })),
        React.createElement("div", { className: "flex-1 space-y-5" },
            React.createElement("div", { className: "grid gap-4 sm:grid-cols-2" },
                React.createElement("div", { className: "space-y-2" },
                    React.createElement(label_1.Label, { className: "text-sm" }, "Field Type"),
                    React.createElement(select_1.Select, { value: field.type, onValueChange: function (v) {
                            var updates = { type: v };
                            if (["select", "multi_select", "radio", "checkbox"].includes(v)) {
                                updates.options = field.options || [{ label: "Option 1", value: "option1" }];
                            }
                            else if (["rating", "range"].includes(v)) {
                                updates.options = field.options || {};
                            }
                            updateField(sectionTempId, field.tempId, updates);
                        } },
                        React.createElement(select_1.SelectTrigger, null,
                            React.createElement(select_1.SelectValue, null)),
                        React.createElement(select_1.SelectContent, null, fieldTypes.map(function (t) {
                            var Icon = t.icon;
                            return (React.createElement(select_1.SelectItem, { key: t.value, value: t.value },
                                React.createElement("div", { className: "flex items-center gap-2" },
                                    React.createElement(Icon, { className: "h-4 w-4" }),
                                    " ",
                                    t.label)));
                        })))),
                React.createElement("div", { className: "space-y-2" },
                    React.createElement(label_1.Label, { className: "text-sm" }, "Field Label"),
                    React.createElement(input_1.Input, { value: field.label, onChange: function (e) { return updateField(sectionTempId, field.tempId, { label: e.target.value }); } }))),
            ["text", "textarea", "email", "url", "password", "number", "phone", "date", "time", "datetime"].includes(field.type) && (React.createElement("div", { className: "space-y-2" },
                React.createElement(label_1.Label, { className: "text-sm" }, "Placeholder"),
                React.createElement(input_1.Input, { value: field.placeholder || "", onChange: function (e) { return updateField(sectionTempId, field.tempId, { placeholder: e.target.value }); } }))),
            ["select", "multi_select", "radio", "checkbox"].includes(field.type) && (React.createElement("div", { className: "space-y-2" },
                React.createElement(label_1.Label, { className: "text-sm" }, "Options"),
                React.createElement("div", { className: "space-y-2" },
                    (field.options || []).map(function (opt, idx) { return (React.createElement("div", { key: idx, className: "flex gap-2 items-center" },
                        React.createElement(input_1.Input, { value: opt.label, onChange: function (e) {
                                var newOpts = __spreadArrays(field.options);
                                newOpts[idx] = {
                                    label: e.target.value,
                                    value: e.target.value.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")
                                };
                                updateField(sectionTempId, field.tempId, { options: newOpts });
                            }, placeholder: "Option label" }),
                        React.createElement(button_1.Button, { variant: "ghost", size: "icon", onClick: function () {
                                var newOpts = field.options.filter(function (_, i) { return i !== idx; });
                                updateField(sectionTempId, field.tempId, { options: newOpts });
                            } },
                            React.createElement(lucide_react_1.Trash2, { className: "h-4 w-4" })))); }),
                    React.createElement(button_1.Button, { variant: "outline", size: "sm", onClick: function () {
                            var newOpts = __spreadArrays((field.options || []), [{ label: "New Option", value: "opt_" + Date.now() }]);
                            updateField(sectionTempId, field.tempId, { options: newOpts });
                        } },
                        React.createElement(lucide_react_1.Plus, { className: "h-4 w-4 mr-1" }),
                        " Add Option")))),
            field.type === "rating" && (React.createElement("div", { className: "grid gap-4 sm:grid-cols-3" },
                React.createElement("div", { className: "space-y-2" },
                    React.createElement(label_1.Label, { className: "text-sm" }, "Min"),
                    React.createElement(input_1.Input, { type: "number", value: (_c = (_b = field.options) === null || _b === void 0 ? void 0 : _b.min) !== null && _c !== void 0 ? _c : 1, onChange: function (e) { return updateField(sectionTempId, field.tempId, { options: __assign(__assign({}, field.options), { min: Number(e.target.value) }) }); } })),
                React.createElement("div", { className: "space-y-2" },
                    React.createElement(label_1.Label, { className: "text-sm" }, "Max"),
                    React.createElement(input_1.Input, { type: "number", value: (_e = (_d = field.options) === null || _d === void 0 ? void 0 : _d.max) !== null && _e !== void 0 ? _e : 5, onChange: function (e) { return updateField(sectionTempId, field.tempId, { options: __assign(__assign({}, field.options), { max: Number(e.target.value) }) }); } })))),
            ["range", "file", "image"].includes(field.type) && (React.createElement("div", { className: "grid gap-4 sm:grid-cols-3" },
                React.createElement("div", { className: "space-y-2" },
                    React.createElement(label_1.Label, { className: "text-sm" },
                        "Min ",
                        field.type === "range" ? "Value" : "Size (KB)"),
                    React.createElement(input_1.Input, { type: "number", value: (_g = (_f = field.options) === null || _f === void 0 ? void 0 : _f.min) !== null && _g !== void 0 ? _g : (field.type === "range" ? 0 : undefined), onChange: function (e) { return updateField(sectionTempId, field.tempId, { options: __assign(__assign({}, field.options), { min: Number(e.target.value) }) }); } })),
                React.createElement("div", { className: "space-y-2" },
                    React.createElement(label_1.Label, { className: "text-sm" },
                        "Max ",
                        field.type === "range" ? "Value" : "Size (KB)"),
                    React.createElement(input_1.Input, { type: "number", value: (_j = (_h = field.options) === null || _h === void 0 ? void 0 : _h.max) !== null && _j !== void 0 ? _j : (field.type === "range" ? 100 : 2048), onChange: function (e) { return updateField(sectionTempId, field.tempId, { options: __assign(__assign({}, field.options), { max: Number(e.target.value) }) }); } })))),
            React.createElement("div", { className: "flex items-center gap-6" },
                React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement(checkbox_1.Checkbox, { checked: field.required, onCheckedChange: function (c) { return updateField(sectionTempId, field.tempId, { required: !!c }); } }),
                    React.createElement(label_1.Label, { className: "text-sm font-normal" }, "Required field"))),
            React.createElement("div", { className: "space-y-3 border-t pt-4" },
                React.createElement("div", { className: "flex items-center justify-between" },
                    React.createElement(label_1.Label, { className: "text-base font-medium" }, "Validation Rules"),
                    React.createElement(button_1.Button, { variant: "outline", size: "sm", onClick: addRule },
                        React.createElement(lucide_react_1.Plus, { className: "h-3.5 w-3.5 mr-1" }),
                        " Add Rule")),
                (field.rules || []).length === 0 && (React.createElement("p", { className: "text-sm text-muted-foreground italic" }, "No validation rules yet")),
                (field.rules || []).map(function (rule, idx) {
                    var _a, _b;
                    return (React.createElement("div", { key: idx, className: "flex gap-3 items-start bg-background/50 p-3 rounded border" },
                        React.createElement(select_1.Select, { value: rule.type, onValueChange: function (v) { return updateRule(idx, { type: v }); } },
                            React.createElement(select_1.SelectTrigger, { className: "w-44" },
                                React.createElement(select_1.SelectValue, null)),
                            React.createElement(select_1.SelectContent, null,
                                React.createElement(select_1.SelectItem, { value: "min_length" }, "Min Length"),
                                React.createElement(select_1.SelectItem, { value: "max_length" }, "Max Length"),
                                React.createElement(select_1.SelectItem, { value: "min" }, "Min Value"),
                                React.createElement(select_1.SelectItem, { value: "max" }, "Max Value"),
                                React.createElement(select_1.SelectItem, { value: "regex" }, "Regex Pattern"),
                                React.createElement(select_1.SelectItem, { value: "file_size" }, "Max File Size (KB)"),
                                React.createElement(select_1.SelectItem, { value: "allowed_types" }, "Allowed File Types"))),
                        React.createElement(input_1.Input, { placeholder: "Value / Pattern", value: (_a = rule.value) !== null && _a !== void 0 ? _a : "", onChange: function (e) { return updateRule(idx, { value: e.target.value }); }, className: "flex-1" }),
                        React.createElement(input_1.Input, { placeholder: "Error message (optional)", value: (_b = rule.message) !== null && _b !== void 0 ? _b : "", onChange: function (e) { return updateRule(idx, { message: e.target.value }); }, className: "flex-1" }),
                        React.createElement(button_1.Button, { variant: "ghost", size: "icon", onClick: function () { return removeRule(idx); } }, "x")));
                })),
            React.createElement("div", { className: "space-y-3 border-t pt-4" },
                React.createElement("div", { className: "flex items-center justify-between" },
                    React.createElement(label_1.Label, { className: "text-base font-medium" }, "Visibility Conditions"),
                    React.createElement(button_1.Button, { variant: "outline", size: "sm", onClick: addCondition },
                        React.createElement(lucide_react_1.Plus, { className: "h-3.5 w-3.5 mr-1" }),
                        " Add Condition")),
                !field.conditions && (React.createElement("p", { className: "text-sm text-muted-foreground italic" }, "No visibility conditions")),
                (field.conditions || []).map(function (cond, idx) { return (React.createElement("div", { key: idx, className: "flex gap-2 items-center bg-background/50 p-3 rounded border" },
                    React.createElement(input_1.Input, { placeholder: "Field key to watch", value: cond.fieldKey, onChange: function (e) { return updateCondition(idx, { fieldKey: e.target.value }); }, className: "w-44" }),
                    React.createElement(select_1.Select, { value: cond.operator, onValueChange: function (v) { return updateCondition(idx, { operator: v }); } },
                        React.createElement(select_1.SelectTrigger, { className: "w-36" },
                            React.createElement(select_1.SelectValue, null)),
                        React.createElement(select_1.SelectContent, null,
                            React.createElement(select_1.SelectItem, { value: "equals" }, "equals"),
                            React.createElement(select_1.SelectItem, { value: "not_equals" }, "not equals"),
                            React.createElement(select_1.SelectItem, { value: "contains" }, "contains"),
                            React.createElement(select_1.SelectItem, { value: "greater_than" }, "greater than"),
                            React.createElement(select_1.SelectItem, { value: "less_than" }, "less than"))),
                    React.createElement(input_1.Input, { placeholder: "Value", value: cond.value, onChange: function (e) { return updateCondition(idx, { value: e.target.value }); }, className: "flex-1" }),
                    React.createElement(select_1.Select, { value: cond.action, onValueChange: function (v) { return updateCondition(idx, { action: v }); } },
                        React.createElement(select_1.SelectTrigger, { className: "w-28" },
                            React.createElement(select_1.SelectValue, null)),
                        React.createElement(select_1.SelectContent, null,
                            React.createElement(select_1.SelectItem, { value: "show" }, "Show"),
                            React.createElement(select_1.SelectItem, { value: "hide" }, "Hide"))),
                    React.createElement(button_1.Button, { variant: "ghost", size: "icon", onClick: function () { return removeCondition(idx); } }, "x"))); }))),
        React.createElement(button_1.Button, { variant: "ghost", size: "icon", onClick: function () { return removeField(sectionTempId, field.tempId); }, className: "text-destructive mt-2" },
            React.createElement(lucide_react_1.Trash2, { className: "h-4 w-4" }))));
}
