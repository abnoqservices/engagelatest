"use strict";
// app/api/hubspot/leads/route.ts
// Renamed concept: this now handles Contacts (standard for people/leads)
// If you truly need the new Leads object → see notes at bottom
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
exports.POST = exports.GET = void 0;
var server_1 = require("next/server");
var headers_1 = require("next/headers");
function getAccessToken() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var cookieStore, token;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, headers_1.cookies()];
                case 1:
                    cookieStore = _b.sent();
                    token = (_a = cookieStore.get('hubspot_access_token')) === null || _a === void 0 ? void 0 : _a.value;
                    console.log('Access token retrieved:', !!token);
                    if (!token) {
                        throw new Error('Unauthorized - No HubSpot access token found');
                    }
                    return [2 /*return*/, token];
            }
        });
    });
}
// Use Contacts endpoint (standard for people / leads data)
var HUBSPOT_CONTACTS_URL = 'https://api.hubapi.com/crm/v3/objects/contacts';
function GET(request) {
    return __awaiter(this, void 0, void 0, function () {
        var token, searchParams, limit, after, properties, url, res, errorText, errorMessage, errJson, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, getAccessToken()];
                case 1:
                    token = _a.sent();
                    searchParams = new URL(request.url).searchParams;
                    limit = searchParams.get('limit') || '50';
                    after = searchParams.get('after') || undefined;
                    properties = [
                        'firstname',
                        'lastname',
                        'email',
                        'company',
                        'phone',
                        'lifecyclestage',
                        'createdate',
                        'hs_lastmodifieddate',
                    ].join(',');
                    url = new URL(HUBSPOT_CONTACTS_URL);
                    url.searchParams.set('limit', limit);
                    url.searchParams.set('properties', properties);
                    if (after)
                        url.searchParams.set('after', after);
                    return [4 /*yield*/, fetch(url.toString(), {
                            method: 'GET',
                            headers: {
                                Authorization: "Bearer " + token,
                                'Content-Type': 'application/json'
                            },
                            cache: 'no-store'
                        })];
                case 2:
                    res = _a.sent();
                    if (!!res.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, res.text()];
                case 3:
                    errorText = _a.sent();
                    console.error('HubSpot GET contacts failed:', res.status, errorText);
                    errorMessage = "HubSpot API error: " + res.status;
                    try {
                        errJson = JSON.parse(errorText);
                        errorMessage = errJson.message || errorMessage;
                    }
                    catch (_b) { }
                    return [2 /*return*/, server_1.NextResponse.json({ error: errorMessage }, { status: res.status })];
                case 4: return [4 /*yield*/, res.json()];
                case 5:
                    data = _a.sent();
                    return [2 /*return*/, server_1.NextResponse.json(data)];
                case 6:
                    error_1 = _a.sent();
                    console.error('Contacts GET exception:', error_1);
                    return [2 /*return*/, server_1.NextResponse.json({ error: error_1.message || 'Internal server error' }, { status: 500 })];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.GET = GET;
function POST(request) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function () {
        var token, body, properties, payload, res, errorText, errorMessage, errJson, created, error_2;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, getAccessToken()];
                case 1:
                    token = _f.sent();
                    return [4 /*yield*/, request.json()];
                case 2:
                    body = _f.sent();
                    properties = body.properties;
                    if (!properties || !((_a = properties.email) === null || _a === void 0 ? void 0 : _a.trim())) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: 'Email is required when creating/updating a contact' }, { status: 400 })];
                    }
                    payload = {
                        properties: __assign({ email: properties.email.trim(), firstname: ((_b = properties.firstname) === null || _b === void 0 ? void 0 : _b.trim()) || undefined, lastname: ((_c = properties.lastname) === null || _c === void 0 ? void 0 : _c.trim()) || undefined, company: ((_d = properties.company) === null || _d === void 0 ? void 0 : _d.trim()) || undefined, phone: ((_e = properties.phone) === null || _e === void 0 ? void 0 : _e.trim()) || undefined, lifecyclestage: properties.lifecyclestage || 'lead' }, properties)
                    };
                    return [4 /*yield*/, fetch(HUBSPOT_CONTACTS_URL, {
                            method: 'POST',
                            headers: {
                                Authorization: "Bearer " + token,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(payload)
                        })];
                case 3:
                    res = _f.sent();
                    if (!!res.ok) return [3 /*break*/, 5];
                    return [4 /*yield*/, res.text()];
                case 4:
                    errorText = _f.sent();
                    console.error('HubSpot POST contact failed:', res.status, errorText);
                    errorMessage = "HubSpot API error: " + res.status;
                    try {
                        errJson = JSON.parse(errorText);
                        errorMessage = errJson.message || errorMessage;
                    }
                    catch (_g) { }
                    return [2 /*return*/, server_1.NextResponse.json({ error: errorMessage }, { status: res.status })];
                case 5: return [4 /*yield*/, res.json()];
                case 6:
                    created = _f.sent();
                    return [2 /*return*/, server_1.NextResponse.json(created, { status: 201 })];
                case 7:
                    error_2 = _f.sent();
                    console.error('Contacts POST exception:', error_2);
                    return [2 /*return*/, server_1.NextResponse.json({ error: error_2.message || 'Failed to create contact' }, { status: 500 })];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.POST = POST;
