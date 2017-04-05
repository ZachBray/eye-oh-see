"use strict";
var RegistrationMetadata_1 = require("./RegistrationMetadata");
var ArrayParameter_1 = require("../parameters/ArrayParameter");
var Guards_1 = require("./Guards");
function ArrayOf(service) {
    Guards_1.assert('(ArrayOf) service', service).is.a.function();
    return function (target, key, index) {
        Guards_1.assert('(ArrayOf) target', target).is.a.function();
        var metadata = RegistrationMetadata_1.default.findOrCreate(target);
        metadata.addInitialization(function (registration) { return registration.parameters[index] = new ArrayParameter_1.default(service); });
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ArrayOf;
