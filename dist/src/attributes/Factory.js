"use strict";
var ScopedFactory_1 = require('./ScopedFactory');
function Factory() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    return ScopedFactory_1.default.apply(void 0, [null].concat(args));
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Factory;
