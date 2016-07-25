/// <reference path="IResolver.ts" />
/// <reference path="IResolutionContext.ts" />
"use strict";
var ServiceImplementationResolver = (function () {
    function ServiceImplementationResolver(serviceImpl) {
        this.serviceImpl = serviceImpl;
    }
    ServiceImplementationResolver.prototype.resolve = function (context) {
        return context.resolvingContainer.resolve(this.serviceImpl);
    };
    ServiceImplementationResolver.prototype.resolveMany = function (context) {
        return context.resolvingContainer.resolveMany(this.serviceImpl);
    };
    return ServiceImplementationResolver;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ServiceImplementationResolver;
