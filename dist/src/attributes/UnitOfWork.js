"use strict";
var ScopedUnitOfWork_1 = require('./ScopedUnitOfWork');
function default_1() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    return ScopedUnitOfWork_1.default.apply(void 0, [null].concat(args));
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
