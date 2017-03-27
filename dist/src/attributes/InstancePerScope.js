"use strict";
var RegistrationMetadata_1 = require("./RegistrationMetadata");
function InstancePerScope(scopeName) {
    var services = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        services[_i - 1] = arguments[_i];
    }
    return function (target) {
        var metadata = RegistrationMetadata_1.default.findOrCreate(target);
        metadata.addInitialization(function (registration) { return registration.instancePerScope(scopeName); });
        services.forEach(function (service) {
            metadata.addInitialization(function (_, container) { return container.register(service).implementedBy(target); });
        });
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InstancePerScope;
