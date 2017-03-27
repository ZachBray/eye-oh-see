"use strict";
var RegistrationMetadata_1 = require("./RegistrationMetadata");
function SingleInstance() {
    var services = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        services[_i] = arguments[_i];
    }
    return function (target) {
        var metadata = RegistrationMetadata_1.default.findOrCreate(target);
        metadata.addInitialization(function (registration) { return registration.singleInstance(); });
        services.forEach(function (service) {
            metadata.addInitialization(function (_, container) { return container.register(service).implementedBy(target); });
        });
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SingleInstance;
