/// <reference path="IResolver.ts" />
/// <reference path="IResolutionContext.ts" />
"use strict";
var InstancePerDependencyResolver_1 = require('./InstancePerDependencyResolver');
var SingleInstanceResolver = (function () {
    function SingleInstanceResolver(registration) {
        this.registration = registration;
        this.hasResolved = false;
        this.innerResolver = new InstancePerDependencyResolver_1.default(registration);
    }
    SingleInstanceResolver.prototype.resolve = function (context) {
        if (!this.hasResolved) {
            this.resolvedValue = this.innerResolver.resolve({
                registeringContainer: context.registeringContainer,
                resolvingContainer: context.registeringContainer
            });
            this.hasResolved = true;
        }
        return this.resolvedValue;
    };
    SingleInstanceResolver.prototype.resolveMany = function (context) {
        return [this.resolve(context)];
    };
    return SingleInstanceResolver;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SingleInstanceResolver;
