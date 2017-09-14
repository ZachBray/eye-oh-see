"use strict";
/// <reference path="../IContainer.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var ArrayParameter = (function () {
    function ArrayParameter(service) {
        this.service = service;
    }
    ArrayParameter.prototype.resolve = function (container) {
        return container.resolveMany(this.service);
    };
    return ArrayParameter;
}());
exports.default = ArrayParameter;
