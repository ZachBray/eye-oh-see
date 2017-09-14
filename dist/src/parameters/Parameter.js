"use strict";
/// <reference path="IParameter.ts" />
/// <reference path="../IContainer.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var Parameter = (function () {
    function Parameter(service) {
        this.service = service;
    }
    Parameter.prototype.resolve = function (container) {
        return container.resolve(this.service);
    };
    return Parameter;
}());
exports.default = Parameter;
