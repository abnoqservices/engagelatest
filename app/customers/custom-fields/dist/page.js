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
var core_1 = require("@dnd-kit/core");
var sortable_1 = require("@dnd-kit/sortable");
var utilities_1 = require("@dnd-kit/utilities");
var layout_1 = require("@/components/dashboard/layout");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var select_1 = require("@/components/ui/select");
var card_1 = require("@/components/ui/card");
var switch_1 = require("@/components/ui/switch");
var lucide_react_1 = require("lucide-react");
var spinner_1 = require("@/components/ui/spinner");
var axiosClient_1 = require("@/lib/axiosClient");
var showToast_1 = require("@/lib/showToast");
function SortableFieldItem(_a) {
    var field = _a.field, updateField = _a.updateField, saveField = _a.saveField, deleteField = _a.deleteField, savingIds = _a.savingIds;
    var _b = sortable_1.useSortable({ id: field.id }), attributes = _b.attributes, listeners = _b.listeners, setNodeRef = _b.setNodeRef, setActivatorNodeRef = _b.setActivatorNodeRef, transform = _b.transform, transition = _b.transition, isDragging = _b.isDragging;
    var style = {
        transform: utilities_1.CSS.Transform.toString(transform),
        transition: transition,
        opacity: isDragging ? 0.7 : 1
    };
    return (React.createElement("div", { ref: setNodeRef, style: style, className: "rounded-xl border bg-card/50 p-5 shadow-sm transition-all hover:shadow " + (isDragging ? "ring-2 ring-primary z-10" : "") },
        React.createElement("div", { className: "flex flex-col gap-6 sm:flex-row sm:items-start" },
            React.createElement("div", __assign({ ref: setActivatorNodeRef }, attributes, listeners, { className: "hidden cursor-grab items-center pt-3 sm:flex touch-none" }),
                React.createElement(lucide_react_1.GripVertical, { className: "h-6 w-6 text-muted-foreground/70 hover:text-foreground" })),
            React.createElement("div", { className: "mb-4 flex items-center justify-between sm:hidden" },
                React.createElement("div", { className: "flex items-center gap-2 text-muted-foreground" },
                    React.createElement(lucide_react_1.GripVertical, { className: "h-5 w-5" }),
                    React.createElement("span", { className: "text-sm" }, "Drag to reorder"))),
            React.createElement("div", { className: "flex-1 grid gap-5 sm:grid-cols-2 lg:grid-cols-12" },
                React.createElement("div", { className: "space-y-2 lg:col-span-3" },
                    React.createElement(label_1.Label, { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground" }, "Key (unique)"),
                    React.createElement(input_1.Input, { value: field.key, onChange: function (e) { return updateField(field.id, { key: e.target.value }); }, placeholder: "e.g. preferred_contact_method", disabled: !field.isNew, className: !field.isNew ? "bg-muted/50" : "" })),
                React.createElement("div", { className: "space-y-2 lg:col-span-3" },
                    React.createElement(label_1.Label, { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground" }, "Label"),
                    React.createElement(input_1.Input, { value: field.label, onChange: function (e) { return updateField(field.id, { label: e.target.value }); }, placeholder: "e.g. Preferred Contact Method" })),
                React.createElement("div", { className: "space-y-2 lg:col-span-3" },
                    React.createElement(label_1.Label, { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground" }, "Type"),
                    React.createElement(select_1.Select, { value: field.type, onValueChange: function (v) { return updateField(field.id, { type: v }); }, disabled: !field.isNew },
                        React.createElement(select_1.SelectTrigger, null,
                            React.createElement(select_1.SelectValue, { placeholder: "Select type" })),
                        React.createElement(select_1.SelectContent, null,
                            React.createElement(select_1.SelectItem, { value: "text" }, "Text"),
                            React.createElement(select_1.SelectItem, { value: "textarea" }, "Textarea"),
                            React.createElement(select_1.SelectItem, { value: "number" }, "Number"),
                            React.createElement(select_1.SelectItem, { value: "email" }, "Email"),
                            React.createElement(select_1.SelectItem, { value: "phone" }, "Phone"),
                            React.createElement(select_1.SelectItem, { value: "date" }, "Date"),
                            React.createElement(select_1.SelectItem, { value: "select" }, "Select"),
                            React.createElement(select_1.SelectItem, { value: "multi_select" }, "Multi Select"),
                            React.createElement(select_1.SelectItem, { value: "checkbox" }, "Checkbox"),
                            React.createElement(select_1.SelectItem, { value: "radio" }, "Radio"),
                            React.createElement(select_1.SelectItem, { value: "url" }, "URL"),
                            React.createElement(select_1.SelectItem, { value: "boolean" }, "Boolean")))),
                React.createElement("div", { className: "flex flex-row gap-6 pt-2 lg:col-span-3 lg:flex-col lg:gap-4 lg:pt-8" },
                    React.createElement("div", { className: "flex items-center gap-2" },
                        React.createElement(switch_1.Switch, { checked: field.is_required, onCheckedChange: function (v) { return updateField(field.id, { is_required: v }); } }),
                        React.createElement(label_1.Label, { className: "text-sm font-medium" }, "Required")),
                    React.createElement("div", { className: "flex items-center gap-2" },
                        React.createElement(switch_1.Switch, { checked: field.is_active, onCheckedChange: function (v) { return updateField(field.id, { is_active: v }); } }),
                        React.createElement(label_1.Label, { className: "text-sm font-medium" }, "Active")))),
            React.createElement("div", { className: "flex items-center justify-end gap-3 sm:justify-start sm:pl-4" },
                field.isDirty && (React.createElement(button_1.Button, { size: "sm", onClick: function () { return saveField(field); }, disabled: savingIds.has(field.id), className: "min-w-[90px]" },
                    savingIds.has(field.id) ? (React.createElement(spinner_1.Spinner, { className: "size-3.5 mr-2" })) : (React.createElement(lucide_react_1.Save, { className: "size-3.5 mr-2" })),
                    "Save")),
                React.createElement(button_1.Button, { size: "sm", variant: "ghost", className: "text-destructive hover:bg-destructive/10 hover:text-destructive px-2.5", onClick: function () { return deleteField(field.id); } },
                    React.createElement(lucide_react_1.Trash2, { className: "h-4 w-4" }))))));
}
function CustomFieldsPage() {
    var _this = this;
    var _a = React.useState([]), fields = _a[0], setFields = _a[1];
    var _b = React.useState(true), loading = _b[0], setLoading = _b[1];
    var _c = React.useState(new Set()), savingIds = _c[0], setSavingIds = _c[1];
    var _d = React.useState(null), activeDragId = _d[0], setActiveDragId = _d[1];
    var sensors = core_1.useSensors(core_1.useSensor(core_1.PointerSensor, { activationConstraint: { distance: 8 } }), core_1.useSensor(core_1.KeyboardSensor, { coordinateGetter: sortable_1.sortableKeyboardCoordinates }));
    // Load fields + ensure order exists
    function loadFields() {
        return __awaiter(this, void 0, void 0, function () {
            var res, _a, success, data, message, loaded, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, 3, 4]);
                        setLoading(true);
                        return [4 /*yield*/, axiosClient_1["default"].get("/contacts/custom-fields")];
                    case 1:
                        res = _b.sent();
                        console.log("Custom fields response:", res.data);
                        _a = res.data, success = _a.success, data = _a.data, message = _a.message;
                        if (success && Array.isArray(data)) {
                            loaded = data.map(function (f, index) {
                                var _a;
                                return ({
                                    id: String(f.id),
                                    key: f.key,
                                    label: f.label,
                                    type: f.type,
                                    is_required: !!f.is_required,
                                    is_active: !!f.is_active,
                                    order: (_a = f.order) !== null && _a !== void 0 ? _a : index,
                                    options: f.options || null
                                });
                            });
                            // sort by order just in case backend sends unsorted
                            loaded.sort(function (a, b) { return a.order - b.order; });
                            setFields(loaded);
                        }
                        else {
                            showToast_1.showToast(message || "No custom fields data received", "warning");
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        err_1 = _b.sent();
                        console.error("Failed to load custom fields:", err_1);
                        showToast_1.showToast("Cannot load custom fields: " + err_1.message, "error");
                        return [3 /*break*/, 4];
                    case 3:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    React.useEffect(function () {
        loadFields();
    }, []);
    var addNewField = function () {
        var newOrder = fields.length;
        var newField = {
            id: "new-" + Date.now(),
            key: "",
            label: "",
            type: "text",
            is_required: false,
            is_active: true,
            order: newOrder,
            isNew: true,
            isDirty: true
        };
        setFields(function (prev) { return __spreadArrays(prev, [newField]); });
    };
    var updateField = function (id, updates) {
        setFields(function (prev) {
            return prev.map(function (f) { return (f.id === id ? __assign(__assign(__assign({}, f), updates), { isDirty: true }) : f); });
        });
    };
    var saveField = function (field) { return __awaiter(_this, void 0, void 0, function () {
        var payload, res, _a, success, data_1, message, payload, res, _b, success, message, err_2;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (savingIds.has(field.id))
                        return [2 /*return*/];
                    setSavingIds(function (prev) { return new Set(__spreadArrays(prev, [field.id])); });
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 6, 7, 8]);
                    if (!field.isNew) return [3 /*break*/, 3];
                    if (!field.key.trim() || !field.label.trim()) {
                        showToast_1.showToast("Key and Label are required", "error");
                        return [2 /*return*/];
                    }
                    payload = {
                        key: field.key.trim(),
                        label: field.label.trim(),
                        type: field.type,
                        options: field.options || null,
                        is_required: field.is_required,
                        is_active: field.is_active,
                        order: field.order
                    };
                    return [4 /*yield*/, axiosClient_1["default"].post("/contacts/custom-fields", payload)];
                case 2:
                    res = _e.sent();
                    _a = res.data, success = _a.success, data_1 = _a.data, message = _a.message;
                    if (success) {
                        showToast_1.showToast(message || "Field created", "success");
                        setFields(function (prev) {
                            return prev.map(function (f) {
                                return f.id === field.id
                                    ? __assign(__assign({}, data_1), { id: String(data_1.id), isNew: false, isDirty: false }) : f;
                            });
                        });
                    }
                    else {
                        showToast_1.showToast(message || "Create failed", "error");
                    }
                    return [3 /*break*/, 5];
                case 3:
                    payload = {};
                    if (field.label !== undefined)
                        payload.label = field.label.trim();
                    if ("is_required" in field)
                        payload.is_required = field.is_required;
                    if ("is_active" in field)
                        payload.is_active = field.is_active;
                    if (field.options !== undefined)
                        payload.options = field.options;
                    if ("order" in field)
                        payload.order = field.order; // ← send new order
                    if (Object.keys(payload).length === 0)
                        return [2 /*return*/];
                    return [4 /*yield*/, axiosClient_1["default"].put("/contacts/custom-fields/" + field.id, payload)];
                case 4:
                    res = _e.sent();
                    _b = res.data, success = _b.success, message = _b.message;
                    if (success) {
                        showToast_1.showToast(message || "Field updated", "success");
                        updateField(field.id, { isDirty: false });
                    }
                    else {
                        showToast_1.showToast(message || "Update failed", "error");
                    }
                    _e.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    err_2 = _e.sent();
                    console.error(err_2);
                    showToast_1.showToast(((_d = (_c = err_2.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) || "Save error", "error");
                    return [3 /*break*/, 8];
                case 7:
                    setSavingIds(function (prev) {
                        var next = new Set(prev);
                        next["delete"](field.id);
                        return next;
                    });
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var deleteField = function (id) { return __awaiter(_this, void 0, void 0, function () {
        var field, res, _a, success, message, err_3;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    field = fields.find(function (f) { return f.id === id; });
                    if (!field)
                        return [2 /*return*/];
                    if (field.isNew) {
                        setFields(function (prev) { return prev.filter(function (f) { return f.id !== id; }); });
                        return [2 /*return*/];
                    }
                    if (!confirm("Delete this custom field? All associated contact values will be removed."))
                        return [2 /*return*/];
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axiosClient_1["default"]["delete"]("/contacts/custom-fields/" + id)];
                case 2:
                    res = _d.sent();
                    _a = res.data, success = _a.success, message = _a.message;
                    if (success) {
                        showToast_1.showToast(message || "Field deleted", "success");
                        setFields(function (prev) { return prev.filter(function (f) { return f.id !== id; }); });
                    }
                    else {
                        showToast_1.showToast(message || "Delete failed", "error");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _d.sent();
                    showToast_1.showToast(((_c = (_b = err_3.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "Delete error", "error");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    function handleDragStart(event) {
        setActiveDragId(event.active.id);
    }
    function handleDragEnd(event) {
        var active = event.active, over = event.over;
        setActiveDragId(null);
        if (!over || active.id === over.id)
            return;
        setFields(function (items) {
            var oldIndex = items.findIndex(function (i) { return i.id === active.id; });
            var newIndex = items.findIndex(function (i) { return i.id === over.id; });
            if (oldIndex === newIndex)
                return items;
            var newItems = sortable_1.arrayMove(items, oldIndex, newIndex);
            // Update order numbers & mark as dirty
            return newItems.map(function (item, idx) { return (__assign(__assign({}, item), { order: idx, isDirty: true })); });
        });
    }
    var activeField = activeDragId
        ? fields.find(function (f) { return f.id === activeDragId; })
        : null;
    if (loading) {
        return (React.createElement(layout_1.DashboardLayout, null,
            React.createElement("div", { className: "flex min-h-[60vh] items-center justify-center" },
                React.createElement(spinner_1.Spinner, { className: "size-10" }))));
    }
    return (React.createElement(layout_1.DashboardLayout, null,
        React.createElement("div", { className: "mx-auto max-w-6xl space-y-8 px-4 py-6 md:px-6 lg:px-8" },
            React.createElement("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" },
                React.createElement("div", null,
                    React.createElement("h1", { className: "text-3xl font-bold tracking-tight" }, "Custom Fields"),
                    React.createElement("p", { className: "mt-1.5 text-muted-foreground" }, "Add, manage and reorder custom fields for contacts")),
                React.createElement(button_1.Button, { onClick: addNewField, className: "gap-2" },
                    React.createElement(lucide_react_1.Plus, { className: "h-4 w-4" }),
                    "Add New Field")),
            React.createElement(card_1.Card, { className: "border-border/60 shadow-sm" },
                React.createElement(card_1.CardHeader, { className: "pb-4" },
                    React.createElement(card_1.CardTitle, null, "Contact Custom Fields"),
                    React.createElement(card_1.CardDescription, null, "Drag rows to reorder. Changes to order are saved individually.")),
                React.createElement(card_1.CardContent, { className: "space-y-6" },
                    fields.length === 0 ? (React.createElement("div", { className: "rounded-lg border border-dashed py-16 text-center text-muted-foreground" },
                        React.createElement("p", { className: "mb-2 text-lg font-medium" }, "No custom fields yet"),
                        React.createElement("p", { className: "text-sm" }, "Click \"Add New Field\" to get started."))) : (React.createElement(core_1.DndContext, { sensors: sensors, collisionDetection: core_1.closestCenter, onDragStart: handleDragStart, onDragEnd: handleDragEnd },
                        React.createElement(sortable_1.SortableContext, { items: fields.map(function (f) { return f.id; }), strategy: sortable_1.verticalListSortingStrategy },
                            React.createElement("div", { className: "space-y-4" }, fields.map(function (field) { return (React.createElement(SortableFieldItem, { key: field.id, field: field, updateField: updateField, saveField: saveField, deleteField: deleteField, savingIds: savingIds })); }))),
                        React.createElement(core_1.DragOverlay, { adjustScale: false }, activeField ? (React.createElement("div", { className: "rounded-xl border bg-card/80 p-5 shadow-lg opacity-90 ring-2 ring-primary/50" },
                            React.createElement("div", { className: "flex items-center gap-3 opacity-50" },
                                React.createElement(lucide_react_1.GripVertical, { className: "h-6 w-6" }),
                                React.createElement("span", { className: "font-medium" }, activeField.label || "New field")))) : null))),
                    React.createElement(button_1.Button, { variant: "outline", className: "mt-6 w-full gap-2 py-6", onClick: addNewField },
                        React.createElement(lucide_react_1.Plus, { className: "h-4 w-4" }),
                        "Add New Custom Field"))))));
}
exports["default"] = CustomFieldsPage;
