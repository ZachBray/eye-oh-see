"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ScopedFactory_1 = require("./ScopedFactory");
var Guards_1 = require("./Guards");
function Factory() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    Guards_1.assert('(Factory) args', args).is.not.empty();
    args.forEach(function (arg, i) { return Guards_1.assert("(Factory) args[" + i + "]", arg).is.a.function(); });
    return ScopedFactory_1.default.apply(void 0, [null].concat(args));
}
exports.default = Factory;
