"use strict";
var RegistrationMetadata_1 = require("./RegistrationMetadata");
var ArrayParameter_1 = require("../parameters/ArrayParameter");
function ArrayOf(service) {
    return function (target, key, index) {
        var metadata = RegistrationMetadata_1.default.findOrCreate(target);
        metadata.addInitialization(function (registration) { return registration.parameters[index] = new ArrayParameter_1.default(service); });
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ArrayOf;
