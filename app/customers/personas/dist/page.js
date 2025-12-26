"use strict";
exports.__esModule = true;
var layout_1 = require("@/components/dashboard/layout");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
function PersonasPage() {
    // In a real app, these would come from:
    // - Aggregated data from GET /api/contacts with scoring computed client-side or via backend
    // - Possibly a dedicated /api/personas or /api/contacts/scores endpoint
    var personas = [
        {
            name: "Hot Lead",
            scoreRange: "90–100",
            count: 145,
            color: "bg-red-600",
            description: "High intent – ready for sales"
        },
        {
            name: "Qualified Lead",
            scoreRange: "80–89",
            count: 234,
            color: "bg-orange-600",
            description: "Strong fit + engagement"
        },
        {
            name: "Marketing Qualified",
            scoreRange: "70–79",
            count: 456,
            color: "bg-amber-600",
            description: "Engaged – nurture + score"
        },
        {
            name: "Warm Prospect",
            scoreRange: "60–69",
            count: 789,
            color: "bg-yellow-600",
            description: "Showing interest"
        },
        {
            name: "Cold / Low Priority",
            scoreRange: "40–59",
            count: 1234,
            color: "bg-blue-600",
            description: "Low engagement"
        },
        {
            name: "Unqualified / Archived",
            scoreRange: "0–39",
            count: 567,
            color: "bg-gray-600",
            description: "Not a fit or inactive"
        },
    ];
    // Rough total for percentage calculation (in real app → from API summary)
    var totalContacts = personas.reduce(function (sum, p) { return sum + p.count; }, 0);
    return (React.createElement(layout_1.DashboardLayout, null,
        React.createElement("div", { className: "space-y-6" },
            React.createElement("div", { className: "flex items-center justify-between" },
                React.createElement("div", null,
                    React.createElement("h1", { className: "text-3xl font-bold text-foreground" }, "Contact Personas"),
                    React.createElement("p", { className: "text-muted-foreground mt-2 flex items-center gap-1.5" },
                        React.createElement(lucide_react_1.Zap, { className: "h-4 w-4 text-amber-600" }),
                        "AI-powered lead scoring & segmentation based on behavior, source and custom fields")),
                React.createElement(button_1.Button, null,
                    React.createElement(lucide_react_1.Plus, { className: "h-4 w-4 mr-2" }),
                    "Create Persona")),
            React.createElement("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3" }, personas.map(function (persona) {
                var percentage = Math.round((persona.count / totalContacts) * 100);
                return (React.createElement(card_1.Card, { key: persona.name, className: "overflow-hidden" },
                    React.createElement(card_1.CardHeader, { className: "pb-4" },
                        React.createElement("div", { className: "flex items-start justify-between" },
                            React.createElement("div", null,
                                React.createElement(card_1.CardTitle, { className: "text-lg font-semibold" }, persona.name),
                                React.createElement(card_1.CardDescription, { className: "mt-1" },
                                    "Score: ",
                                    persona.scoreRange,
                                    " \u2022 ",
                                    persona.description)),
                            React.createElement("div", { className: "h-4 w-4 rounded-full " + persona.color + " ring-2 ring-offset-2 ring-offset-background" }))),
                    React.createElement(card_1.CardContent, { className: "space-y-5" },
                        React.createElement("div", null,
                            React.createElement("div", { className: "flex items-center justify-between mb-2 text-sm" },
                                React.createElement("span", { className: "text-muted-foreground" }, "Contacts"),
                                React.createElement("span", { className: "font-semibold" }, persona.count.toLocaleString())),
                            React.createElement("div", { className: "h-2.5 bg-muted rounded-full overflow-hidden" },
                                React.createElement("div", { className: "h-full " + persona.color + " transition-all", style: { width: percentage + "%" } }))),
                        React.createElement("div", { className: "flex gap-3" },
                            React.createElement(button_1.Button, { variant: "outline", size: "sm", className: "flex-1" },
                                React.createElement(lucide_react_1.Users, { className: "h-4 w-4 mr-1.5" }),
                                "View Contacts"),
                            React.createElement(button_1.Button, { variant: "outline", size: "sm", className: "flex-1" },
                                React.createElement(lucide_react_1.TrendingUp, { className: "h-4 w-4 mr-1.5" }),
                                "Scoring Insights")))));
            })),
            React.createElement(card_1.Card, null,
                React.createElement(card_1.CardHeader, null,
                    React.createElement(card_1.CardTitle, null, "Lead Scoring Configuration"),
                    React.createElement(card_1.CardDescription, null, "Points assigned to contact activities, sources and custom field values")),
                React.createElement(card_1.CardContent, null,
                    React.createElement("div", { className: "space-y-3" }, [
                        { action: "Form Submission (high-value)", points: 25 },
                        { action: "Demo / Product Video ≥ 75%", points: 20 },
                        { action: "Pricing Page Visit", points: 15 },
                        { action: "QR Scan / Booth Capture", points: 12 },
                        { action: "Email Link Click (2+)", points: 10 },
                        { action: "Website Session ≥ 2 min", points: 8 },
                        { action: "Email Opened", points: 4 },
                        { action: "Visitor from High-intent Source", points: "+5–15" },
                        { action: "AI-detected Buying Intent", points: "+10–30" },
                    ].map(function (rule, i) { return (React.createElement("div", { key: i, className: "flex items-center justify-between p-3.5 rounded-lg border bg-card/40 hover:bg-card/70 transition-colors" },
                        React.createElement("span", { className: "font-medium" }, rule.action),
                        React.createElement(badge_1.Badge, { variant: "secondary", className: "text-sm font-semibold" },
                            "+",
                            rule.points,
                            " pts"))); })),
                    React.createElement("p", { className: "text-xs text-muted-foreground mt-5 italic" }, "Scoring combines behavioral events, contact source (factors_ai, website, product_lp, \u2026), custom field values and origin metadata. Rules can be managed in settings."))))));
}
exports["default"] = PersonasPage;
