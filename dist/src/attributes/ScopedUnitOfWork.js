"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RegistrationMetadata_1 = require("./RegistrationMetadata");
var UnitOfWorkParameter_1 = require("../parameters/UnitOfWorkParameter");
var Guards_1 = require("./Guards");
function ScopedUnitOfWork(scopeName) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    Guards_1.assert('(ScopedUnitOfWork) args', args).is.not.empty();
    return function (target, key, index) {
        Guards_1.assert('(ScopedUnitOfWork) target', target).is.a.function();
        var metadata = RegistrationMetadata_1.default.findOrCreate(target);
        var params = args.slice(0, args.length - 1);
        var service = args[args.length - 1];
        metadata.addInitialization(function (registration) { return registration.parameters[index] = new UnitOfWorkParameter_1.default(params, service, scopeName); });
    };
}
exports.default = ScopedUnitOfWork;
