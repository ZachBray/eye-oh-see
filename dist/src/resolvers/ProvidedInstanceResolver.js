/// <reference path="IResolver.ts" />
/// <reference path="IResolutionContext.ts" />
"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProvidedInstanceResolver;
