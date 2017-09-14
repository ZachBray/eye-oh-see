"use strict";
/// <reference path="IResolver.ts" />
/// <reference path="IResolutionContext.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var ProvidedInstanceResolver = (function () {
    function ProvidedInstanceResolver(providedInstance) {
        this.providedInstance = providedInstance;
    }
    ProvidedInstanceResolver.prototype.resolve = function (context) {
        return this.providedInstance;
    };
    ProvidedInstanceResolver.prototype.resolveMany = function (context) {
        return [this.resolve(context)];
    };
    return ProvidedInstanceResolver;
}());
exports.default = ProvidedInstanceResolver;
