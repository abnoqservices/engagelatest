"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GET = GET;

var _headers = require("next/headers");

function GET() {
  var cookieStore, accessToken, refreshToken;
  return regeneratorRuntime.async(function GET$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          cookieStore = (0, _headers.cookies)();
          accessToken = cookieStore.get("hubspot_access_token");
          refreshToken = cookieStore.get("hubspot_refresh_token");

          if (accessToken) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", Response.json({
            connected: false
          }));

        case 5:
          return _context.abrupt("return", Response.json({
            connected: true,
            expiresIn: accessToken.maxAge || null
          }));

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}