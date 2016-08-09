"use strict";
var RegistrationMetadata_1 = require('./RegistrationMetadata');
var FactoryParameter_1 = require('../parameters/FactoryParameter');
function ScopedFactory(scopeName) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return function (target, key, index) {
        var metadata = RegistrationMetadata_1.default.findOrCreate(target);
        if (args.length === 0) {
            throw new Error("Must provide at least the return type for a factory. Check the constructor of " + metadata.key);
        }
        var params = args.slice(0, args.length - 1);
        var service = args[args.length - 1];
        metadata.addInitialization(function (registration) { return registration.parameters[index] = new FactoryParameter_1.default(params, service, scopeName); });
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ScopedFactory;
