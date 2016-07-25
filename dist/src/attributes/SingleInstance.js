"use strict";
var RegistrationMetadata_1 = require('./RegistrationMetadata');
function SingleInstance() {
    var services = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        services[_i - 0] = arguments[_i];
    }
    return function (target) {
        var metadata = RegistrationMetadata_1.default.findOrCreate(target);
        metadata.addInitialization(function (registration) { return registration.singleInstance(); });
        services.forEach(function (service) {
            var serviceMetadata = RegistrationMetadata_1.default.findOrCreate(service);
            serviceMetadata.addInitialization(function (registration) { return registration.implementedBy(target); });
        });
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SingleInstance;
