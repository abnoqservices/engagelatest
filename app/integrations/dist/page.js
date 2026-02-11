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
var layout_1 = require("@/components/dashboard/layout");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var tabs_1 = require("@/components/ui/tabs");
var switch_1 = require("@/components/ui/switch");
var alert_dialog_1 = require("@/components/ui/alert-dialog");
var lucide_react_1 = require("lucide-react");
var axiosClient_1 = require("@/lib/axiosClient");
var showToast_1 = require("@/lib/showToast");
var HubSpotLoginButton_1 = require("@/components/HubSpotLoginButton");
function IntegrationsPage() {
    var _this = this;
    var _a = react_1.useState([]), whatsappAccounts = _a[0], setWhatsappAccounts = _a[1];
    var _b = react_1.useState(false), loading = _b[0], setLoading = _b[1];
    var _c = react_1.useState(false), connecting = _c[0], setConnecting = _c[1];
    var _d = react_1.useState(false), disconnectDialogOpen = _d[0], setDisconnectDialogOpen = _d[1];
    var _e = react_1.useState(null), accountToDisconnect = _e[0], setAccountToDisconnect = _e[1];
    // HubSpot state
    var _f = react_1.useState(false), hubspotConnected = _f[0], setHubspotConnected = _f[1];
    var _g = react_1.useState(null), hubspotExpiry = _g[0], setHubspotExpiry = _g[1];
    var _h = react_1.useState(null), hubspotToken = _h[0], setHubspotToken = _h[1]; // better as string
    var _j = react_1.useState(true), hubspotStatusLoading = _j[0], setHubspotStatusLoading = _j[1];
    var _k = react_1.useState("communication"), activeTab = _k[0], setActiveTab = _k[1];
    // ────────────────────────────────────────────────
    // Fetch HubSpot status
    // ────────────────────────────────────────────────
    var fetchHubSpotStatus = react_1.useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var res, data, err_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, 4, 5]);
                    setHubspotStatusLoading(true);
                    return [4 /*yield*/, fetch("/api/hubspot/status")];
                case 1:
                    res = _c.sent();
                    if (!res.ok)
                        throw new Error("Status fetch failed");
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _c.sent();
                    setHubspotConnected(!!data.connected);
                    setHubspotExpiry((_a = data.expiresIn) !== null && _a !== void 0 ? _a : null);
                    setHubspotToken((_b = data.token) !== null && _b !== void 0 ? _b : null);
                    // Optional: show current status on load (only once)
                    if (data.connected) {
                        showToast_1.showToast("HubSpot is connected", "success");
                    }
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _c.sent();
                    console.error("Failed to fetch HubSpot status", err_1);
                    showToast_1.showToast("Could not check HubSpot connection status", "error");
                    return [3 /*break*/, 5];
                case 4:
                    setHubspotStatusLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, []);
    react_1.useEffect(function () {
        fetchHubSpotStatus();
        var params = new URLSearchParams(window.location.search);
        /* CRM TAB ACTIVATION */
        var tabParam = params.get("tab");
        if (tabParam) {
            setActiveTab(tabParam);
        }
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: "1954879162132993",
                cookie: true,
                xfbml: true,
                version: "v24.0"
            });
        };
        (function (d, s, id) {
            if (d.getElementById(id))
                return;
            var js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            d.getElementsByTagName(s)[0].parentNode.insertBefore(js, null);
        })(document, "script", "facebook-jssdk");
        // Handle WhatsApp OAuth callback
        var urlParams = new URLSearchParams(window.location.search);
        var whatsappStatus = urlParams.get('whatsapp');
        if (whatsappStatus === 'connected') {
            showToast_1.showToast('WhatsApp account connected successfully!', 'success');
            // Remove query param from URL
            window.history.replaceState({}, '', '/integrations');
            // Reload accounts
            loadWhatsAppAccounts();
        }
        else if (whatsappStatus === 'error') {
            var msg = urlParams.get('message') || 'Failed to connect WhatsApp account';
            showToast_1.showToast(msg, 'error');
            window.history.replaceState({}, '', '/integrations');
        }
    }, [fetchHubSpotStatus]);
    var loadWhatsAppAccounts = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    return [4 /*yield*/, axiosClient_1["default"].get('/whatsapp/accounts')];
                case 1:
                    response = _a.sent();
                    if (response.data.success) {
                        setWhatsappAccounts(response.data.data || []);
                    }
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _a.sent();
                    console.error('Failed to load WhatsApp accounts:', error_1);
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleConnectWhatsApp = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, error_2;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    setConnecting(true);
                    return [4 /*yield*/, axiosClient_1["default"].get('/whatsapp/auth-url')];
                case 1:
                    response = _c.sent();
                    if (response.data.success) {
                        // Redirect to Meta OAuth
                        window.location.href = response.data.data.auth_url;
                    }
                    else {
                        showToast_1.showToast(response.data.message || 'Failed to initiate WhatsApp connection', 'error');
                        setConnecting(false);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _c.sent();
                    showToast_1.showToast(((_b = (_a = error_2.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Failed to initiate WhatsApp connection', 'error');
                    setConnecting(false);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleDisconnectClick = function (accountId) {
        setAccountToDisconnect(accountId);
        setDisconnectDialogOpen(true);
    };
    var handleDisconnect = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_3;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!accountToDisconnect)
                        return [2 /*return*/];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axiosClient_1["default"]["delete"]("/whatsapp/accounts/" + accountToDisconnect)];
                case 2:
                    _c.sent();
                    showToast_1.showToast('WhatsApp account disconnected', 'success');
                    setDisconnectDialogOpen(false);
                    setAccountToDisconnect(null);
                    loadWhatsAppAccounts();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _c.sent();
                    showToast_1.showToast(((_b = (_a = error_3.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Failed to disconnect', 'error');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // ────────────────────────────────────────────────
    // NEW: Call this when HubSpot disconnect happens
    // (You need to implement disconnect logic in HubSpotLoginButton)
    // ────────────────────────────────────────────────
    var handleHubSpotDisconnectSuccess = function () {
        showToast_1.showToast("HubSpot disconnected successfully", "success");
        fetchHubSpotStatus(); // ← refresh status → UI updates
    };
    var isWhatsAppConnected = whatsappAccounts.some(function (acc) { return acc.status === 'connected'; });
    return (React.createElement(layout_1.DashboardLayout, null,
        React.createElement("div", { className: "space-y-6" },
            React.createElement("div", null,
                React.createElement("h1", { className: "text-3xl font-bold text-foreground" }, "Integrations"),
                React.createElement("p", { className: "text-muted-foreground mt-2" }, "Connect EngageIQ with your CRM, Marketing Automation, and Communication tools")),
            React.createElement(tabs_1.Tabs, { value: activeTab, onValueChange: setActiveTab, className: "space-y-6" },
                React.createElement(tabs_1.TabsList, null,
                    React.createElement(tabs_1.TabsTrigger, { value: "crm" }, "CRM Systems"),
                    React.createElement(tabs_1.TabsTrigger, { value: "marketing" }, "Marketing Automation"),
                    React.createElement(tabs_1.TabsTrigger, { value: "communication" }, "Communication")),
                React.createElement(tabs_1.TabsContent, { value: "crm", className: "space-y-6" },
                    React.createElement("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3" },
                        React.createElement(card_1.Card, null,
                            React.createElement(card_1.CardHeader, null,
                                React.createElement("div", { className: "flex items-start justify-between" },
                                    React.createElement("div", null,
                                        React.createElement(card_1.CardTitle, { className: "text-base flex items-center gap-2" },
                                            "HubSpot CRM",
                                            hubspotConnected && (React.createElement(lucide_react_1.CheckCircle2, { className: "h-4 w-4 text-green-600" }))),
                                        React.createElement(card_1.CardDescription, null, hubspotConnected ? "Connected" : "Not connected")),
                                    React.createElement(switch_1.Switch, { checked: hubspotConnected, disabled: true }))),
                            React.createElement(card_1.CardContent, null,
                                React.createElement("p", { className: "text-sm font-medium" }, "Features:"),
                                React.createElement("div", { className: "flex flex-wrap gap-2 mt-2" },
                                    React.createElement(badge_1.Badge, { variant: "secondary" }, "Contacts sync"),
                                    React.createElement(badge_1.Badge, { variant: "secondary" }, "Deal sync"),
                                    React.createElement(badge_1.Badge, { variant: "secondary" }, "Workflows")),
                                hubspotConnected && hubspotExpiry && (React.createElement("p", { className: "text-xs text-muted-foreground mt-4" },
                                    "Token expires in ~",
                                    Math.round(hubspotExpiry / 3600),
                                    " hours"))),
                            React.createElement(card_1.CardFooter, null,
                                React.createElement(HubSpotLoginButton_1["default"], { connected: hubspotConnected, onDisconnectSuccess: handleHubSpotDisconnectSuccess }))),
                        React.createElement(card_1.Card, null,
                            React.createElement(card_1.CardHeader, null,
                                React.createElement("div", { className: "flex items-start justify-between" },
                                    React.createElement("div", null,
                                        React.createElement(card_1.CardTitle, { className: "text-base" }, "Salesforce"),
                                        React.createElement(card_1.CardDescription, null, "REST API")),
                                    React.createElement(switch_1.Switch, null))),
                            React.createElement(card_1.CardContent, null,
                                React.createElement("p", { className: "text-sm font-medium" }, "Features:"),
                                React.createElement("div", { className: "flex flex-wrap gap-2 mt-2" },
                                    React.createElement(badge_1.Badge, { variant: "secondary", className: "text-xs" }, "Contact sync"),
                                    React.createElement(badge_1.Badge, { variant: "secondary", className: "text-xs" }, "Campaign attribution"))),
                            React.createElement(card_1.CardFooter, null,
                                React.createElement(button_1.Button, { size: "sm", className: "w-full" },
                                    React.createElement(lucide_react_1.Plug, { className: "h-4 w-4 mr-2" }),
                                    "Connect"))),
                        React.createElement(card_1.Card, null,
                            React.createElement(card_1.CardHeader, null,
                                React.createElement("div", { className: "flex items-start justify-between" },
                                    React.createElement("div", null,
                                        React.createElement(card_1.CardTitle, { className: "text-base flex items-center gap-2" },
                                            "Zoho CRM",
                                            React.createElement(lucide_react_1.CheckCircle2, { className: "h-4 w-4 text-green-600" })),
                                        React.createElement(card_1.CardDescription, null, "API")),
                                    React.createElement(switch_1.Switch, { checked: true }))),
                            React.createElement(card_1.CardContent, null,
                                React.createElement("p", { className: "text-sm font-medium" }, "Features:"),
                                React.createElement("div", { className: "flex flex-wrap gap-2 mt-2" },
                                    React.createElement(badge_1.Badge, { variant: "secondary", className: "text-xs" }, "Lead push"),
                                    React.createElement(badge_1.Badge, { variant: "secondary", className: "text-xs" }, "Contact mapping"),
                                    React.createElement(badge_1.Badge, { variant: "secondary", className: "text-xs" }, "Field sync"))),
                            React.createElement(card_1.CardFooter, null,
                                React.createElement(button_1.Button, { variant: "outline", size: "sm", className: "w-full" },
                                    React.createElement(lucide_react_1.Settings, { className: "h-4 w-4 mr-2" }),
                                    "Configure")))),
                    React.createElement(card_1.Card, null,
                        React.createElement(card_1.CardHeader, null,
                            React.createElement(card_1.CardTitle, null, "CRM Integration Features"),
                            React.createElement(card_1.CardDescription, null, "What you get with CRM integrations")),
                        React.createElement(card_1.CardContent, null,
                            React.createElement("div", { className: "grid gap-4 md:grid-cols-2" }, [
                                "Real-time lead push from EngageIQ",
                                "Sync product/event/booth metadata",
                                "Map EngageIQ fields to CRM fields",
                                "Automatic deduplication",
                                "Tag-based routing",
                                "AI-score sync to CRM",
                            ].map(function (feature, i) { return (React.createElement("div", { key: i, className: "flex items-start gap-3" },
                                React.createElement(lucide_react_1.CheckCircle2, { className: "h-5 w-5 text-primary mt-0.5" }),
                                React.createElement("span", { className: "text-sm" }, feature))); }))))),
                React.createElement(tabs_1.TabsContent, { value: "marketing", className: "space-y-6" },
                    React.createElement("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3" }, [
                        { name: "Mailchimp", features: ["Email lists", "Auto-tags", "Campaigns"], connected: true },
                        { name: "Klaviyo", features: ["E-commerce flows", "Segmentation"], connected: false },
                        { name: "ActiveCampaign", features: ["Email/SMS automations", "Lead scoring"], connected: false },
                        { name: "Marketo", features: ["Enterprise marketing ops", "Lead programs"], connected: false },
                        { name: "Brevo (Sendinblue)", features: ["Transactional emails", "Campaign sync"], connected: true },
                        { name: "ConvertKit", features: ["Creator-based campaigns"], connected: false },
                        { name: "GetResponse", features: ["Automation workflows", "Funnels"], connected: false },
                        { name: "Customer.io", features: ["Event-driven communication"], connected: false },
                    ].map(function (integration, i) { return (React.createElement(card_1.Card, { key: i },
                        React.createElement(card_1.CardHeader, null,
                            React.createElement("div", { className: "flex items-start justify-between" },
                                React.createElement("div", null,
                                    React.createElement(card_1.CardTitle, { className: "text-base flex items-center gap-2" },
                                        integration.name,
                                        integration.connected && (React.createElement(lucide_react_1.CheckCircle2, { className: "h-4 w-4 text-green-600" })))),
                                React.createElement(switch_1.Switch, { checked: integration.connected }))),
                        React.createElement(card_1.CardContent, null,
                            React.createElement("div", { className: "space-y-2" },
                                React.createElement("p", { className: "text-sm font-medium" }, "Features:"),
                                React.createElement("div", { className: "flex flex-wrap gap-2" }, integration.features.map(function (feature, j) { return (React.createElement(badge_1.Badge, { key: j, variant: "secondary", className: "text-xs" }, feature)); })))),
                        React.createElement(card_1.CardFooter, null, integration.connected ? (React.createElement(button_1.Button, { variant: "outline", size: "sm", className: "w-full" },
                            React.createElement(lucide_react_1.Settings, { className: "h-4 w-4 mr-2" }),
                            "Configure")) : (React.createElement(button_1.Button, { size: "sm", className: "w-full" },
                            React.createElement(lucide_react_1.Plug, { className: "h-4 w-4 mr-2" }),
                            "Connect"))))); }))),
                React.createElement(tabs_1.TabsContent, { value: "communication", className: "space-y-6" },
                    React.createElement(card_1.Card, null,
                        React.createElement(card_1.CardHeader, null,
                            React.createElement("div", { className: "flex items-start justify-between" },
                                React.createElement("div", null,
                                    React.createElement(card_1.CardTitle, { className: "text-base flex items-center gap-2" },
                                        "WhatsApp Cloud API",
                                        isWhatsAppConnected && (React.createElement(lucide_react_1.CheckCircle2, { className: "h-4 w-4 text-green-600" }))),
                                    React.createElement(card_1.CardDescription, { className: "mt-2" }, "Automated messages & campaigns via WhatsApp Business API")),
                                React.createElement(switch_1.Switch, { checked: isWhatsAppConnected, disabled: true }))),
                        React.createElement(card_1.CardContent, null, loading ? (React.createElement("div", { className: "flex items-center justify-center py-4" },
                            React.createElement(lucide_react_1.Loader2, { className: "h-5 w-5 animate-spin text-muted-foreground" }))) : whatsappAccounts.length > 0 ? (React.createElement("div", { className: "space-y-3" }, whatsappAccounts.map(function (account) { return (React.createElement("div", { key: account.id, className: "flex items-center justify-between p-3 border rounded-lg bg-muted/50" },
                            React.createElement("div", { className: "flex-1" },
                                React.createElement("div", { className: "flex items-center gap-2" },
                                    React.createElement("p", { className: "font-medium" }, account.phone_number),
                                    React.createElement(badge_1.Badge, { variant: account.status === 'connected' ? 'default' : 'secondary', className: "text-xs" }, account.status)),
                                account.business_account_name && (React.createElement("p", { className: "text-sm text-muted-foreground mt-1" }, account.business_account_name)),
                                account.created_at && (React.createElement("p", { className: "text-xs text-muted-foreground mt-1" },
                                    "Connected ",
                                    new Date(account.created_at).toLocaleDateString()))),
                            React.createElement(button_1.Button, { variant: "ghost", size: "sm", onClick: function () { return handleDisconnectClick(account.id); }, className: "ml-4" },
                                React.createElement(lucide_react_1.Trash2, { className: "h-4 w-4 text-destructive" })))); }))) : (React.createElement("div", { className: "py-4 text-center" },
                            React.createElement("p", { className: "text-sm text-muted-foreground" }, "No WhatsApp accounts connected. Click \"Connect WhatsApp\" to get started.")))),
                        React.createElement(card_1.CardFooter, null, isWhatsAppConnected ? (React.createElement(button_1.Button, { variant: "outline", size: "sm", className: "w-full", onClick: handleConnectWhatsApp, disabled: connecting }, connecting ? (React.createElement(React.Fragment, null,
                            React.createElement(lucide_react_1.Loader2, { className: "h-4 w-4 mr-2 animate-spin" }),
                            "Connecting...")) : (React.createElement(React.Fragment, null,
                            React.createElement(lucide_react_1.Plug, { className: "h-4 w-4 mr-2" }),
                            "Add Another Account")))) : (React.createElement(button_1.Button, { size: "sm", className: "w-full", onClick: handleConnectWhatsApp, disabled: connecting }, connecting ? (React.createElement(React.Fragment, null,
                            React.createElement(lucide_react_1.Loader2, { className: "h-4 w-4 mr-2 animate-spin" }),
                            "Connecting...")) : (React.createElement(React.Fragment, null,
                            React.createElement(lucide_react_1.Plug, { className: "h-4 w-4 mr-2" }),
                            "Connect WhatsApp")))))),
                    React.createElement("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3" }, [
                        { name: "SMS Gateways", purpose: "Transactional notifications", connected: true },
                        { name: "Email SMTP Providers", purpose: "Email delivery automation", connected: true },
                        { name: "Meta Pixel", purpose: "Retargeting", connected: false },
                        { name: "Google Analytics 4", purpose: "Page tracking & conversions", connected: true },
                    ].map(function (integration, i) { return (React.createElement(card_1.Card, { key: i },
                        React.createElement(card_1.CardHeader, null,
                            React.createElement("div", { className: "flex items-start justify-between" },
                                React.createElement("div", null,
                                    React.createElement(card_1.CardTitle, { className: "text-base flex items-center gap-2" },
                                        integration.name,
                                        integration.connected && (React.createElement(lucide_react_1.CheckCircle2, { className: "h-4 w-4 text-green-600" }))),
                                    React.createElement(card_1.CardDescription, { className: "mt-2" }, integration.purpose)),
                                React.createElement(switch_1.Switch, { checked: integration.connected }))),
                        React.createElement(card_1.CardFooter, null, integration.connected ? (React.createElement(button_1.Button, { variant: "outline", size: "sm", className: "w-full" },
                            React.createElement(lucide_react_1.Settings, { className: "h-4 w-4 mr-2" }),
                            "Configure")) : (React.createElement(button_1.Button, { size: "sm", className: "w-full" },
                            React.createElement(lucide_react_1.Plug, { className: "h-4 w-4 mr-2" }),
                            "Connect"))))); })))),
            React.createElement(alert_dialog_1.AlertDialog, { open: disconnectDialogOpen, onOpenChange: setDisconnectDialogOpen },
                React.createElement(alert_dialog_1.AlertDialogContent, null,
                    React.createElement(alert_dialog_1.AlertDialogHeader, null,
                        React.createElement(alert_dialog_1.AlertDialogTitle, null, "Disconnect WhatsApp Account?"),
                        React.createElement(alert_dialog_1.AlertDialogDescription, null, "Are you sure you want to disconnect this WhatsApp account? You won't be able to send WhatsApp messages through workflows until you reconnect an account.")),
                    React.createElement(alert_dialog_1.AlertDialogFooter, null,
                        React.createElement(alert_dialog_1.AlertDialogCancel, { onClick: function () { return setAccountToDisconnect(null); } }, "Cancel"),
                        React.createElement(alert_dialog_1.AlertDialogAction, { onClick: handleDisconnect, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90" }, "Disconnect")))))));
}
exports["default"] = IntegrationsPage;
