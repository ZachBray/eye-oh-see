"use strict";
var RegistrationMetadata_1 = require("./RegistrationMetadata");
var Parameter_1 = require("../parameters/Parameter");
var Guards_1 = require("./Guards");
function ParamOf(service) {
    Guards_1.assert('(ParamOf) service', service).is.a.function();
    return function (target, key, index) {
        Guards_1.assert('(ParamOf) target', target).is.a.function();
        var metadata = RegistrationMetadata_1.default.findOrCreate(target);
        metadata.addInitialization(function (registration) { return registration.parameters[index] = new Parameter_1.default(service); });
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParamOf;
