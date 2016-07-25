"use strict";
var ArrayParameter = (function () {
    function ArrayParameter(service) {
        this.service = service;
    }
    ArrayParameter.prototype.resolve = function (container) {
        return container.resolveMany(this.service);
    };
    return ArrayParameter;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ArrayParameter;
