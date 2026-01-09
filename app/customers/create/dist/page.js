'use client';
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
var layout_1 = require("@/components/dashboard/layout");
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("@hookform/resolvers/zod");
var z = require("zod");
var date_fns_1 = require("date-fns");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var form_1 = require("@/components/ui/form");
var input_1 = require("@/components/ui/input");
var select_1 = require("@/components/ui/select");
var calendar_1 = require("@/components/ui/calendar");
var popover_1 = require("@/components/ui/popover");
var switch_1 = require("@/components/ui/switch");
var textarea_1 = require("@/components/ui/textarea");
var tabs_1 = require("@/components/ui/tabs");
var utils_1 = require("@/lib/utils");
var axiosClient_1 = require("@/lib/axiosClient");
var showToast_1 = require("@/lib/showToast");
// ────────────────────────────────────────────────
// SHARED SCHEMA (core fields)
// ────────────────────────────────────────────────
var contactSchema = z.object({
    first_name: z.string().max(255).optional().nullable(),
    last_name: z.string().max(255).optional().nullable(),
    email: z.string().email().max(255).optional().nullable(),
    phone: z.string().max(255).optional().nullable(),
    company: z.string().max(255).optional().nullable(),
    contact_type: z["enum"](['manual', 'manual_bulk_import', 'ai_detection', 'visitor_capture', 'api']).optional(),
    contact_source: z["enum"](['dashboard', 'csv_import', 'factors_ai', 'clearbit', 'website', 'product_lp', 'zapier']).optional(),
    identified_at: z.date().optional().nullable(),
    status: z["enum"](['active', 'archived']).optional(),
    deduplicate: z.boolean()["default"](true),
    source_metadata_json: z.string().optional().nullable()
});
// ────────────────────────────────────────────────
// DEFAULT VALUES - MANUAL
// ────────────────────────────────────────────────
var manualDefault = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    contact_type: 'manual',
    contact_source: 'dashboard',
    identified_at: undefined,
    status: 'active',
    deduplicate: true,
    source_metadata_json: ''
};
// ────────────────────────────────────────────────
// BULK SCHEMA
// ────────────────────────────────────────────────
var bulkSchema = z.object({
    contact_type: z["enum"]([
        'manual',
        'manual_bulk_import',
        'ai_detection',
        'visitor_capture',
        'api',
    ]),
    contact_source: z["enum"]([
        'dashboard',
        'csv_import',
        'factors_ai',
        'clearbit',
        'website',
        'product_lp',
        'zapier',
    ]),
    csv_file: z
        .custom(function (v) { return v instanceof File; }, { message: 'Please select a CSV file' })
        .optional()
        .refine(function (file) { return !file || file.name.endsWith('.csv'); }, {
        message: 'File must be a .csv'
    })
});
var bulkDefault = {
    contact_type: 'manual_bulk_import',
    contact_source: 'csv_import',
    csv_file: undefined
};
// ────────────────────────────────────────────────
// MAIN COMPONENT
// ────────────────────────────────────────────────
function CreateOrImportContactsPage() {
    var _this = this;
    var router = navigation_1.useRouter();
    // Custom fields
    var _a = react_1.useState([]), customFields = _a[0], setCustomFields = _a[1];
    var _b = react_1.useState({}), customValues = _b[0], setCustomValues = _b[1];
    var _c = react_1.useState(true), loadingCustomFields = _c[0], setLoadingCustomFields = _c[1];
    // ── Fetch custom fields ───────────────────────────────
    react_1.useEffect(function () {
        var fetchCustomFields = function () { return __awaiter(_this, void 0, void 0, function () {
            var res, active, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, axiosClient_1["default"].get('/contacts/custom-fields')];
                    case 1:
                        res = _a.sent();
                        if (res.data.success) {
                            active = res.data.data
                                .filter(function (f) { return f.is_active; })
                                .sort(function (a, b) { return a.order - b.order; });
                            setCustomFields(active);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        err_1 = _a.sent();
                        showToast_1.showToast('Could not load custom fields', 'error');
                        return [3 /*break*/, 4];
                    case 3:
                        setLoadingCustomFields(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        fetchCustomFields();
    }, []);
    // ── MANUAL FORM ───────────────────────────────────────
    var manualForm = react_hook_form_1.useForm({
        resolver: zod_1.zodResolver(contactSchema),
        defaultValues: manualDefault
    });
    var _d = react_1.useState(false), manualSubmitting = _d[0], setManualSubmitting = _d[1];
    var preparePayload = function (values) {
        var _a, _b, _c, _d, _e, _f;
        var payload = {};
        if ((_a = values.first_name) === null || _a === void 0 ? void 0 : _a.trim())
            payload.first_name = values.first_name.trim();
        if ((_b = values.last_name) === null || _b === void 0 ? void 0 : _b.trim())
            payload.last_name = values.last_name.trim();
        if ((_c = values.email) === null || _c === void 0 ? void 0 : _c.trim())
            payload.email = values.email.trim();
        if ((_d = values.phone) === null || _d === void 0 ? void 0 : _d.trim())
            payload.phone = values.phone.trim();
        if ((_e = values.company) === null || _e === void 0 ? void 0 : _e.trim())
            payload.company = values.company.trim();
        if (values.contact_type)
            payload.contact_type = values.contact_type;
        if (values.contact_source)
            payload.contact_source = values.contact_source;
        if (values.status)
            payload.status = values.status;
        payload.deduplicate = values.deduplicate;
        if (values.identified_at) {
            payload.identified_at = date_fns_1.format(values.identified_at, "yyyy-MM-dd'T'HH:mm:ssXXX");
        }
        if ((_f = values.source_metadata_json) === null || _f === void 0 ? void 0 : _f.trim()) {
            try {
                payload.source_metadata = JSON.parse(values.source_metadata_json);
            }
            catch (_g) {
                showToast_1.showToast('Invalid JSON in source metadata', 'error');
            }
        }
        return payload;
    };
    var handleApiError = function (err, setError) {
        var _a, _b;
        var res = err.response;
        if ((res === null || res === void 0 ? void 0 : res.status) === 409) {
            showToast_1.showToast("Duplicate contact found (ID: " + (((_a = res.data.data) === null || _a === void 0 ? void 0 : _a.duplicate_id) || '?') + ")", 'warning');
        }
        else if ((res === null || res === void 0 ? void 0 : res.status) === 422 && setError) {
            Object.entries(res.data.errors || {}).forEach(function (_a) {
                var key = _a[0], msgs = _a[1];
                setError(key, { message: msgs.join(', ') });
            });
            showToast_1.showToast('Please check the form for validation errors', 'error');
        }
        else {
            showToast_1.showToast(((_b = res === null || res === void 0 ? void 0 : res.data) === null || _b === void 0 ? void 0 : _b.message) || 'Something went wrong', 'error');
        }
    };
    var onManualSubmit = function (values) { return __awaiter(_this, void 0, void 0, function () {
        var payload, createRes, contactId, cfErr_1, err_2;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setManualSubmitting(true);
                    payload = preparePayload(values);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 7, 8, 9]);
                    return [4 /*yield*/, axiosClient_1["default"].post('/contacts', payload)];
                case 2:
                    createRes = _c.sent();
                    contactId = createRes.data.data.id;
                    showToast_1.showToast('Contact created successfully', 'success');
                    if (!(Object.keys(customValues).length > 0)) return [3 /*break*/, 6];
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, axiosClient_1["default"].put("/contacts/" + contactId + "/custom-fields", {
                            fields: customValues
                        })];
                case 4:
                    _c.sent();
                    showToast_1.showToast('Custom fields saved', 'success');
                    return [3 /*break*/, 6];
                case 5:
                    cfErr_1 = _c.sent();
                    showToast_1.showToast(((_b = (_a = cfErr_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Some custom fields could not be saved', 'warning');
                    return [3 /*break*/, 6];
                case 6:
                    router.push("/dashboard/contacts/" + contactId);
                    return [3 /*break*/, 9];
                case 7:
                    err_2 = _c.sent();
                    handleApiError(err_2, manualForm.setError);
                    return [3 /*break*/, 9];
                case 8:
                    setManualSubmitting(false);
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); };
    // ── BULK FORM ─────────────────────────────────────────
    var bulkForm = react_hook_form_1.useForm({
        resolver: zod_1.zodResolver(bulkSchema),
        defaultValues: bulkDefault
    });
    var _e = react_1.useState(false), bulkSubmitting = _e[0], setBulkSubmitting = _e[1];
    var onBulkSubmit = function (values) { return __awaiter(_this, void 0, void 0, function () {
        var formData, res, imported, err_3;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    setBulkSubmitting(true);
                    if (!(values.contact_type === 'manual_bulk_import' &&
                        values.contact_source === 'csv_import' &&
                        values.csv_file)) return [3 /*break*/, 5];
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, 3, , 4]);
                    formData = new FormData();
                    formData.append('file', values.csv_file);
                    formData.append('contact_type', values.contact_type);
                    formData.append('contact_source', values.contact_source);
                    return [4 /*yield*/, axiosClient_1["default"].post('/contacts/import-csv', formData, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                        })];
                case 2:
                    res = _g.sent();
                    imported = (_f = (_c = (_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.imported_count) !== null && _c !== void 0 ? _c : (_e = (_d = res.data) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.count) !== null && _f !== void 0 ? _f : 0;
                    showToast_1.showToast("Successfully imported " + imported + " contacts", 'success');
                    router.push('/dashboard/contacts');
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _g.sent();
                    handleApiError(err_3);
                    showToast_1.showToast('Bulk import failed. Please check the file format.', 'error');
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    showToast_1.showToast('Please select Bulk Import type, CSV source and upload a file', 'warning');
                    _g.label = 6;
                case 6:
                    setBulkSubmitting(false);
                    return [2 /*return*/];
            }
        });
    }); };
    // ── Custom field renderer ─────────────────────────────
    var renderCustomFieldInput = function (field) {
        var _a;
        var key = field.key;
        var value = customValues[key];
        switch (field.type) {
            case 'text':
            case 'email':
            case 'phone':
            case 'url':
            case 'number':
                return (React.createElement(input_1.Input, { type: field.type === 'number' ? 'number' : 'text', value: value !== null && value !== void 0 ? value : '', onChange: function (e) { return setCustomValues(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), (_a = {}, _a[key] = e.target.value, _a)));
                    }); } }));
            case 'textarea':
                return (React.createElement(textarea_1.Textarea, { value: value !== null && value !== void 0 ? value : '', onChange: function (e) { return setCustomValues(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), (_a = {}, _a[key] = e.target.value, _a)));
                    }); }, rows: 3 }));
            case 'date':
                return (React.createElement(popover_1.Popover, null,
                    React.createElement(popover_1.PopoverTrigger, { asChild: true },
                        React.createElement(button_1.Button, { variant: "outline", className: utils_1.cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground') },
                            value ? date_fns_1.format(new Date(value), 'PPP') : React.createElement("span", null, "Pick a date"),
                            React.createElement(lucide_react_1.CalendarIcon, { className: "ml-auto h-4 w-4 opacity-50" }))),
                    React.createElement(popover_1.PopoverContent, { className: "w-auto p-0" },
                        React.createElement(calendar_1.Calendar, { mode: "single", selected: value ? new Date(value) : undefined, onSelect: function (date) {
                                return setCustomValues(function (prev) {
                                    var _a;
                                    return (__assign(__assign({}, prev), (_a = {}, _a[key] = date ? date.toISOString() : null, _a)));
                                });
                            }, initialFocus: true }))));
            case 'select':
                return (React.createElement(select_1.Select, { value: value !== null && value !== void 0 ? value : '', onValueChange: function (val) { return setCustomValues(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), (_a = {}, _a[key] = val, _a)));
                    }); } },
                    React.createElement(select_1.SelectTrigger, null,
                        React.createElement(select_1.SelectValue, { placeholder: "Select option..." })),
                    React.createElement(select_1.SelectContent, null, (((_a = field.options) === null || _a === void 0 ? void 0 : _a.choices) || []).map(function (choice) { return (React.createElement(select_1.SelectItem, { key: choice, value: choice }, choice)); }))));
            case 'boolean':
                return (React.createElement("div", { className: "pt-2" },
                    React.createElement(switch_1.Switch, { checked: !!value, onCheckedChange: function (checked) { return setCustomValues(function (prev) {
                            var _a;
                            return (__assign(__assign({}, prev), (_a = {}, _a[key] = checked, _a)));
                        }); } })));
            default:
                return React.createElement(input_1.Input, { disabled: true, placeholder: "Unsupported type: " + field.type });
        }
    };
    return (React.createElement(layout_1.DashboardLayout, null,
        React.createElement("div", { className: "min-h-screen bg-slate-50 p-6" },
            React.createElement("h1", { className: "text-3xl font-bold mb-2" }, "Add New Contact"),
            React.createElement("p", { className: "text-muted-foreground mb-6" }, "Enter details manually or import multiple contacts via CSV."),
            React.createElement(tabs_1.Tabs, { defaultValue: "manual", className: "space-y-6" },
                React.createElement(tabs_1.TabsList, { className: "grid w-full grid-cols-2" },
                    React.createElement(tabs_1.TabsTrigger, { value: "manual" },
                        React.createElement(lucide_react_1.Plus, { className: "mr-2 h-4 w-4" }),
                        "Single Contact"),
                    React.createElement(tabs_1.TabsTrigger, { value: "bulk" },
                        React.createElement(lucide_react_1.FileUp, { className: "mr-2 h-4 w-4" }),
                        "Bulk Import (CSV)")),
                React.createElement(tabs_1.TabsContent, { value: "manual" },
                    React.createElement(card_1.Card, null,
                        React.createElement(card_1.CardHeader, null,
                            React.createElement(card_1.CardTitle, null, "Manual Contact Entry"),
                            React.createElement(card_1.CardDescription, null, "Fill in the basic information and any custom fields below.")),
                        React.createElement(form_1.Form, __assign({}, manualForm),
                            React.createElement("form", { onSubmit: manualForm.handleSubmit(onManualSubmit) },
                                React.createElement(card_1.CardContent, { className: "grid gap-8 md:grid-cols-2" },
                                    React.createElement("div", { className: "space-y-5" },
                                        React.createElement("h3", { className: "text-lg font-semibold" }, "Basic Information"),
                                        React.createElement(form_1.FormField, { control: manualForm.control, name: "first_name", render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return (React.createElement(form_1.FormItem, null,
                                                    React.createElement(form_1.FormLabel, null, "First Name"),
                                                    React.createElement(form_1.FormControl, null,
                                                        React.createElement(input_1.Input, __assign({}, field, { value: (_b = field.value) !== null && _b !== void 0 ? _b : '' }))),
                                                    React.createElement(form_1.FormMessage, null)));
                                            } }),
                                        React.createElement(form_1.FormField, { control: manualForm.control, name: "last_name", render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return (React.createElement(form_1.FormItem, null,
                                                    React.createElement(form_1.FormLabel, null, "Last Name"),
                                                    React.createElement(form_1.FormControl, null,
                                                        React.createElement(input_1.Input, __assign({}, field, { value: (_b = field.value) !== null && _b !== void 0 ? _b : '' }))),
                                                    React.createElement(form_1.FormMessage, null)));
                                            } }),
                                        React.createElement(form_1.FormField, { control: manualForm.control, name: "email", render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return (React.createElement(form_1.FormItem, null,
                                                    React.createElement(form_1.FormLabel, null, "Email"),
                                                    React.createElement(form_1.FormControl, null,
                                                        React.createElement(input_1.Input, __assign({ type: "email" }, field, { value: (_b = field.value) !== null && _b !== void 0 ? _b : '' }))),
                                                    React.createElement(form_1.FormMessage, null)));
                                            } }),
                                        React.createElement(form_1.FormField, { control: manualForm.control, name: "phone", render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return (React.createElement(form_1.FormItem, null,
                                                    React.createElement(form_1.FormLabel, null, "Phone"),
                                                    React.createElement(form_1.FormControl, null,
                                                        React.createElement(input_1.Input, __assign({}, field, { value: (_b = field.value) !== null && _b !== void 0 ? _b : '' }))),
                                                    React.createElement(form_1.FormMessage, null)));
                                            } }),
                                        React.createElement(form_1.FormField, { control: manualForm.control, name: "company", render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return (React.createElement(form_1.FormItem, null,
                                                    React.createElement(form_1.FormLabel, null, "Company"),
                                                    React.createElement(form_1.FormControl, null,
                                                        React.createElement(input_1.Input, __assign({}, field, { value: (_b = field.value) !== null && _b !== void 0 ? _b : '' }))),
                                                    React.createElement(form_1.FormMessage, null)));
                                            } }),
                                        React.createElement(form_1.FormField, { control: manualForm.control, name: "identified_at", render: function (_a) {
                                                var field = _a.field;
                                                return (React.createElement(form_1.FormItem, null,
                                                    React.createElement(form_1.FormLabel, null, "Identified At"),
                                                    React.createElement(popover_1.Popover, null,
                                                        React.createElement(popover_1.PopoverTrigger, { asChild: true },
                                                            React.createElement(form_1.FormControl, null,
                                                                React.createElement(button_1.Button, { variant: "outline", className: utils_1.cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground') },
                                                                    field.value ? date_fns_1.format(field.value, 'PPP') : React.createElement("span", null, "Pick date"),
                                                                    React.createElement(lucide_react_1.CalendarIcon, { className: "ml-auto h-4 w-4 opacity-50" })))),
                                                        React.createElement(popover_1.PopoverContent, { className: "w-auto p-0", align: "start" },
                                                            React.createElement(calendar_1.Calendar, { mode: "single", selected: field.value, onSelect: field.onChange, disabled: function (date) {
                                                                    return date > new Date() || date < new Date('1900-01-01');
                                                                }, initialFocus: true }))),
                                                    React.createElement(form_1.FormMessage, null)));
                                            } }),
                                        React.createElement(form_1.FormField, { control: manualForm.control, name: "status", render: function (_a) {
                                                var field = _a.field;
                                                return (React.createElement(form_1.FormItem, null,
                                                    React.createElement(form_1.FormLabel, null, "Status"),
                                                    React.createElement(select_1.Select, { onValueChange: field.onChange, defaultValue: field.value },
                                                        React.createElement(form_1.FormControl, null,
                                                            React.createElement(select_1.SelectTrigger, null,
                                                                React.createElement(select_1.SelectValue, { placeholder: "Select status" }))),
                                                        React.createElement(select_1.SelectContent, null,
                                                            React.createElement(select_1.SelectItem, { value: "active" }, "Active"),
                                                            React.createElement(select_1.SelectItem, { value: "archived" }, "Archived"))),
                                                    React.createElement(form_1.FormMessage, null)));
                                            } }),
                                        React.createElement(form_1.FormField, { control: manualForm.control, name: "deduplicate", render: function (_a) {
                                                var field = _a.field;
                                                return (React.createElement(form_1.FormItem, { className: "flex items-center space-x-3 space-y-0" },
                                                    React.createElement(switch_1.Switch, { checked: field.value, onCheckedChange: field.onChange, id: "deduplicate" }),
                                                    React.createElement(form_1.FormLabel, { htmlFor: "deduplicate", className: "cursor-pointer" }, "Prevent duplicates")));
                                            } }),
                                        React.createElement(form_1.FormField, { control: manualForm.control, name: "source_metadata_json", render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return (React.createElement(form_1.FormItem, null,
                                                    React.createElement(form_1.FormLabel, null, "Source Metadata (JSON \u2013 optional)"),
                                                    React.createElement(form_1.FormControl, null,
                                                        React.createElement(textarea_1.Textarea, __assign({ placeholder: '{"campaign": "summer_2025", "utm_source": "newsletter"}' }, field, { value: (_b = field.value) !== null && _b !== void 0 ? _b : '', rows: 2 }))),
                                                    React.createElement(form_1.FormDescription, null, "Advanced usage only"),
                                                    React.createElement(form_1.FormMessage, null)));
                                            } })),
                                    React.createElement("div", { className: "space-y-5" },
                                        React.createElement("h3", { className: "text-lg font-semibold" }, "Custom Fields"),
                                        loadingCustomFields ? (React.createElement("div", { className: "py-6 text-center text-muted-foreground" },
                                            React.createElement(lucide_react_1.Loader2, { className: "mx-auto h-6 w-6 animate-spin mb-2" }),
                                            React.createElement("p", null, "Loading custom fields..."))) : customFields.length === 0 ? (React.createElement("div", { className: "py-8 text-center text-muted-foreground border border-dashed rounded-lg" },
                                            React.createElement("p", null, "No custom fields have been created yet."),
                                            React.createElement("p", { className: "text-sm mt-1" }, "You can add them in Settings \u2192 Custom Fields"))) : (React.createElement("div", { className: "space-y-5" }, customFields.map(function (cf) {
                                            var _a;
                                            return (React.createElement("div", { key: cf.id, className: "space-y-2" },
                                                React.createElement(form_1.FormLabel, { className: "flex items-center gap-1.5" },
                                                    cf.label,
                                                    cf.is_required && (React.createElement("span", { className: "text-red-500 text-xs font-medium" }, "*"))),
                                                renderCustomFieldInput(cf),
                                                React.createElement("p", { className: "text-xs text-muted-foreground" },
                                                    cf.type,
                                                    ((_a = cf.options) === null || _a === void 0 ? void 0 : _a.choices) && " \u2022 " + cf.options.choices.length + " options")));
                                        }))))),
                                React.createElement(card_1.CardFooter, { className: "flex justify-end gap-4 pt-6 border-t" },
                                    React.createElement(button_1.Button, { type: "submit", disabled: manualSubmitting || loadingCustomFields, className: "min-w-[140px]" },
                                        manualSubmitting && React.createElement(lucide_react_1.Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
                                        "Create Contact")))))),
                React.createElement(tabs_1.TabsContent, { value: "bulk" },
                    React.createElement(card_1.Card, null,
                        React.createElement(card_1.CardHeader, null,
                            React.createElement(card_1.CardTitle, null, "Bulk Import via CSV"),
                            React.createElement(card_1.CardDescription, null, "Upload a CSV file to import multiple contacts at once.")),
                        React.createElement(form_1.Form, __assign({}, bulkForm),
                            React.createElement("form", { onSubmit: bulkForm.handleSubmit(onBulkSubmit) },
                                React.createElement(card_1.CardContent, { className: "space-y-6" },
                                    React.createElement(form_1.FormField, { control: bulkForm.control, name: "contact_type", render: function (_a) {
                                            var field = _a.field;
                                            return (React.createElement(form_1.FormItem, null,
                                                React.createElement(form_1.FormLabel, null, "Contact Type"),
                                                React.createElement(select_1.Select, { onValueChange: field.onChange, defaultValue: field.value },
                                                    React.createElement(form_1.FormControl, null,
                                                        React.createElement(select_1.SelectTrigger, null,
                                                            React.createElement(select_1.SelectValue, { placeholder: "Select type" }))),
                                                    React.createElement(select_1.SelectContent, null,
                                                        React.createElement(select_1.SelectItem, { value: "manual_bulk_import" }, "Bulk Import"))),
                                                React.createElement(form_1.FormMessage, null)));
                                        } }),
                                    React.createElement(form_1.FormField, { control: bulkForm.control, name: "contact_source", render: function (_a) {
                                            var field = _a.field;
                                            return (React.createElement(form_1.FormItem, null,
                                                React.createElement(form_1.FormLabel, null, "Source"),
                                                React.createElement(select_1.Select, { onValueChange: field.onChange, defaultValue: field.value },
                                                    React.createElement(form_1.FormControl, null,
                                                        React.createElement(select_1.SelectTrigger, null,
                                                            React.createElement(select_1.SelectValue, { placeholder: "Select source" }))),
                                                    React.createElement(select_1.SelectContent, null,
                                                        React.createElement(select_1.SelectItem, { value: "csv_import" }, "CSV Import"))),
                                                React.createElement(form_1.FormMessage, null)));
                                        } }),
                                    bulkForm.watch('contact_type') === 'manual_bulk_import' &&
                                        bulkForm.watch('contact_source') === 'csv_import' && (React.createElement(form_1.FormField, { control: bulkForm.control, name: "csv_file", render: function (_a) {
                                            var _b = _a.field, value = _b.value, onChange = _b.onChange, fieldProps = __rest(_b, ["value", "onChange"]);
                                            return (React.createElement(form_1.FormItem, null,
                                                React.createElement(form_1.FormLabel, null, "Upload CSV File"),
                                                React.createElement(form_1.FormControl, null,
                                                    React.createElement(input_1.Input, __assign({ type: "file", accept: ".csv", onChange: function (e) { var _a; return onChange((_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0]); } }, fieldProps))),
                                                React.createElement(form_1.FormDescription, null, "CSV should contain columns: first_name, last_name, email, phone, company, etc."),
                                                React.createElement(form_1.FormMessage, null)));
                                        } })),
                                    (bulkForm.watch('contact_type') !== 'manual_bulk_import' ||
                                        bulkForm.watch('contact_source') !== 'csv_import') && (React.createElement("p", { className: "text-sm text-muted-foreground pt-4" },
                                        "Select ",
                                        React.createElement("strong", null, "Bulk Import"),
                                        " type and ",
                                        React.createElement("strong", null, "CSV Import"),
                                        " source to enable file upload."))),
                                React.createElement(card_1.CardFooter, { className: "flex justify-end gap-4 pt-6 border-t" },
                                    React.createElement(button_1.Button, { type: "submit", disabled: bulkSubmitting, className: "min-w-[140px]" },
                                        bulkSubmitting && React.createElement(lucide_react_1.Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
                                        "Import Contacts"))))))))));
}
exports["default"] = CreateOrImportContactsPage;
