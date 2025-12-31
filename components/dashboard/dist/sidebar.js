"use client";
"use strict";
exports.__esModule = true;
exports.Sidebar = void 0;
var React = require("react");
var link_1 = require("next/link");
var navigation_1 = require("next/navigation");
var lucide_react_1 = require("lucide-react");
var utils_1 = require("@/lib/utils");
var button_1 = require("@/components/ui/button");
var collapsible_1 = require("@/components/ui/collapsible");
var navigation = [
    { name: "Dashboard", href: "/dashboard", icon: lucide_react_1.BarChartBig },
    {
        name: "Products",
        href: "/products",
        icon: lucide_react_1.Package,
        children: [
            { name: "List", href: "/products" },
            { name: "Add Product", href: "/products/new" },
            { name: "Bulk Import", href: "/products/import" },
            {
                name: "Settings",
                children: [
                    { name: "Product Category", href: "/products/settings/product-category" },
                    { name: "Custom Fields", href: "/products/settings/custom-fields" },
                    { name: "QR Code Templates", href: "/products/settings/qr-codes" },
                ]
            },
        ]
    },
    {
        name: "Events",
        href: "/events",
        icon: lucide_react_1.Calendar,
        children: [
            { name: "List", href: "/events" },
            { name: "Create Event", href: "/events/new" },
            { name: "Booths", href: "/events/booths" },
        ]
    },
    {
        name: "Landing Pages",
        href: "/landing-pages",
        icon: lucide_react_1.Layout,
        children: [
            { name: "List", href: "/landing-pages" },
            { name: "Create New", href: "/landing-pages/new" },
        ]
    },
    { name: "Catalogs", href: "/catalogs", icon: lucide_react_1.BookOpen },
    { name: "Forms", href: "/forms", icon: lucide_react_1.FileText },
    { name: "Workflows", href: "/workflows", icon: lucide_react_1.GitBranch },
    { name: "Campaigns", href: "/campaigns", icon: lucide_react_1.Megaphone },
    { name: "Offers", href: "/offers", icon: lucide_react_1.Percent },
    {
        name: "Customers",
        href: "/customers",
        icon: lucide_react_1.Users,
        children: [
            { name: "List", href: "/customers" },
            { name: "Personas", href: "/customers/personas" },
        ]
    },
    { name: "Analytics", href: "/analytics", icon: lucide_react_1.BarChart3 },
    { name: "Integrations", href: "/integrations", icon: lucide_react_1.Plug },
    { name: "Settings", href: "/settings", icon: lucide_react_1.Settings },
];
function Sidebar(_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose;
    var pathname = navigation_1.usePathname();
    return (React.createElement(React.Fragment, null,
        isOpen && (React.createElement("div", { className: "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden", onClick: onClose })),
        React.createElement("aside", { className: utils_1.cn("fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0", isOpen ? "translate-x-0" : "-translate-x-full") },
            React.createElement("div", { className: "flex h-full flex-col overflow-hidden" },
                React.createElement("div", { className: "flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-6" },
                    React.createElement(link_1["default"], { href: "/dashboard", className: "flex items-center gap-2" },
                        React.createElement("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600" },
                            React.createElement(lucide_react_1.BarChartBig, { className: "h-5 w-5 text-white" })),
                        React.createElement("span", { className: "text-xl font-bold text-gray-900" }, "EngageIQ")),
                    React.createElement(button_1.Button, { variant: "ghost", size: "icon", className: "lg:hidden text-gray-700", onClick: onClose },
                        React.createElement(lucide_react_1.X, { className: "h-5 w-5" }))),
                React.createElement("nav", { className: "flex-1 min-h-0 overflow-y-auto px-4 py-4" },
                    React.createElement("p", { className: "text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3" }, "MENU"),
                    React.createElement("div", { className: "space-y-1" }, navigation.map(function (item) { return (React.createElement(NavItem, { key: item.name, item: item, pathname: pathname, onClose: onClose })); })))))));
}
exports.Sidebar = Sidebar;
function NavItem(_a) {
    var _b;
    var item = _a.item, pathname = _a.pathname, onClose = _a.onClose, _c = _a.depth, depth = _c === void 0 ? 0 : _c;
    var _d = React.useState(((_b = item.children) === null || _b === void 0 ? void 0 : _b.some(function (child) {
        var _a;
        return child.href === pathname || ((_a = child.children) === null || _a === void 0 ? void 0 : _a.some(function (subChild) { return subChild.href === pathname; }));
    })) || false), isOpen = _d[0], setIsOpen = _d[1];
    var isActive = pathname === item.href;
    // If item has children but no href (like "Settings" submenu)
    if (item.children && !item.href) {
        return (React.createElement(collapsible_1.Collapsible, { open: isOpen, onOpenChange: setIsOpen },
            React.createElement(collapsible_1.CollapsibleTrigger, { asChild: true },
                React.createElement("button", { className: utils_1.cn("flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium transition-colors", "hover:bg-gray-50 hover:text-gray-900", isOpen ? "bg-blue-50 text-blue-600" : "text-gray-700") },
                    React.createElement("span", null, item.name),
                    React.createElement(lucide_react_1.ChevronDown, { className: utils_1.cn("h-4 w-4 transition-transform", isOpen && "rotate-180") }))),
            React.createElement(collapsible_1.CollapsibleContent, { className: "mt-1 space-y-1 pl-6" }, item.children.map(function (child) { return (React.createElement(NavItem, { key: child.name, item: child, pathname: pathname, onClose: onClose, depth: depth + 1 })); }))));
    }
    // If item has children and href (like "Products")
    if (item.children) {
        return (React.createElement(collapsible_1.Collapsible, { open: isOpen, onOpenChange: setIsOpen },
            React.createElement(collapsible_1.CollapsibleTrigger, { asChild: true },
                React.createElement("button", { className: utils_1.cn("flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium transition-colors", "hover:bg-gray-50 hover:text-gray-900", isOpen || isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700") },
                    React.createElement("div", { className: "flex items-center gap-3" },
                        item.icon && React.createElement(item.icon, { className: "h-5 w-5" }),
                        React.createElement("span", null, item.name)),
                    React.createElement(lucide_react_1.ChevronDown, { className: utils_1.cn("h-4 w-4 transition-transform", isOpen && "rotate-180") }))),
            React.createElement(collapsible_1.CollapsibleContent, { className: "mt-1 space-y-1 pl-11" }, item.children.map(function (child) { return (React.createElement(NavItem, { key: child.name, item: child, pathname: pathname, onClose: onClose, depth: depth + 1 })); }))));
    }
    // Regular menu item with link
    return (React.createElement(link_1["default"], { href: item.href, onClick: onClose, className: utils_1.cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-colors", "hover:bg-gray-50 hover:text-gray-900", isActive
            ? "bg-blue-50 text-blue-600"
            : "text-gray-700") },
        item.icon && React.createElement(item.icon, { className: "h-5 w-5" }),
        React.createElement("span", null, item.name)));
}
