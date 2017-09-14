"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RegistrationMetadata_1 = require("./RegistrationMetadata");
function registerServices(target, services, initializer) {
    var metadata = RegistrationMetadata_1.default.findOrCreate(target);
    metadata.addInitialization(initializer);
    services.forEach(function (service) {
        if (service === target) {
            console.warn('A decorator (SingleInstance|InstancePerScope|InstancePerDependency) is being used to register a service as itself.', 'This is automatic and not required; therefore, it will be ignored.', target);
            return;
        }
        metadata.addInitialization(function (_, container) { return container.register(service).implementedBy(target); });
    });
}
exports.registerServices = registerServices;
