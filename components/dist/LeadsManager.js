// components/LeadsManager.tsx
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
var react_1 = require("react");
function LeadsManager() {
    var _this = this;
    var _a = react_1.useState([]), leads = _a[0], setLeads = _a[1];
    var _b = react_1.useState(false), loading = _b[0], setLoading = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    var _d = react_1.useState({
        firstname: '',
        lastname: '',
        email: '',
        company: '',
        phone: ''
    }), formData = _d[0], setFormData = _d[1];
    // Fetch all leads
    var fetchLeads = function () { return __awaiter(_this, void 0, void 0, function () {
        var res, errorMsg, errData, _a, data, err_1;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 9, 10, 11]);
                    return [4 /*yield*/, fetch('/api/hubspot/leads', {
                            method: 'GET',
                            credentials: 'include'
                        })];
                case 2:
                    res = _c.sent();
                    if (!!res.ok) return [3 /*break*/, 7];
                    errorMsg = 'Failed to load leads';
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, res.json()];
                case 4:
                    errData = _c.sent();
                    errorMsg = errData.error || errorMsg;
                    return [3 /*break*/, 6];
                case 5:
                    _a = _c.sent();
                    // If not JSON, use status text
                    errorMsg = res.status + " " + res.statusText;
                    return [3 /*break*/, 6];
                case 6:
                    if (res.status === 401) {
                        errorMsg = 'Session expired. Please log in with HubSpot again.';
                    }
                    else if (res.status === 404) {
                        errorMsg = 'Leads object not found (404). Is the Leads object enabled in your HubSpot account? Try using Contacts instead.';
                    }
                    else if (res.status === 403) {
                        errorMsg = 'Permission denied (403). Check scopes or app authorization.';
                    }
                    setError(errorMsg);
                    setLeads([]);
                    return [2 /*return*/];
                case 7: return [4 /*yield*/, res.json()];
                case 8:
                    data = _c.sent();
                    setLeads(data.results || []);
                    return [3 /*break*/, 11];
                case 9:
                    err_1 = _c.sent();
                    console.error('Fetch error:', err_1);
                    setError(((_b = err_1.message) === null || _b === void 0 ? void 0 : _b.includes('Failed to fetch')) ? 'Network or CORS issue — check browser console and API route.'
                        : 'Unexpected error: ' + (err_1.message || 'Unknown'));
                    return [3 /*break*/, 11];
                case 10:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    }); };
    // Create new lead
    var handleCreateLead = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var res, err, err_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    e.preventDefault();
                    setError(null);
                    if (!((_a = formData.email) === null || _a === void 0 ? void 0 : _a.trim())) {
                        setError('Email is required');
                        return [2 /*return*/];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch('/api/hubspot/leads', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                properties: {
                                    firstname: formData.firstname.trim() || undefined,
                                    lastname: formData.lastname.trim() || undefined,
                                    email: formData.email.trim(),
                                    company: formData.company.trim() || undefined,
                                    phone: formData.phone.trim() || undefined
                                }
                            })
                        })];
                case 2:
                    res = _b.sent();
                    if (!!res.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, res.json()];
                case 3:
                    err = _b.sent();
                    throw new Error(err.error || 'Failed to create lead');
                case 4:
                    // Reset form
                    setFormData({
                        firstname: '',
                        lastname: '',
                        email: '',
                        company: '',
                        phone: ''
                    });
                    // Refresh list
                    return [4 /*yield*/, fetchLeads()];
                case 5:
                    // Refresh list
                    _b.sent();
                    alert('Lead created successfully!');
                    return [3 /*break*/, 7];
                case 6:
                    err_2 = _b.sent();
                    setError(err_2.message || 'Error creating lead');
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Load leads when component mounts
    react_1.useEffect(function () {
        fetchLeads();
    }, []);
    return (React.createElement("div", { className: "border border-gray-300 rounded-lg p-6 mt-6 bg-white shadow-sm" },
        React.createElement("div", { className: "flex justify-between items-center mb-4" },
            React.createElement("h2", { className: "text-xl font-semibold" }, "Leads Manager"),
            React.createElement("button", { onClick: fetchLeads, disabled: loading, className: "px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400 transition" }, loading ? 'Refreshing...' : 'Refresh Leads')),
        error && (React.createElement("div", { className: "mb-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded" }, error)),
        leads.length === 0 && !loading ? (React.createElement("p", { className: "text-gray-500 italic" }, "No leads found. Create one below.")) : (React.createElement("div", { className: "overflow-x-auto mb-8" },
            React.createElement("table", { className: "min-w-full divide-y divide-gray-200" },
                React.createElement("thead", { className: "bg-gray-50" },
                    React.createElement("tr", null,
                        React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Name"),
                        React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Email"),
                        React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Company"),
                        React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Phone"),
                        React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, "Created"))),
                React.createElement("tbody", { className: "bg-white divide-y divide-gray-200" }, leads.map(function (lead) { return (React.createElement("tr", { key: lead.id, className: "hover:bg-gray-50" },
                    React.createElement("td", { className: "px-6 py-4 whitespace-nowrap" },
                        lead.properties.firstname,
                        " ",
                        lead.properties.lastname),
                    React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" }, lead.properties.email || '—'),
                    React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" }, lead.properties.company || '—'),
                    React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" }, lead.properties.phone || '—'),
                    React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500" }, new Date(lead.createdAt).toLocaleDateString()))); }))))),
        React.createElement("div", { className: "mt-8" },
            React.createElement("h3", { className: "text-lg font-medium mb-4" }, "Create New Lead"),
            React.createElement("form", { onSubmit: handleCreateLead, className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium text-gray-700" }, "First Name"),
                    React.createElement("input", { type: "text", value: formData.firstname, onChange: function (e) { return setFormData(__assign(__assign({}, formData), { firstname: e.target.value })); }, className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" })),
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium text-gray-700" }, "Last Name"),
                    React.createElement("input", { type: "text", value: formData.lastname, onChange: function (e) { return setFormData(__assign(__assign({}, formData), { lastname: e.target.value })); }, className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" })),
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium text-gray-700" },
                        "Email ",
                        React.createElement("span", { className: "text-red-600" }, "*")),
                    React.createElement("input", { type: "email", value: formData.email, onChange: function (e) { return setFormData(__assign(__assign({}, formData), { email: e.target.value })); }, required: true, className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" })),
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium text-gray-700" }, "Company"),
                    React.createElement("input", { type: "text", value: formData.company, onChange: function (e) { return setFormData(__assign(__assign({}, formData), { company: e.target.value })); }, className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" })),
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium text-gray-700" }, "Phone"),
                    React.createElement("input", { type: "text", value: formData.phone, onChange: function (e) { return setFormData(__assign(__assign({}, formData), { phone: e.target.value })); }, className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" })),
                React.createElement("div", { className: "md:col-span-2 mt-4" },
                    React.createElement("button", { type: "submit", disabled: loading, className: "px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition" }, loading ? 'Creating...' : 'Create Lead'))))));
}
exports["default"] = LeadsManager;
