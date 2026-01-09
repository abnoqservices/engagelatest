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
exports.__esModule = true;
var React = require("react");
var react_1 = require("react");
var axiosClient_1 = require("@/lib/axiosClient");
var showToast_1 = require("@/lib/showToast");
var layout_1 = require("@/components/dashboard/layout");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var badge_1 = require("@/components/ui/badge");
var select_1 = require("@/components/ui/select");
var table_1 = require("@/components/ui/table");
var sheet_1 = require("@/components/ui/sheet");
var dropdown_menu_1 = require("@/components/ui/dropdown-menu");
var alert_dialog_1 = require("@/components/ui/alert-dialog");
var tabs_1 = require("@/components/ui/tabs");
var lucide_react_1 = require("lucide-react");
// ────────────────────────────────────────────────
function CustomersPage() {
    var _this = this;
    var _a = react_1.useState([]), contacts = _a[0], setContacts = _a[1];
    var _b = react_1.useState(null), selectedContact = _b[0], setSelectedContact = _b[1];
    var _c = react_1.useState(false), isEditing = _c[0], setIsEditing = _c[1];
    var _d = react_1.useState({}), formData = _d[0], setFormData = _d[1];
    var _e = react_1.useState(null), deleteId = _e[0], setDeleteId = _e[1];
    var _f = react_1.useState(""), searchQuery = _f[0], setSearchQuery = _f[1];
    var _g = react_1.useState("all"), statusFilter = _g[0], setStatusFilter = _g[1];
    var _h = react_1.useState(1), currentPage = _h[0], setCurrentPage = _h[1];
    var _j = react_1.useState(15), perPage = _j[0], setPerPage = _j[1];
    var _k = react_1.useState(0), total = _k[0], setTotal = _k[1];
    var _l = react_1.useState(false), loading = _l[0], setLoading = _l[1];
    var fetchContacts = function () { return __awaiter(_this, void 0, void 0, function () {
        var params, res, err_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setLoading(true);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    params = { per_page: perPage, page: currentPage };
                    if (searchQuery)
                        params.search = searchQuery;
                    if (statusFilter !== "all")
                        params.status = statusFilter;
                    return [4 /*yield*/, axiosClient_1["default"].get("/contacts", { params: params })];
                case 2:
                    res = _c.sent();
                    if (res.data.success) {
                        setContacts(res.data.data.data);
                        setTotal(res.data.data.total);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _c.sent();
                    showToast_1.showToast(((_b = (_a = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Failed to load contacts", "error");
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var fetchContactDetail = function (id) { return __awaiter(_this, void 0, void 0, function () {
        var res, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axiosClient_1["default"].get("/contacts/" + id)];
                case 1:
                    res = _b.sent();
                    if (res.data.success) {
                        setSelectedContact(res.data.data);
                        setFormData(res.data.data);
                        setIsEditing(false);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    _a = _b.sent();
                    showToast_1.showToast("Failed to load contact details", "error");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleUpdate = function () { return __awaiter(_this, void 0, void 0, function () {
        var res, err_2;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!selectedContact)
                        return [2 /*return*/];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axiosClient_1["default"].put("/contacts/" + selectedContact.id, formData)];
                case 2:
                    res = _c.sent();
                    if (res.data.success) {
                        showToast_1.showToast("Contact updated successfully", "success");
                        setSelectedContact(res.data.data || __assign(__assign({}, selectedContact), formData));
                        setIsEditing(false);
                        fetchContacts(); // refresh list
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _c.sent();
                    showToast_1.showToast(((_b = (_a = err_2 === null || err_2 === void 0 ? void 0 : err_2.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Failed to update contact", "error");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleDelete = function () { return __awaiter(_this, void 0, void 0, function () {
        var err_3;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!deleteId)
                        return [2 /*return*/];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, axiosClient_1["default"]["delete"]("/contacts/" + deleteId)];
                case 2:
                    _c.sent();
                    showToast_1.showToast("Contact deleted", "success");
                    fetchContacts();
                    return [3 /*break*/, 5];
                case 3:
                    err_3 = _c.sent();
                    showToast_1.showToast(((_b = (_a = err_3 === null || err_3 === void 0 ? void 0 : err_3.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Failed to delete", "error");
                    return [3 /*break*/, 5];
                case 4:
                    setDeleteId(null);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    react_1.useEffect(function () {
        fetchContacts();
    }, [currentPage, perPage, searchQuery, statusFilter]);
    var handleSearchChange = function (e) {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };
    return (React.createElement(layout_1.DashboardLayout, null,
        React.createElement("div", { className: "space-y-6" },
            React.createElement("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" },
                React.createElement("div", null,
                    React.createElement("h1", { className: "text-3xl font-bold" }, "Customers"),
                    React.createElement("p", { className: "text-sm text-muted-foreground mt-1" }, "Manage your contacts and relationships")),
                React.createElement("div", { className: "flex gap-3" },
                    React.createElement(button_1.Button, { className: "gap-2" },
                        React.createElement(lucide_react_1.Plus, { className: "h-4 w-4" }),
                        "Add Contact"),
                    React.createElement(button_1.Button, { variant: "outline", className: "gap-2" },
                        React.createElement(lucide_react_1.Download, { className: "h-4 w-4" }),
                        "Export"))),
            React.createElement(tabs_1.Tabs, { defaultValue: "list", className: "space-y-6" },
                React.createElement(tabs_1.TabsContent, { value: "list", className: "space-y-6" },
                    React.createElement("div", { className: "flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between" },
                        React.createElement("div", { className: "relative flex-1 max-w-md" },
                            React.createElement(lucide_react_1.Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
                            React.createElement(input_1.Input, { placeholder: "Search name, email, phone...", value: searchQuery, onChange: handleSearchChange, className: "pl-10" })),
                        React.createElement("div", { className: "flex gap-3" },
                            React.createElement(select_1.Select, { value: statusFilter, onValueChange: setStatusFilter },
                                React.createElement(select_1.SelectTrigger, { className: "w-40" },
                                    React.createElement(select_1.SelectValue, { placeholder: "Status" })),
                                React.createElement(select_1.SelectContent, null,
                                    React.createElement(select_1.SelectItem, { value: "all" }, "All"),
                                    React.createElement(select_1.SelectItem, { value: "active" }, "Active"),
                                    React.createElement(select_1.SelectItem, { value: "archived" }, "Archived"))),
                            React.createElement(select_1.Select, { value: perPage.toString(), onValueChange: function (v) {
                                    setPerPage(Number(v));
                                    setCurrentPage(1);
                                } },
                                React.createElement(select_1.SelectTrigger, { className: "w-32" },
                                    React.createElement(select_1.SelectValue, null)),
                                React.createElement(select_1.SelectContent, null,
                                    React.createElement(select_1.SelectItem, { value: "10" }, "10 / page"),
                                    React.createElement(select_1.SelectItem, { value: "15" }, "15 / page"),
                                    React.createElement(select_1.SelectItem, { value: "25" }, "25 / page"))))),
                    React.createElement("div", { className: "rounded-xl border bg-card shadow-sm overflow-hidden" }, loading ? (React.createElement("div", { className: "p-12 text-center" }, "Loading...")) : contacts.length === 0 ? (React.createElement("div", { className: "p-12 text-center text-muted-foreground" }, "No contacts found")) : (React.createElement(React.Fragment, null,
                        React.createElement(table_1.Table, null,
                            React.createElement(table_1.TableHeader, null,
                                React.createElement(table_1.TableRow, null,
                                    React.createElement(table_1.TableHead, null, "Name"),
                                    React.createElement(table_1.TableHead, null, "Contact"),
                                    React.createElement(table_1.TableHead, null, "Company"),
                                    React.createElement(table_1.TableHead, null, "Source"),
                                    React.createElement(table_1.TableHead, null, "Status"),
                                    React.createElement(table_1.TableHead, { className: "w-16 text-right" }, "Actions"))),
                            React.createElement(table_1.TableBody, null, contacts.map(function (contact) { return (React.createElement(table_1.TableRow, { key: contact.id, className: "hover:bg-muted/40" },
                                React.createElement(table_1.TableCell, { className: "cursor-pointer font-medium", onClick: function () { return fetchContactDetail(contact.id); } },
                                    contact.first_name,
                                    " ",
                                    contact.last_name),
                                React.createElement(table_1.TableCell, null,
                                    React.createElement("div", { className: "space-y-1 text-sm" },
                                        contact.email && (React.createElement("div", { className: "flex items-center gap-2" },
                                            React.createElement(lucide_react_1.Mail, { className: "h-3.5 w-3.5 text-muted-foreground" }),
                                            contact.email)),
                                        contact.phone && (React.createElement("div", { className: "flex items-center gap-2" },
                                            React.createElement(lucide_react_1.Phone, { className: "h-3.5 w-3.5 text-muted-foreground" }),
                                            contact.phone)))),
                                React.createElement(table_1.TableCell, null, contact.company || "—"),
                                React.createElement(table_1.TableCell, null,
                                    React.createElement(badge_1.Badge, { variant: "outline" }, contact.contact_source)),
                                React.createElement(table_1.TableCell, null,
                                    React.createElement(badge_1.Badge, { variant: contact.status === "active" ? "default" : "secondary" }, contact.status)),
                                React.createElement(table_1.TableCell, { className: "text-right" },
                                    React.createElement(dropdown_menu_1.DropdownMenu, null,
                                        React.createElement(dropdown_menu_1.DropdownMenuTrigger, { asChild: true },
                                            React.createElement(button_1.Button, { variant: "ghost", size: "icon", className: "h-8 w-8" },
                                                React.createElement(lucide_react_1.MoreVertical, { className: "h-4 w-4" }))),
                                        React.createElement(dropdown_menu_1.DropdownMenuContent, { align: "end" },
                                            React.createElement(dropdown_menu_1.DropdownMenuItem, { onClick: function () { return fetchContactDetail(contact.id); }, className: "gap-2" },
                                                React.createElement(lucide_react_1.Eye, { className: "h-4 w-4" }),
                                                "View"),
                                            React.createElement(dropdown_menu_1.DropdownMenuItem, { onClick: function () { return fetchContactDetail(contact.id); }, className: "gap-2" },
                                                React.createElement(lucide_react_1.Pencil, { className: "h-4 w-4" }),
                                                "Edit"),
                                            React.createElement(dropdown_menu_1.DropdownMenuItem, { className: "text-destructive focus:text-destructive gap-2", onClick: function () { return setDeleteId(contact.id); } },
                                                React.createElement(lucide_react_1.Trash2, { className: "h-4 w-4" }),
                                                "Delete")))))); }))),
                        React.createElement("div", { className: "flex items-center justify-between border-t px-6 py-4 text-sm text-muted-foreground" },
                            React.createElement("div", null,
                                "Showing ",
                                (currentPage - 1) * perPage + 1,
                                "\u2013",
                                Math.min(currentPage * perPage, total),
                                " of ",
                                total),
                            React.createElement("div", { className: "flex gap-2" },
                                React.createElement(button_1.Button, { variant: "outline", size: "icon", disabled: currentPage === 1, onClick: function () { return setCurrentPage(function (p) { return Math.max(1, p - 1); }); } },
                                    React.createElement(lucide_react_1.ChevronLeft, { className: "h-4 w-4" })),
                                React.createElement(button_1.Button, { variant: "outline", size: "icon", disabled: currentPage * perPage >= total, onClick: function () { return setCurrentPage(function (p) { return p + 1; }); } },
                                    React.createElement(lucide_react_1.ChevronRight, { className: "h-4 w-4" })))))))),
                React.createElement(tabs_1.TabsContent, { value: "personas", className: "py-12 text-center text-muted-foreground" }, "Personas / segmentation view coming soon...")),
            React.createElement(alert_dialog_1.AlertDialog, { open: deleteId !== null, onOpenChange: function () { return setDeleteId(null); } },
                React.createElement(alert_dialog_1.AlertDialogContent, null,
                    React.createElement(alert_dialog_1.AlertDialogHeader, null,
                        React.createElement(alert_dialog_1.AlertDialogTitle, null, "Delete contact?"),
                        React.createElement(alert_dialog_1.AlertDialogDescription, null, "This action cannot be undone.")),
                    React.createElement(alert_dialog_1.AlertDialogFooter, null,
                        React.createElement(alert_dialog_1.AlertDialogCancel, null, "Cancel"),
                        React.createElement(alert_dialog_1.AlertDialogAction, { onClick: handleDelete, className: "bg-destructive hover:bg-destructive/90" }, "Delete")))),
            React.createElement(sheet_1.Sheet, { open: !!selectedContact, onOpenChange: function (open) {
                    if (!open) {
                        setSelectedContact(null);
                        setIsEditing(false);
                    }
                } },
                React.createElement(sheet_1.SheetContent, { className: "w-full sm:max-w-lg overflow-y-auto" }, selectedContact && (React.createElement(React.Fragment, null,
                    React.createElement(sheet_1.SheetHeader, { className: "mb-6" },
                        React.createElement(sheet_1.SheetTitle, null, isEditing ? "Edit Contact" : "Contact Details"),
                        React.createElement(sheet_1.SheetDescription, null, isEditing ? "Update contact information" : "View and manage contact")),
                    React.createElement("div", { className: "space-y-6" }, isEditing ? (
                    // ── EDIT FORM ───────────────────────────────────────────────
                    React.createElement("div", { className: "space-y-5 p-5" },
                        React.createElement("div", { className: "grid grid-cols-2 gap-4" },
                            React.createElement("div", null,
                                React.createElement("label", { className: "text-sm font-medium" }, "First Name"),
                                React.createElement(input_1.Input, { value: formData.first_name || "", onChange: function (e) {
                                        return setFormData(__assign(__assign({}, formData), { first_name: e.target.value }));
                                    }, className: "mt-1" })),
                            React.createElement("div", null,
                                React.createElement("label", { className: "text-sm font-medium" }, "Last Name"),
                                React.createElement(input_1.Input, { value: formData.last_name || "", onChange: function (e) {
                                        return setFormData(__assign(__assign({}, formData), { last_name: e.target.value }));
                                    }, className: "mt-1" }))),
                        React.createElement("div", null,
                            React.createElement("label", { className: "text-sm font-medium" }, "Email"),
                            React.createElement(input_1.Input, { type: "email", value: formData.email || "", onChange: function (e) {
                                    return setFormData(__assign(__assign({}, formData), { email: e.target.value }));
                                }, className: "mt-1" })),
                        React.createElement("div", null,
                            React.createElement("label", { className: "text-sm font-medium" }, "Phone"),
                            React.createElement(input_1.Input, { value: formData.phone || "", onChange: function (e) {
                                    return setFormData(__assign(__assign({}, formData), { phone: e.target.value }));
                                }, className: "mt-1" })),
                        React.createElement("div", null,
                            React.createElement("label", { className: "text-sm font-medium" }, "Company"),
                            React.createElement(input_1.Input, { value: formData.company || "", onChange: function (e) {
                                    return setFormData(__assign(__assign({}, formData), { company: e.target.value }));
                                }, className: "mt-1" })),
                        React.createElement("div", null,
                            React.createElement("label", { className: "text-sm font-medium" }, "Status"),
                            React.createElement(select_1.Select, { value: formData.status, onValueChange: function (v) {
                                    return setFormData(__assign(__assign({}, formData), { status: v }));
                                } },
                                React.createElement(select_1.SelectTrigger, { className: "mt-1" },
                                    React.createElement(select_1.SelectValue, null)),
                                React.createElement(select_1.SelectContent, null,
                                    React.createElement(select_1.SelectItem, { value: "active" }, "Active"),
                                    React.createElement(select_1.SelectItem, { value: "archived" }, "Archived")))))) : (
                    // ── VIEW MODE ───────────────────────────────────────────────
                    React.createElement("div", { className: "space-y-5 p-5" },
                        React.createElement("div", { className: "space-y-3" },
                            React.createElement("div", { className: "flex items-center gap-3" },
                                React.createElement(lucide_react_1.Mail, { className: "h-4 w-4 text-muted-foreground" }),
                                React.createElement("span", null, selectedContact.email || "—")),
                            React.createElement("div", { className: "flex items-center gap-3" },
                                React.createElement(lucide_react_1.Phone, { className: "h-4 w-4 text-muted-foreground" }),
                                React.createElement("span", null, selectedContact.phone || "—")),
                            React.createElement("div", { className: "flex items-center gap-3" },
                                React.createElement(lucide_react_1.Tag, { className: "h-4 w-4 text-muted-foreground" }),
                                React.createElement("span", null, selectedContact.company || "—")),
                            React.createElement("div", { className: "flex items-center gap-3" },
                                React.createElement(lucide_react_1.Calendar, { className: "h-4 w-4 text-muted-foreground" }),
                                React.createElement("span", null,
                                    "Created: ",
                                    new Date(selectedContact.created_at).toLocaleDateString()))),
                        React.createElement("div", null,
                            React.createElement("p", { className: "text-sm font-medium mb-1.5" }, "Status"),
                            React.createElement(badge_1.Badge, { variant: selectedContact.status === "active" ? "default" : "secondary" }, selectedContact.status)),
                        React.createElement("div", null,
                            React.createElement("p", { className: "text-sm font-medium mb-1.5" }, "Source"),
                            React.createElement(badge_1.Badge, { variant: "outline" },
                                selectedContact.contact_source,
                                " \u2022 ",
                                selectedContact.contact_type))))),
                    React.createElement(sheet_1.SheetFooter, { className: "mt-8 flex justify-end gap-3 sm:justify-end" }, isEditing ? (React.createElement(React.Fragment, null,
                        React.createElement(button_1.Button, { variant: "outline", onClick: function () { return setIsEditing(false); } },
                            React.createElement(lucide_react_1.X, { className: "h-4 w-4 mr-2" }),
                            "Cancel"),
                        React.createElement(button_1.Button, { onClick: handleUpdate },
                            React.createElement(lucide_react_1.Save, { className: "h-4 w-4 mr-2" }),
                            "Save Changes"))) : (React.createElement(React.Fragment, null,
                        React.createElement(button_1.Button, { variant: "outline", onClick: function () { return setSelectedContact(null); } }, "Close"),
                        React.createElement(button_1.Button, { onClick: function () { return setIsEditing(true); } },
                            React.createElement(lucide_react_1.Pencil, { className: "h-4 w-4 mr-2" }),
                            "Edit")))))))))));
}
exports["default"] = CustomersPage;
