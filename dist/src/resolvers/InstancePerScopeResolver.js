/// <reference path="IResolver.ts" />
/// <reference path="IResolutionContext.ts" />
"use strict";
var InstancePerDependencyResolver_1 = require('./InstancePerDependencyResolver');
var InstancePerScopeResolver = (function () {
    function InstancePerScopeResolver(scopeName, registration) {
        this.scopeName = scopeName;
        this.registration = registration;
        this.innerResolver = new InstancePerDependencyResolver_1.default(registration);
    }
    InstancePerScopeResolver.prototype.resolve = function (context) {
        var scopedContext = this.findScope(context);
        var containerInstances = scopedContext.resolvingContainer.instances;
        var existingInstance = containerInstances[this.registration.key];
        if (existingInstance) {
            return existingInstance;
        }
        var instance = this.innerResolver.resolve(scopedContext);
        containerInstances[this.registration.key] = instance;
        return instance;
    };
    InstancePerScopeResolver.prototype.resolveMany = function (context) {
        return [this.resolve(context)];
    };
    InstancePerScopeResolver.prototype.findScope = function (context) {
        if (context.resolvingContainer.scopeName === this.scopeName) {
            return context;
        }
        if (context.resolvingContainer === context.registeringContainer) {
            throw new Error("Scope '" + this.scopeName + "' not found when resolving '" + this.registration.key + "'.");
        }
        return this.findScope({
            registeringContainer: context.registeringContainer,
            resolvingContainer: context.resolvingContainer.parent
        });
    };
    return InstancePerScopeResolver;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InstancePerScopeResolver;
