// app/dashboard/contacts/create-or-import/page.tsx
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
exports.__esModule = true;
var layout_1 = require("@/components/dashboard/layout");
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("@hookform/resolvers/zod");
var z = require("zod");
var date_fns_1 = require("date-fns");
var lucide_react_1 = require("lucide-react");
var papaparse_1 = require("papaparse");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var form_1 = require("@/components/ui/form");
var input_1 = require("@/components/ui/input");
var select_1 = require("@/components/ui/select");
var calendar_1 = require("@/components/ui/calendar");
var popover_1 = require("@/components/ui/popover");
var switch_1 = require("@/components/ui/switch");
var textarea_1 = require("@/components/ui/textarea");
var progress_1 = require("@/components/ui/progress");
var tabs_1 = require("@/components/ui/tabs");
var utils_1 = require("@/lib/utils");
var axiosClient_1 = require("@/lib/axiosClient");
var showToast_1 = require("@/lib/showToast");
// ────────────────────────────────────────────────
// SHARED SCHEMA
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
    source_metadata_json: z.string().optional()
});
// ────────────────────────────────────────────────
// MANUAL FORM DEFAULTS
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
// MAIN PAGE COMPONENT
// ────────────────────────────────────────────────
function CreateOrImportContactsPage() {
    var _this = this;
    var router = navigation_1.useRouter();
    // ── Manual creation ─────────────────────────────
    var manualForm = react_hook_form_1.useForm({
        resolver: zod_1.zodResolver(contactSchema),
        defaultValues: manualDefault
    });
    var _a = react_1.useState(false), manualSubmitting = _a[0], setManualSubmitting = _a[1];
    var onManualSubmit = function (values) { return __awaiter(_this, void 0, void 0, function () {
        var payload, res, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setManualSubmitting(true);
                    payload = preparePayload(values);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, axiosClient_1["default"].post('/contacts', payload)];
                case 2:
                    res = _a.sent();
                    showToast_1.showToast(res.data.message || 'Contact created', 'success');
                    router.push("/dashboard/contacts/" + res.data.data.id);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    handleApiError(err_1, manualForm.setError);
                    return [3 /*break*/, 5];
                case 4:
                    setManualSubmitting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // ── Bulk import ─────────────────────────────────
    var _b = react_1.useState(null), csvFile = _b[0], setCsvFile = _b[1];
    var _c = react_1.useState([]), rows = _c[0], setRows = _c[1];
    var _d = react_1.useState('manual_bulk_import'), importType = _d[0], setImportType = _d[1];
    var _e = react_1.useState('csv_import'), importSource = _e[0], setImportSource = _e[1];
    var _f = react_1.useState(true), importDeduplicate = _f[0], setImportDeduplicate = _f[1];
    var _g = react_1.useState(0), importProgress = _g[0], setImportProgress = _g[1];
    var _h = react_1.useState('idle'), importStatus = _h[0], setImportStatus = _h[1];
    var _j = react_1.useState({ success: 0, skipped: 0, failed: 0 }), importResult = _j[0], setImportResult = _j[1];
    var fileInputRef = react_1.useRef(null);
    var handleCsvUpload = function (e) {
        var _a;
        var file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file || !file.name.endsWith('.csv')) {
            showToast_1.showToast('Please select a valid .csv file', 'error');
            return;
        }
        setCsvFile(file);
        papaparse_1["default"].parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function (result) {
                if (result.data.length === 0) {
                    showToast_1.showToast('CSV file is empty or invalid', 'error');
                    return;
                }
                setRows(result.data);
                showToast_1.showToast("Loaded " + result.data.length + " rows from CSV", 'success');
            },
            error: function () { return showToast_1.showToast('Failed to parse CSV file', 'error'); }
        });
    };
    var startBulkImport = function () { return __awaiter(_this, void 0, void 0, function () {
        var processed, total, _i, rows_1, row, contact, payload, err_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!rows.length) {
                        showToast_1.showToast('No contacts loaded from CSV', 'error');
                        return [2 /*return*/];
                    }
                    setImportProgress(0);
                    setImportStatus('processing');
                    setImportResult({ success: 0, skipped: 0, failed: 0 });
                    processed = 0;
                    total = rows.length;
                    _i = 0, rows_1 = rows;
                    _b.label = 1;
                case 1:
                    if (!(_i < rows_1.length)) return [3 /*break*/, 7];
                    row = rows_1[_i];
                    contact = {
                        first_name: row.first_name || row['First Name'] || '',
                        last_name: row.last_name || row['Last Name'] || '',
                        email: row.email || row['Email'] || '',
                        phone: row.phone || row['Phone'] || '',
                        company: row.company || row['Company'] || '',
                        contact_type: importType,
                        contact_source: importSource,
                        deduplicate: importDeduplicate,
                        status: 'active',
                        source_metadata: {
                            imported_file: csvFile === null || csvFile === void 0 ? void 0 : csvFile.name,
                            row_index: processed + 1,
                            original_source: importSource
                        }
                    };
                    payload = preparePayload(contact);
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, axiosClient_1["default"].post('/contacts', payload)];
                case 3:
                    _b.sent();
                    setImportResult(function (prev) { return (__assign(__assign({}, prev), { success: prev.success + 1 })); });
                    return [3 /*break*/, 5];
                case 4:
                    err_2 = _b.sent();
                    if (((_a = err_2.response) === null || _a === void 0 ? void 0 : _a.status) === 409) {
                        setImportResult(function (prev) { return (__assign(__assign({}, prev), { skipped: prev.skipped + 1 })); });
                    }
                    else {
                        setImportResult(function (prev) { return (__assign(__assign({}, prev), { failed: prev.failed + 1 })); });
                    }
                    return [3 /*break*/, 5];
                case 5:
                    processed++;
                    setImportProgress(Math.round((processed / total) * 100));
                    _b.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7:
                    setImportStatus('done');
                    showToast_1.showToast("Import finished: " + importResult.success + " added, " + importResult.skipped + " skipped, " + importResult.failed + " failed", 'success');
                    return [2 /*return*/];
            }
        });
    }); };
    // ── Shared helpers ──────────────────────────────
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
                throw new Error('Invalid JSON in source metadata');
            }
        }
        return payload;
    };
    var handleApiError = function (err, setError) {
        var _a, _b;
        var res = err.response;
        if ((res === null || res === void 0 ? void 0 : res.status) === 409) {
            showToast_1.showToast("Duplicate found (ID: " + (((_a = res.data.data) === null || _a === void 0 ? void 0 : _a.duplicate_id) || '?') + ")", 'warning');
        }
        else if ((res === null || res === void 0 ? void 0 : res.status) === 422 && setError) {
            Object.entries(res.data.errors || {}).forEach(function (_a) {
                var key = _a[0], msgs = _a[1];
                setError(key, { message: msgs.join(', ') });
            });
            showToast_1.showToast('Validation errors – check fields', 'error');
        }
        else {
            showToast_1.showToast(((_b = res === null || res === void 0 ? void 0 : res.data) === null || _b === void 0 ? void 0 : _b.message) || 'Request failed', 'error');
        }
    };
    return (React.createElement(layout_1.DashboardLayout, null,
        React.createElement("div", { className: "container max-w-5xl py-8" },
            React.createElement("h1", { className: "text-3xl font-bold mb-2" }, "Add Contacts"),
            React.createElement("p", { className: "text-muted-foreground mb-6" }, "Create single contact manually or import multiple from CSV. Supports all contact types and sources."),
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
                            React.createElement(card_1.CardTitle, null, "Manual Entry"),
                            React.createElement(card_1.CardDescription, null, "Add one contact with customizable type and source.")),
                        React.createElement(form_1.Form, __assign({}, manualForm),
                            React.createElement("form", { onSubmit: manualForm.handleSubmit(onManualSubmit) },
                                React.createElement(card_1.CardContent, { className: "grid gap-6 md:grid-cols-2" },
                                    React.createElement("div", { className: "space-y-4" },
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
                                            } })),
                                    React.createElement("div", { className: "space-y-4" },
                                        React.createElement(form_1.FormField, { control: manualForm.control, name: "contact_type", render: function (_a) {
                                                var field = _a.field;
                                                return (React.createElement(form_1.FormItem, null,
                                                    React.createElement(form_1.FormLabel, null, "Type"),
                                                    React.createElement(select_1.Select, { onValueChange: field.onChange, defaultValue: field.value },
                                                        React.createElement(form_1.FormControl, null,
                                                            React.createElement(select_1.SelectTrigger, null,
                                                                React.createElement(select_1.SelectValue, { placeholder: "Select type" }))),
                                                        React.createElement(select_1.SelectContent, null,
                                                            React.createElement(select_1.SelectItem, { value: "manual" }, "Manual"),
                                                            React.createElement(select_1.SelectItem, { value: "manual_bulk_import" }, "Manual Bulk Import"),
                                                            React.createElement(select_1.SelectItem, { value: "ai_detection" }, "AI Detection"),
                                                            React.createElement(select_1.SelectItem, { value: "visitor_capture" }, "Visitor Capture"),
                                                            React.createElement(select_1.SelectItem, { value: "api" }, "API"))),
                                                    React.createElement(form_1.FormMessage, null)));
                                            } }),
                                        React.createElement(form_1.FormField, { control: manualForm.control, name: "contact_source", render: function (_a) {
                                                var field = _a.field;
                                                return (React.createElement(form_1.FormItem, null,
                                                    React.createElement(form_1.FormLabel, null, "Source"),
                                                    React.createElement(select_1.Select, { onValueChange: field.onChange, defaultValue: field.value },
                                                        React.createElement(form_1.FormControl, null,
                                                            React.createElement(select_1.SelectTrigger, null,
                                                                React.createElement(select_1.SelectValue, { placeholder: "Select source" }))),
                                                        React.createElement(select_1.SelectContent, null,
                                                            React.createElement(select_1.SelectItem, { value: "dashboard" }, "Dashboard"),
                                                            React.createElement(select_1.SelectItem, { value: "csv_import" }, "CSV Import"),
                                                            React.createElement(select_1.SelectItem, { value: "factors_ai" }, "Factors AI"),
                                                            React.createElement(select_1.SelectItem, { value: "clearbit" }, "Clearbit"),
                                                            React.createElement(select_1.SelectItem, { value: "website" }, "Website"),
                                                            React.createElement(select_1.SelectItem, { value: "product_lp" }, "Product LP"),
                                                            React.createElement(select_1.SelectItem, { value: "zapier" }, "Zapier"))),
                                                    React.createElement(form_1.FormMessage, null)));
                                            } }),
                                        React.createElement(form_1.FormField, { control: manualForm.control, name: "identified_at", render: function (_a) {
                                                var field = _a.field;
                                                return (React.createElement(form_1.FormItem, null,
                                                    React.createElement(form_1.FormLabel, null, "Identified At"),
                                                    React.createElement(popover_1.Popover, null,
                                                        React.createElement(popover_1.PopoverTrigger, { asChild: true },
                                                            React.createElement(form_1.FormControl, null,
                                                                React.createElement(button_1.Button, { variant: "outline", className: utils_1.cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground") },
                                                                    field.value ? (date_fns_1.format(field.value, "PPP")) : (React.createElement("span", null, "Pick a date")),
                                                                    React.createElement(lucide_react_1.CalendarIcon, { className: "ml-auto h-4 w-4 opacity-50" })))),
                                                        React.createElement(popover_1.PopoverContent, { className: "w-auto p-0", align: "start" },
                                                            React.createElement(calendar_1.Calendar, { mode: "single", selected: field.value, onSelect: field.onChange, disabled: function (date) {
                                                                    return date > new Date() || date < new Date("1900-01-01");
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
                                                return (React.createElement(form_1.FormItem, { className: "flex items-center space-x-2" },
                                                    React.createElement(switch_1.Switch, { checked: field.value, onCheckedChange: field.onChange, id: "dedup-manual" }),
                                                    React.createElement(form_1.FormLabel, { htmlFor: "dedup-manual" }, "Prevent duplicates")));
                                            } }),
                                        React.createElement(form_1.FormField, { control: manualForm.control, name: "source_metadata_json", render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return (React.createElement(form_1.FormItem, null,
                                                    React.createElement(form_1.FormLabel, null, "Source Metadata (JSON)"),
                                                    React.createElement(form_1.FormControl, null,
                                                        React.createElement(textarea_1.Textarea, __assign({ placeholder: '{"key": "value"}' }, field, { value: (_b = field.value) !== null && _b !== void 0 ? _b : '' }))),
                                                    React.createElement(form_1.FormDescription, null, "Optional JSON metadata for the contact origin."),
                                                    React.createElement(form_1.FormMessage, null)));
                                            } }))),
                                React.createElement(card_1.CardFooter, { className: "flex justify-end" },
                                    React.createElement(button_1.Button, { type: "submit", disabled: manualSubmitting },
                                        manualSubmitting && React.createElement(lucide_react_1.Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
                                        "Create Contact")))))),
                React.createElement(tabs_1.TabsContent, { value: "bulk" },
                    React.createElement(card_1.Card, null,
                        React.createElement(card_1.CardHeader, null,
                            React.createElement(card_1.CardTitle, null, "Bulk Import from CSV"),
                            React.createElement(card_1.CardDescription, null, "Upload CSV file \u2022 Supports various types and sources for imported contacts.")),
                        React.createElement(card_1.CardContent, { className: "space-y-6" },
                            React.createElement("div", { className: "border-2 border-dashed rounded-lg p-8 text-center" },
                                React.createElement(input_1.Input, { ref: fileInputRef, type: "file", accept: ".csv", className: "hidden", onChange: handleCsvUpload }),
                                React.createElement(button_1.Button, { variant: "outline", size: "lg", onClick: function () { var _a; return (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }, disabled: importStatus === 'processing' },
                                    React.createElement(lucide_react_1.Upload, { className: "mr-2 h-5 w-5" }),
                                    "Select CSV File"),
                                csvFile && (React.createElement("p", { className: "mt-4 text-sm text-muted-foreground" },
                                    "Selected: ",
                                    csvFile.name,
                                    " (",
                                    (csvFile.size / 1024).toFixed(1),
                                    " KB)"))),
                            rows.length > 0 && (React.createElement(React.Fragment, null,
                                React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6" },
                                    React.createElement("div", null,
                                        React.createElement(form_1.FormLabel, null, "Type"),
                                        React.createElement(select_1.Select, { value: importType, onValueChange: setImportType },
                                            React.createElement(select_1.SelectTrigger, null,
                                                React.createElement(select_1.SelectValue, null)),
                                            React.createElement(select_1.SelectContent, null,
                                                React.createElement(select_1.SelectItem, { value: "manual_bulk_import" }, "Manual Bulk Import"),
                                                React.createElement(select_1.SelectItem, { value: "ai_detection" }, "AI Detection"),
                                                React.createElement(select_1.SelectItem, { value: "visitor_capture" }, "Visitor Capture"),
                                                React.createElement(select_1.SelectItem, { value: "api" }, "API")))),
                                    React.createElement("div", null,
                                        React.createElement(form_1.FormLabel, null, "Source"),
                                        React.createElement(select_1.Select, { value: importSource, onValueChange: setImportSource },
                                            React.createElement(select_1.SelectTrigger, null,
                                                React.createElement(select_1.SelectValue, null)),
                                            React.createElement(select_1.SelectContent, null,
                                                React.createElement(select_1.SelectItem, { value: "csv_import" }, "CSV Import"),
                                                React.createElement(select_1.SelectItem, { value: "factors_ai" }, "Factors AI"),
                                                React.createElement(select_1.SelectItem, { value: "clearbit" }, "Clearbit"),
                                                React.createElement(select_1.SelectItem, { value: "website" }, "Website"),
                                                React.createElement(select_1.SelectItem, { value: "product_lp" }, "Product LP"),
                                                React.createElement(select_1.SelectItem, { value: "zapier" }, "Zapier")))),
                                    React.createElement("div", { className: "flex items-end" },
                                        React.createElement("div", { className: "flex items-center space-x-2" },
                                            React.createElement(switch_1.Switch, { id: "dedup-bulk", checked: importDeduplicate, onCheckedChange: setImportDeduplicate }),
                                            React.createElement("label", { htmlFor: "dedup-bulk", className: "text-sm font-medium" }, "Skip duplicates"))),
                                    React.createElement("div", { className: "flex items-end" },
                                        React.createElement(button_1.Button, { onClick: startBulkImport, disabled: importStatus === 'processing', className: "w-full" }, importStatus === 'processing' ? (React.createElement(React.Fragment, null, "Processing\u2026")) : (React.createElement(React.Fragment, null,
                                            "Start Import (",
                                            rows.length,
                                            " contacts)"))))),
                                importStatus !== 'idle' && (React.createElement("div", { className: "space-y-2" },
                                    React.createElement("div", { className: "flex justify-between text-sm" },
                                        React.createElement("span", null, "Import progress"),
                                        React.createElement("span", null,
                                            importProgress,
                                            "%")),
                                    React.createElement(progress_1.Progress, { value: importProgress, className: "h-2" }),
                                    importStatus === 'done' && (React.createElement("div", { className: "text-sm mt-4 p-3 bg-muted rounded-md" },
                                        React.createElement("p", { className: "font-medium" }, "Result:"),
                                        React.createElement("ul", { className: "mt-1 space-y-1" },
                                            React.createElement("li", null,
                                                "Added: ",
                                                React.createElement("strong", null, importResult.success)),
                                            React.createElement("li", null,
                                                "Skipped (duplicates): ",
                                                React.createElement("strong", null, importResult.skipped)),
                                            React.createElement("li", null,
                                                "Failed: ",
                                                React.createElement("strong", null, importResult.failed))))))))))))))));
}
exports["default"] = CreateOrImportContactsPage;
