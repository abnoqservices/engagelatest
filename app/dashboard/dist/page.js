"use strict";
exports.__esModule = true;
exports.metadata = void 0;
var ProductEventMetrics_1 = require("@/components/dashboardanalytics/ProductEventMetrics");
var react_1 = require("react");
var MonthlyTarget_1 = require("@/components/dashboardanalytics/MonthlyTarget");
var MonthlyScanChart_1 = require("@/components/dashboardanalytics/MonthlyScanChart");
var StatisticsChart_1 = require("@/components/dashboardanalytics/StatisticsChart");
var RecentContacts_1 = require("@/components/dashboardanalytics/RecentContacts");
var layout_1 = require("@/components/dashboard/layout");
exports.metadata = {
    title: "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Home for TailAdmin Dashboard Template"
};
function Ecommerce() {
    return (react_1["default"].createElement(layout_1.DashboardLayout, null,
        react_1["default"].createElement("div", { className: "grid grid-cols-12 gap-4 md:gap-6" },
            react_1["default"].createElement("div", { className: "col-span-12 space-y-6 xl:col-span-7" },
                react_1["default"].createElement(ProductEventMetrics_1.ProductEventMetrics, null),
                react_1["default"].createElement(MonthlyScanChart_1["default"], null)),
            react_1["default"].createElement("div", { className: "col-span-12 xl:col-span-5" },
                react_1["default"].createElement(MonthlyTarget_1["default"], null)),
            react_1["default"].createElement("div", { className: "col-span-12" },
                react_1["default"].createElement(StatisticsChart_1["default"], null)),
            react_1["default"].createElement("div", { className: "col-span-12 xl:col-span-7" },
                react_1["default"].createElement(RecentContacts_1["default"], null)))));
}
exports["default"] = Ecommerce;
