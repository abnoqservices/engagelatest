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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("@hookform/resolvers/zod");
var z = require("zod");
var use_toast_1 = require("@/components/ui/use-toast");
var card_1 = require("@/components/ui/card");
var input_1 = require("@/components/ui/input");
var textarea_1 = require("@/components/ui/textarea");
var label_1 = require("@/components/ui/label");
var button_1 = require("@/components/ui/button");
var separator_1 = require("@/components/ui/separator");
var select_1 = require("@/components/ui/select");
var radio_group_1 = require("@/components/ui/radio-group");
var checkbox_1 = require("@/components/ui/checkbox");
var switch_1 = require("@/components/ui/switch");
function LivePreview(_a) {
    var formData = _a.formData, sections = _a.sections;
    // Create stable string representation for deep comparison
    var formStructureKey = JSON.stringify(sections.map(function (s) { return ({
        id: s.tempId,
        fields: s.fields.map(function (f) { return ({
            id: f.tempId,
            type: f.type,
            name: f.name || f.tempId
        }); })
    }); }));
    var createFieldSchema = function (field) {
        var _a, _b, _c;
        var isRequired = field.required || ((_a = field.rules) === null || _a === void 0 ? void 0 : _a.some(function (r) { return r.type === 'required'; }));
        var schema;
        switch (field.type) {
            case 'text':
            case 'textarea':
            case 'password':
            case 'phone':
            case 'url':
                schema = z.string();
                break;
            case 'email':
                schema = z.string().email({ message: 'Invalid email address' });
                break;
            case 'number':
            case 'rating':
            case 'range':
                schema = z.coerce.number();
                break;
            case 'date':
            case 'datetime':
                schema = z.coerce.date();
                break;
            case 'time':
                schema = z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format');
                break;
            case 'select':
            case 'radio':
                schema = z.string();
                break;
            case 'multi_select':
            case 'checkbox':
                schema = z.array(z.string());
                break;
            case 'toggle':
                schema = z.boolean();
                break;
            case 'file':
            case 'image':
                schema = z.any().optional();
                break;
            case 'color':
                schema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color');
                break;
            case 'hidden':
                return z.any().optional();
            default:
                schema = z.string();
        }
        // String validations
        if (['text', 'textarea', 'password', 'email', 'url', 'phone'].includes(field.type)) {
            (_b = field.rules) === null || _b === void 0 ? void 0 : _b.forEach(function (rule) {
                var _a, _b;
                if (rule.type === 'min_length') {
                    schema = schema.min((_a = rule.value) !== null && _a !== void 0 ? _a : 0);
                }
                if (rule.type === 'max_length') {
                    schema = schema.max((_b = rule.value) !== null && _b !== void 0 ? _b : Infinity);
                }
                if (rule.type === 'regex' && rule.value) {
                    schema = schema.regex(new RegExp(rule.value));
                }
            });
        }
        // Number validations
        if (['number', 'rating', 'range'].includes(field.type)) {
            (_c = field.rules) === null || _c === void 0 ? void 0 : _c.forEach(function (rule) {
                if (rule.type === 'min')
                    schema = schema.min(rule.value);
                if (rule.type === 'max')
                    schema = schema.max(rule.value);
            });
        }
        // Required
        if (isRequired) {
            if (['multi_select', 'checkbox'].includes(field.type)) {
                schema = schema.refine(function (arr) { return Array.isArray(arr) && arr.length > 0; }, 'Required');
            }
            else if (['select', 'radio'].includes(field.type)) {
                schema = schema.refine(function (v) { return v && v !== ''; }, 'Required');
            }
            else if (['file', 'image'].includes(field.type)) {
                schema = schema.refine(function (v) { return v && (v instanceof FileList ? v.length > 0 : true); });
            }
            else {
                schema = schema.refine(function (v) { return v !== undefined && v !== null && v !== ''; }, 'Required');
            }
        }
        else {
            schema = schema.optional().nullable();
        }
        return schema;
    };
    var buildSchema = function () {
        var shape = {};
        sections.forEach(function (section) {
            section.fields.forEach(function (field) {
                if (field.type === 'hidden')
                    return;
                var name = field.name || field.tempId;
                shape[name] = createFieldSchema(field);
            });
        });
        return z.object(shape);
    };
    var schema = buildSchema();
    var form = react_hook_form_1.useForm({
        resolver: zod_1.zodResolver(schema),
        mode: 'onChange',
        defaultValues: getSafeDefaultValues(sections)
    });
    var register = form.register, handleSubmit = form.handleSubmit, control = form.control, errors = form.formState.errors, watch = form.watch, setValue = form.setValue, reset = form.reset;
    function getSafeDefaultValues(sections) {
        var defaults = {};
        sections.forEach(function (section) {
            section.fields.forEach(function (field) {
                var name = field.name || field.tempId;
                // Give every input field an initial empty string
                if (['text', 'textarea', 'password', 'email', 'url', 'phone', 'number', 'date', 'time', 'datetime', 'color'].includes(field.type)) {
                    defaults[name] = ''; // ← this prevents uncontrolled → controlled switch
                }
                else if (['select', 'radio'].includes(field.type)) {
                    defaults[name] = '';
                }
                else if (['multi_select', 'checkbox'].includes(field.type)) {
                    defaults[name] = [];
                }
                else if (field.type === 'toggle') {
                    defaults[name] = false;
                }
                // file/image → leave undefined or null, they handle it differently
            });
        });
        return defaults;
    }
    // Reset form when structure changes (very important for preview)
    react_1.useEffect(function () {
        var defaults = getSafeDefaultValues(sections);
        reset(defaults, {
            keepDefaultValues: false,
            keepValues: false,
            keepErrors: false,
            keepDirty: false,
            keepIsSubmitted: false,
            keepTouched: false,
            keepIsValid: false
        });
    }, [formStructureKey, reset]);
    react_1.useEffect(function () {
        var subscription = watch(function (values, _a) {
            var _b;
            var name = _a.name;
            if (!name)
                return;
            var field = // find field by name (you already have logic to loop sections)
             sections
                .flatMap(function (s) { return s.fields; })
                .find(function (f) { return (f.name || f.tempId) === name; });
            if (!field)
                return;
            var current = values[name];
            // Single value field but value is array? Fix it
            if (['select', 'radio'].includes(field.type) && Array.isArray(current)) {
                setValue(name, (_b = current[0]) !== null && _b !== void 0 ? _b : '', { shouldValidate: true, shouldDirty: true });
            }
            // Multi value field but value is scalar? Wrap in array
            if (['multi_select', 'checkbox'].includes(field.type) && !Array.isArray(current) && current != null) {
                setValue(name, [String(current)], { shouldValidate: true, shouldDirty: true });
            }
        });
        return function () { return subscription.unsubscribe(); };
    }, [watch, setValue, sections]);
    var onSubmit = function (data) {
        use_toast_1.toast({
            title: "Form Submitted (Preview)",
            description: "This is just a simulation — no data was sent."
        });
        console.log('Preview data:', data);
    };
    var renderField = function (field) {
        var _a, _b, _c, _d, _e;
        var name = field.name || field.tempId;
        var error = errors[name];
        var isRequired = field.required || ((_a = field.rules) === null || _a === void 0 ? void 0 : _a.some(function (r) { return r.type === 'required'; }));
        var labelContent = (react_1["default"].createElement(label_1.Label, { className: "text-sm font-medium" },
            field.label,
            isRequired && react_1["default"].createElement("span", { className: "text-red-500 ml-1" }, "*")));
        switch (field.type) {
            case 'text':
            case 'email':
            case 'url':
            case 'password':
            case 'phone':
            case 'number':
            case 'date':
            case 'time':
            case 'datetime':
            case 'color': {
                var typeMap = {
                    phone: 'tel',
                    datetime: 'datetime-local',
                    time: 'time',
                    date: 'date',
                    number: 'number',
                    color: 'color'
                };
                return (react_1["default"].createElement("div", { className: "space-y-2" },
                    labelContent,
                    react_1["default"].createElement(input_1.Input, __assign({ type: typeMap[field.type] || 'text', placeholder: field.placeholder }, register(name), { value: (_b = watch(name)) !== null && _b !== void 0 ? _b : '' })),
                    error && react_1["default"].createElement("p", { className: "text-sm text-red-500" }, error.message)));
            }
            case 'textarea':
                return (react_1["default"].createElement("div", { className: "space-y-2" },
                    labelContent,
                    react_1["default"].createElement(textarea_1.Textarea, __assign({}, register(name), { placeholder: field.placeholder, value: (_c = watch(name)) !== null && _c !== void 0 ? _c : '' })),
                    error && react_1["default"].createElement("p", { className: "text-sm text-red-500" }, error.message)));
            case 'select':
                return (react_1["default"].createElement("div", { className: "space-y-2" },
                    labelContent,
                    react_1["default"].createElement(react_hook_form_1.Controller, { name: name, control: control, render: function (_a) {
                            var _b, _c;
                            var rhfField = _a.field;
                            // ── VERY IMPORTANT DEFENSIVE COERCION ──
                            var safeValue = '';
                            if (typeof rhfField.value === 'string') {
                                safeValue = rhfField.value;
                            }
                            else if (Array.isArray(rhfField.value)) {
                                safeValue = (_b = rhfField.value[0]) !== null && _b !== void 0 ? _b : ''; // take first if array (common after multi→single change)
                            }
                            else if (rhfField.value != null) {
                                safeValue = String(rhfField.value); // coerce numbers/whatever
                            }
                            return (react_1["default"].createElement(select_1.Select, { onValueChange: rhfField.onChange, value: safeValue, disabled: rhfField.disabled },
                                react_1["default"].createElement(select_1.SelectTrigger, null,
                                    react_1["default"].createElement(select_1.SelectValue, { placeholder: field.placeholder || 'Select...' })),
                                react_1["default"].createElement(select_1.SelectContent, null, (_c = field.options) === null || _c === void 0 ? void 0 : _c.map(function (opt) { return (react_1["default"].createElement(select_1.SelectItem, { key: opt.value, value: opt.value }, opt.label)); }))));
                        } }),
                    error && react_1["default"].createElement("p", { className: "text-sm text-red-500" }, error.message)));
            case 'multi_select':
                return (react_1["default"].createElement("div", { className: "space-y-2" },
                    labelContent,
                    react_1["default"].createElement("div", { className: "space-y-3 mt-2" }, (_d = field.options) === null || _d === void 0 ? void 0 : _d.map(function (opt) {
                        var checked = (watch(name) || []).includes(opt.value);
                        return (react_1["default"].createElement("div", { key: opt.value, className: "flex items-center space-x-2" },
                            react_1["default"].createElement(checkbox_1.Checkbox, { id: name + "-" + opt.value, checked: checked, onCheckedChange: function (checked) {
                                    var current = watch(name) || [];
                                    setValue(name, checked
                                        ? __spreadArrays(current, [opt.value]) : current.filter(function (v) { return v !== opt.value; }));
                                } }),
                            react_1["default"].createElement(label_1.Label, { htmlFor: name + "-" + opt.value }, opt.label)));
                    })),
                    error && react_1["default"].createElement("p", { className: "text-sm text-red-500" }, error.message)));
            case 'radio':
                return (react_1["default"].createElement("div", { className: "space-y-2" },
                    labelContent,
                    react_1["default"].createElement(react_hook_form_1.Controller, { name: name, control: control, render: function (_a) {
                            var _b;
                            var field = _a.field;
                            return (react_1["default"].createElement(radio_group_1.RadioGroup, { onValueChange: field.onChange, value: field.value, className: "space-y-3 mt-2" }, (_b = field.options) === null || _b === void 0 ? void 0 : _b.map(function (opt) { return (react_1["default"].createElement("div", { key: opt.value, className: "flex items-center space-x-2" },
                                react_1["default"].createElement(radio_group_1.RadioGroupItem, { value: opt.value, id: name + "-" + opt.value }),
                                react_1["default"].createElement(label_1.Label, { htmlFor: name + "-" + opt.value }, opt.label))); })));
                        } }),
                    error && react_1["default"].createElement("p", { className: "text-sm text-red-500" }, error.message)));
            case 'checkbox':
                // Similar to multi_select - using same logic
                return renderField(__assign(__assign({}, field), { type: 'multi_select' }));
            case 'toggle':
                return (react_1["default"].createElement("div", { className: "flex items-center justify-between py-4" },
                    labelContent,
                    react_1["default"].createElement(switch_1.Switch, { checked: watch(name) || false, onCheckedChange: function (checked) { return setValue(name, checked); } })));
            case 'file':
            case 'image':
                return (react_1["default"].createElement("div", { className: "space-y-2" },
                    labelContent,
                    react_1["default"].createElement(react_hook_form_1.Controller, { name: name, control: control, render: function (_a) {
                            var _b, _c;
                            var rhfField = _a.field;
                            var inputId = "file-upload-" + name;
                            var handleButtonClick = function () {
                                var _a;
                                (_a = document.getElementById(inputId)) === null || _a === void 0 ? void 0 : _a.click();
                            };
                            var handleFileChange = function (e) {
                                var files = e.target.files;
                                if (files && files.length > 0) {
                                    rhfField.onChange(files); // FileList is passed to react-hook-form
                                }
                            };
                            // Optional: show selected file name
                            var selectedFileName = (_c = (_b = rhfField.value) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.name;
                            return (react_1["default"].createElement("div", { className: "border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center hover:border-primary/50 transition-colors" },
                                react_1["default"].createElement("p", { className: "text-muted-foreground mb-4" }, field.type === 'image'
                                    ? 'Drag & drop an image here or click to upload'
                                    : 'Drag & drop a file here or click to select'),
                                react_1["default"].createElement("input", { id: inputId, type: "file", accept: field.type === 'image' ? 'image/*' : undefined, className: "hidden", onChange: handleFileChange }),
                                react_1["default"].createElement(button_1.Button, { type: "button", variant: "outline", onClick: handleButtonClick, className: "mt-2" },
                                    "Choose ",
                                    field.type === 'image' ? 'Image' : 'File'),
                                selectedFileName && (react_1["default"].createElement("div", { className: "mt-4 text-sm text-primary" },
                                    "Selected: ",
                                    react_1["default"].createElement("span", { className: "font-medium" }, selectedFileName))),
                                rhfField.value && rhfField.value.length > 0 && field.type === 'image' && (react_1["default"].createElement("div", { className: "mt-4" },
                                    react_1["default"].createElement("img", { src: URL.createObjectURL(rhfField.value[0]), alt: "Preview", className: "max-h-48 mx-auto rounded-md object-contain" })))));
                        } }),
                    errors[name] && (react_1["default"].createElement("p", { className: "text-sm text-destructive mt-1" }, (_e = errors[name]) === null || _e === void 0 ? void 0 : _e.message))));
            default:
                return null;
        }
    };
    return (react_1["default"].createElement("div", { className: "space-y-6 p-4" },
        react_1["default"].createElement(card_1.Card, { className: "shadow-lg" },
            react_1["default"].createElement(card_1.CardHeader, null,
                react_1["default"].createElement(card_1.CardTitle, null, "Form Preview"),
                react_1["default"].createElement(card_1.CardDescription, null, "Test your form with real validation")),
            react_1["default"].createElement(card_1.CardContent, { className: "pt-6" },
                react_1["default"].createElement("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-10 max-w-2xl mx-auto" },
                    react_1["default"].createElement("div", { className: "text-center space-y-3 pb-8" },
                        react_1["default"].createElement("h1", { className: "text-3xl font-bold" }, formData.name || 'Untitled Form'),
                        formData.description && (react_1["default"].createElement("p", { className: "text-muted-foreground" }, formData.description))),
                    sections.map(function (section) { return (react_1["default"].createElement("div", { key: section.tempId, className: "space-y-8" },
                        (section.title || section.description) && (react_1["default"].createElement(react_1["default"].Fragment, null,
                            section.title && react_1["default"].createElement("h2", { className: "text-2xl font-semibold" }, section.title),
                            section.description && react_1["default"].createElement("p", { className: "text-muted-foreground" }, section.description),
                            react_1["default"].createElement(separator_1.Separator, { className: "my-6" }))),
                        react_1["default"].createElement("div", { className: "space-y-6" }, section.fields.map(function (field) { return (react_1["default"].createElement("div", { key: field.tempId }, renderField(field))); })))); }),
                    react_1["default"].createElement("div", { className: "pt-8" },
                        react_1["default"].createElement(button_1.Button, { type: "submit", size: "lg", className: "w-full" }, "Submit")))))));
}
exports["default"] = LivePreview;
