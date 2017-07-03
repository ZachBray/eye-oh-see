"use strict";
var Guards_1 = require("./Guards");
var Utils_1 = require("./Utils");
function InstancePerDependency() {
    var services = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        services[_i] = arguments[_i];
    }
    services.forEach(function (arg, i) { return Guards_1.assert("(InstancePerDependency) services[" + i + "]", arg).is.a.function(); });
    return function (target) {
        Guards_1.assert('(InstancePerDependency) target', target).is.a.function();
        Utils_1.registerServices(target, services, function (registration) { return registration.instancePerDependency(); });
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InstancePerDependency;
