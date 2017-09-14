"use strict";
/// <reference path="../IContainer.ts" />
/// <reference path="IParameter.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var FactoryParameter_1 = require("./FactoryParameter");
var UnitOfWorkParameter = (function () {
    function UnitOfWorkParameter(paramServices, service, scopeName) {
        this.paramServices = paramServices;
        this.service = service;
        this.factoryParameter = new FactoryParameter_1.default(paramServices, service, scopeName);
    }
    UnitOfWorkParameter.prototype.resolve = function (container) {
        var _this = this;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var childContainer = container.createChild();
            var valueFactory = _this.factoryParameter.resolve(childContainer);
            var value = valueFactory.apply(void 0, args);
            var dispose = function () { return childContainer.dispose(); };
            return { value: value, dispose: dispose };
        };
    };
    return UnitOfWorkParameter;
}());
exports.default = UnitOfWorkParameter;
