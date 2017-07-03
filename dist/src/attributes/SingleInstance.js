"use strict";
var Guards_1 = require("./Guards");
var Utils_1 = require("./Utils");
function SingleInstance() {
    var services = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        services[_i] = arguments[_i];
    }
    services.forEach(function (arg, i) { return Guards_1.assert("(SingleInstance) services[" + i + "]", arg).is.a.function(); });
    return function (target) {
        Utils_1.registerServices(target, services, function (registration) { return registration.singleInstance(); });
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SingleInstance;
