"use strict";
var RegistrationMetadata_1 = require("./RegistrationMetadata");
var Guards_1 = require("./Guards");
function InstancePerScope(scopeName) {
    var services = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        services[_i - 1] = arguments[_i];
    }
    services.forEach(function (arg, i) { return Guards_1.assert("(InstancePerScope) services[" + i + "]", arg).is.a.function(); });
    return function (target) {
        Guards_1.assert('(InstancePerScope) target', target).is.a.function();
        var metadata = RegistrationMetadata_1.default.findOrCreate(target);
        metadata.addInitialization(function (registration) { return registration.instancePerScope(scopeName); });
        services.forEach(function (service) {
            metadata.addInitialization(function (_, container) { return container.register(service).implementedBy(target); });
        });
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InstancePerScope;
