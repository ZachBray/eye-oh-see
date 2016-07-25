/// <reference path="IParameter.ts" />
/// <reference path="../IContainer.ts" />
"use strict";
var Parameter = (function () {
    function Parameter(service) {
        this.service = service;
    }
    Parameter.prototype.resolve = function (container) {
        return container.resolve(this.service);
    };
    return Parameter;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Parameter;
