"use strict";
var Guards_1 = require("./Guards");
var Utils_1 = require("./Utils");
function InstancePerScope(scopeName) {
    var services = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        services[_i - 1] = arguments[_i];
    }
    services.forEach(function (arg, i) { return Guards_1.assert("(InstancePerScope) services[" + i + "]", arg).is.a.function(); });
    return function (target) {
        Guards_1.assert('(InstancePerScope) target', target).is.a.function();
        Utils_1.registerServices(target, services, function (registration) { return registration.instancePerScope(scopeName); });
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InstancePerScope;
