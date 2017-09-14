"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ScopedUnitOfWork_1 = require("./ScopedUnitOfWork");
var Guards_1 = require("./Guards");
function default_1() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    Guards_1.assert('(UnitOfWork) args', args).is.not.empty();
    return ScopedUnitOfWork_1.default.apply(void 0, [null].concat(args));
}
exports.default = default_1;
