"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RegistrationMetadata_1 = require("./RegistrationMetadata");
var FactoryParameter_1 = require("../parameters/FactoryParameter");
var Guards_1 = require("./Guards");
function ScopedFactory(scopeName) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    Guards_1.assert('(ScopedFactory) args', args).is.not.empty();
    args.forEach(function (arg, i) { return Guards_1.assert("(ScopedFactory) args[" + i + "]", arg).is.a.function(); });
    return function (target, key, index) {
        Guards_1.assert('(ScopedFactory) target', target).is.a.function();
        var metadata = RegistrationMetadata_1.default.findOrCreate(target);
        if (args.length === 0) {
            throw new Error("Must provide at least the return type for a factory. Check the constructor of " + metadata.key);
        }
        var params = args.slice(0, args.length - 1);
        var service = args[args.length - 1];
        metadata.addInitialization(function (registration) { return registration.parameters[index] = new FactoryParameter_1.default(params, service, scopeName); });
    };
}
exports.default = ScopedFactory;
