/// <reference path="IResolver.ts" />
/// <reference path="IResolutionContext.ts" />
"use strict";
var InstancePerDependencyResolver = (function () {
    function InstancePerDependencyResolver(registration) {
        this.registration = registration;
    }
    InstancePerDependencyResolver.prototype.resolve = function (context) {
        var args = this.registration.parameters.map(function (p) { return p.resolve(context.resolvingContainer); });
        // TODO: is class?
        var instance = new ((_a = this.registration.factory).bind.apply(_a, [void 0].concat(args)))();
        var dispose = this.registration.disposalFunction;
        if (dispose != null) {
            context.resolvingContainer.registerDisposable(function () { return dispose(instance); });
        }
        return instance;
        var _a;
    };
    InstancePerDependencyResolver.prototype.resolveMany = function (context) {
        return [this.resolve(context)];
    };
    return InstancePerDependencyResolver;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InstancePerDependencyResolver;
