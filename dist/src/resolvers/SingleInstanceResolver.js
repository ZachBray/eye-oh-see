/// <reference path="IResolver.ts" />
/// <reference path="IResolutionContext.ts" />
"use strict";
var InstancePerDependencyResolver_1 = require('./InstancePerDependencyResolver');
var SingleInstanceResolver = (function () {
    function SingleInstanceResolver(registration) {
        this.registration = registration;
        this.innerResolver = new InstancePerDependencyResolver_1.default(registration);
    }
    SingleInstanceResolver.prototype.resolve = function (context) {
        var scopedContext = {
            registeringContainer: context.registeringContainer,
            resolvingContainer: context.registeringContainer
        };
        var containerInstances = scopedContext.resolvingContainer.instances;
        var existingInstance = containerInstances[this.registration.key];
        if (existingInstance) {
            return existingInstance;
        }
        var instance = this.innerResolver.resolve(scopedContext);
        containerInstances[this.registration.key] = instance;
        return instance;
    };
    SingleInstanceResolver.prototype.resolveMany = function (context) {
        return [this.resolve(context)];
    };
    return SingleInstanceResolver;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SingleInstanceResolver;
