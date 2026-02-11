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
exports.GET = void 0;
var server_1 = require("next/server");
function GET(request) {
    return __awaiter(this, void 0, void 0, function () {
        var code, tokenResponse, err, tokens, response, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = request.nextUrl.searchParams.get('code');
                    console.log('Received code:', code);
                    if (!code) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: 'Missing authorization code' }, { status: 400 })];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch('https://api.hubapi.com/oauth/v1/token', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: new URLSearchParams({
                                grant_type: 'authorization_code',
                                client_id: '0b326f43-29e3-4d0c-b250-c83607cb3b3f',
                                client_secret: 'be736646-02a5-4d0f-b767-7882a414ca5a',
                                redirect_uri: 'http://localhost:3000/api/hubspot/integrations',
                                code: code
                            }).toString()
                        })];
                case 2:
                    tokenResponse = _a.sent();
                    if (!!tokenResponse.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, tokenResponse.text()];
                case 3:
                    err = _a.sent();
                    console.error('HubSpot token exchange failed:', err);
                    return [2 /*return*/, server_1.NextResponse.json({ error: 'Token exchange failed', details: err }, { status: 500 })];
                case 4: return [4 /*yield*/, tokenResponse.json()];
                case 5:
                    tokens = _a.sent();
                    response = new server_1.NextResponse("\n      <!DOCTYPE html>\n      <html lang=\"en\">\n      <head>\n        <meta charset=\"UTF-8\" />\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/>\n        <title>HubSpot Connected</title>\n        <style>\n          body {\n            font-family: system-ui, sans-serif;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            min-height: 100vh;\n            margin: 0;\n            background: #f9fafb;\n            color: #111827;\n          }\n          .card {\n            background: white;\n            padding: 2.5rem;\n            border-radius: 1rem;\n            box-shadow: 0 10px 25px rgba(0,0,0,0.1);\n            text-align: center;\n            max-width: 420px;\n          }\n          h1 { color: #027a4d; margin-bottom: 1rem; }\n          p { margin-bottom: 1.5rem; color: #4b5563; }\n          .btn {\n            background: #027a4d;\n            color: white;\n            padding: 0.75rem 1.5rem;\n            border-radius: 0.5rem;\n            text-decoration: none;\n            font-weight: 500;\n          }\n          .btn:hover { background: #01633f; }\n        </style>\n      </head>\n      <body>\n        <div class=\"card\">\n          <h1>\u2713 HubSpot Connected!</h1>\n          <p>Your HubSpot account is now successfully linked to the application.</p>\n          <p>Redirecting to integrations page in 3 seconds...</p>\n          <a href=\"/integrations?tab=crm\" class=\"btn\">Go to Integrations Now</a>\n        </div>\n\n        <script>\n          setTimeout(() => {\n            window.location.href = \"/integrations?tab=crm\";\n          }, 3000);\n        </script>\n      </body>\n      </html>\n    ", {
                        status: 200,
                        headers: { 'Content-Type': 'text/html' }
                    });
                    // Attach cookies to the response
                    response.cookies.set('hubspot_access_token', tokens.access_token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                        maxAge: tokens.expires_in || 21600,
                        path: '/'
                    });
                    if (tokens.refresh_token) {
                        response.cookies.set('hubspot_refresh_token', tokens.refresh_token, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'lax',
                            maxAge: 60 * 60 * 24 * 30,
                            path: '/'
                        });
                    }
                    return [2 /*return*/, response];
                case 6:
                    err_1 = _a.sent();
                    console.error('Callback error:', err_1);
                    return [2 /*return*/, server_1.NextResponse.redirect(new URL('/?error=auth_failed', request.url))];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.GET = GET;
