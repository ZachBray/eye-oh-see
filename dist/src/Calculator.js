"use strict";
var Calculator = (function () {
    function Calculator() {
    }
    Calculator.prototype.add = function (x, y) {
        return x + y;
    };
    return Calculator;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Calculator;
