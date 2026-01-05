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
var React = require("react");
var layout_1 = require("@/components/dashboard/layout");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var badge_1 = require("@/components/ui/badge");
var select_1 = require("@/components/ui/select");
var table_1 = require("@/components/ui/table");
var dropdown_menu_1 = require("@/components/ui/dropdown-menu");
var lucide_react_1 = require("lucide-react");
var link_1 = require("next/link");
var axiosClient_1 = require("@/lib/axiosClient");
var showToast_1 = require("@/lib/showToast");
var date_fns_1 = require("date-fns");
var statusBadge = function (isActive) {
    return isActive ? (React.createElement(badge_1.Badge, { className: "bg-green-100 text-green-700" }, "Active")) : (React.createElement(badge_1.Badge, { variant: "secondary" }, "Inactive"));
};
function EventsPage() {
    var _this = this;
    var _a = React.useState([]), events = _a[0], setEvents = _a[1];
    var _b = React.useState(true), loading = _b[0], setLoading = _b[1];
    var _c = React.useState(""), searchQuery = _c[0], setSearchQuery = _c[1];
    var _d = React.useState("all"), activeFilter = _d[0], setActiveFilter = _d[1];
    var _e = React.useState(1), page = _e[0], setPage = _e[1];
    var perPage = React.useState(10)[0];
    var _f = React.useState(0), total = _f[0], setTotal = _f[1];
    var fetchEvents = function () { return __awaiter(_this, void 0, void 0, function () {
        var params, response, error_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setLoading(true);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    params = {
                        page: page,
                        per_page: perPage
                    };
                    if (searchQuery)
                        params.search = searchQuery;
                    if (activeFilter !== "all")
                        params.is_active = activeFilter;
                    return [4 /*yield*/, axiosClient_1["default"].get("/events", { params: params })];
                case 2:
                    response = _c.sent();
                    setEvents(response.data.data || []);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _c.sent();
                    showToast_1.showToast(((_b = (_a = error_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Failed to load events", "error");
                    setEvents([]);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    React.useEffect(function () {
        fetchEvents();
    }, [searchQuery, activeFilter, page]);
    var handleDelete = function (id) { return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!confirm("Are you sure you want to delete this event? This cannot be undone."))
                        return [2 /*return*/];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axiosClient_1["default"]["delete"]("/events/" + id)];
                case 2:
                    _c.sent();
                    showToast_1.showToast("Event deleted successfully", "success");
                    fetchEvents();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _c.sent();
                    showToast_1.showToast(((_b = (_a = error_2.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Failed to delete event", "error");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleToggleActive = function (id, current) { return __awaiter(_this, void 0, void 0, function () {
        var error_3;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    if (!!current) return [3 /*break*/, 2];
                    return [4 /*yield*/, axiosClient_1["default"].patch("/events/" + id + "/activate")];
                case 1:
                    _c.sent();
                    showToast_1.showToast("Event activated successfully", "success");
                    return [3 /*break*/, 4];
                case 2: 
                // To deactivate, just update is_active to false (backend will allow only one active)
                return [4 /*yield*/, axiosClient_1["default"].patch("/events/" + id, { is_active: false })];
                case 3:
                    // To deactivate, just update is_active to false (backend will allow only one active)
                    _c.sent();
                    showToast_1.showToast("Event deactivated", "success");
                    _c.label = 4;
                case 4:
                    fetchEvents();
                    return [3 /*break*/, 6];
                case 5:
                    error_3 = _c.sent();
                    showToast_1.showToast(((_b = (_a = error_3.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Failed to update event status", "error");
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    ///events/${event.id}/analytics
    return (React.createElement(layout_1.DashboardLayout, null,
        React.createElement("div", { className: "space-y-6" },
            React.createElement("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" },
                React.createElement("div", null,
                    React.createElement("h1", { className: "text-3xl font-bold text-foreground" }, "Events"),
                    React.createElement("p", { className: "text-sm text-muted-foreground mt-1" }, "Manage your exhibitions. Only one event can be active at a time.")),
                React.createElement(link_1["default"], { href: "/events/new" },
                    React.createElement(button_1.Button, { className: "gap-2" },
                        React.createElement(lucide_react_1.Plus, { className: "h-4 w-4" }),
                        "Create Event"))),
            React.createElement("div", { className: "flex flex-col gap-4 rounded-xl border border-slate-200 bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between" },
                React.createElement("div", { className: "relative flex-1 max-w-md" },
                    React.createElement(lucide_react_1.Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
                    React.createElement(input_1.Input, { placeholder: "Search events...", value: searchQuery, onChange: function (e) { return setSearchQuery(e.target.value); }, className: "pl-10" })),
                React.createElement(select_1.Select, { value: activeFilter, onValueChange: function (v) { return setActiveFilter(v); } },
                    React.createElement(select_1.SelectTrigger, { className: "w-[160px]" },
                        React.createElement(select_1.SelectValue, { placeholder: "Status" })),
                    React.createElement(select_1.SelectContent, null,
                        React.createElement(select_1.SelectItem, { value: "all" }, "All Events"),
                        React.createElement(select_1.SelectItem, { value: "true" }, "Active Only"),
                        React.createElement(select_1.SelectItem, { value: "false" }, "Inactive Only")))),
            React.createElement("div", { className: "rounded-xl border border-slate-200 bg-card shadow-sm overflow-hidden p-4" },
                React.createElement(table_1.Table, null,
                    React.createElement(table_1.TableHeader, null,
                        React.createElement(table_1.TableRow, { className: "hover:bg-transparent" },
                            React.createElement(table_1.TableHead, null, "Event Name"),
                            React.createElement(table_1.TableHead, null, "Location"),
                            React.createElement(table_1.TableHead, null, "Dates"),
                            React.createElement(table_1.TableHead, null, "Booth"),
                            React.createElement(table_1.TableHead, null, "Status"),
                            React.createElement(table_1.TableHead, { className: "text-right" }, "Actions"))),
                    React.createElement(table_1.TableBody, null, loading ? (React.createElement(table_1.TableRow, null,
                        React.createElement(table_1.TableCell, { colSpan: 6, className: "text-center py-8" }, "Loading events..."))) : events.length === 0 ? (React.createElement(table_1.TableRow, null,
                        React.createElement(table_1.TableCell, { colSpan: 6, className: "text-center py-8 text-muted-foreground" }, "No events found. Create your first event!"))) : (events.map(function (event) { return (React.createElement(table_1.TableRow, { key: event.id },
                        React.createElement(table_1.TableCell, { className: "font-medium" },
                            React.createElement(link_1["default"], { href: "/events/" + event.id, className: "hover:text-primary hover:underline" }, event.name)),
                        React.createElement(table_1.TableCell, null, event.location ? (React.createElement("div", { className: "flex items-center gap-1 text-sm" },
                            React.createElement(lucide_react_1.MapPin, { className: "h-3 w-3 text-muted-foreground" }),
                            event.location)) : (React.createElement("span", { className: "text-muted-foreground" }, "-"))),
                        React.createElement(table_1.TableCell, null, event.start_date || event.end_date ? (React.createElement("div", { className: "flex items-center gap-1 text-sm" },
                            React.createElement(lucide_react_1.Calendar, { className: "h-3 w-3 text-muted-foreground" }),
                            event.start_date && date_fns_1.format(new Date(event.start_date), "MMM d"),
                            event.end_date && " - " + date_fns_1.format(new Date(event.end_date), "MMM d, yyyy"))) : (React.createElement("span", { className: "text-muted-foreground" }, "-"))),
                        React.createElement(table_1.TableCell, null, event.booth ? (React.createElement(badge_1.Badge, { variant: "outline" }, event.booth.booth_name)) : (React.createElement("span", { className: "text-muted-foreground" }, "No booth"))),
                        React.createElement(table_1.TableCell, null, statusBadge(event.is_active)),
                        React.createElement(table_1.TableCell, { className: "text-right" },
                            React.createElement(dropdown_menu_1.DropdownMenu, null,
                                React.createElement(dropdown_menu_1.DropdownMenuTrigger, { asChild: true },
                                    React.createElement(button_1.Button, { variant: "ghost", size: "icon" },
                                        React.createElement(lucide_react_1.MoreVertical, { className: "h-4 w-4" }))),
                                React.createElement(dropdown_menu_1.DropdownMenuContent, { align: "end" },
                                    React.createElement(link_1["default"], { href: "/events/" + event.id + "/edit" },
                                        React.createElement(dropdown_menu_1.DropdownMenuItem, null,
                                            React.createElement(lucide_react_1.Edit, { className: "mr-2 h-4 w-4" }),
                                            "Edit")),
                                    React.createElement(link_1["default"], { href: "/" },
                                        React.createElement(dropdown_menu_1.DropdownMenuItem, null,
                                            React.createElement(lucide_react_1.BarChart3, { className: "mr-2 h-4 w-4" }),
                                            "Analytics")),
                                    React.createElement(dropdown_menu_1.DropdownMenuItem, { onSelect: function () { return handleToggleActive(event.id, event.is_active); } }, event.is_active ? (React.createElement(React.Fragment, null,
                                        React.createElement(lucide_react_1.ToggleLeft, { className: "mr-2 h-4 w-4" }),
                                        "Deactivate")) : (React.createElement(React.Fragment, null,
                                        React.createElement(lucide_react_1.ToggleRight, { className: "mr-2 h-4 w-4" }),
                                        "Activate"))),
                                    React.createElement(dropdown_menu_1.DropdownMenuSeparator, null),
                                    React.createElement(dropdown_menu_1.DropdownMenuItem, { className: "text-destructive", onSelect: function () { return handleDelete(event.id); } },
                                        React.createElement(lucide_react_1.Trash2, { className: "mr-2 h-4 w-4" }),
                                        "Delete")))))); })))),
                React.createElement("div", { className: "flex items-center justify-between border-t border-slate-200 px-6 py-4" },
                    React.createElement("div", { className: "text-sm text-muted-foreground" },
                        "Showing ",
                        events.length,
                        " event(s)"),
                    React.createElement("div", { className: "flex items-center gap-2" },
                        React.createElement(button_1.Button, { variant: "outline", size: "icon", onClick: function () { return setPage(function (p) { return Math.max(1, p - 1); }); }, disabled: page === 1 },
                            React.createElement(lucide_react_1.ChevronLeft, { className: "h-4 w-4" })),
                        React.createElement(button_1.Button, { variant: "outline", size: "icon", onClick: function () { return setPage(function (p) { return p + 1; }); }, disabled: events.length < perPage },
                            React.createElement(lucide_react_1.ChevronRight, { className: "h-4 w-4" }))))))));
}
exports["default"] = EventsPage;
