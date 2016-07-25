"use strict";
/// <reference path="IRegistration.ts" />
var InstancePerDependencyResolver_1 = require('../resolvers/InstancePerDependencyResolver');
var SingleInstanceResolver_1 = require('../resolvers/SingleInstanceResolver');
var ServiceImplementationResolver_1 = require('../resolvers/ServiceImplementationResolver');
var ProvidedInstanceResolver_1 = require('../resolvers/ProvidedInstanceResolver');
var CombinedResolver_1 = require('../resolvers/CombinedResolver');
var Quantity;
(function (Quantity) {
    Quantity[Quantity["One"] = 0] = "One";
    Quantity[Quantity["Many"] = 1] = "Many";
})(Quantity || (Quantity = {}));
var Registration = (function () {
    function Registration(key, factory) {
        this.key = key;
        this.factory = factory;
        this.parameters = [];
    }
    Registration.prototype.resolveOne = function (context) {
        return this.resolve(context, Quantity.One);
    };
    Registration.prototype.resolveMany = function (context) {
        return this.resolve(context, Quantity.Many);
    };
    Registration.prototype.singleInstance = function () {
        if (this.resolver != null) {
            throw new Error("Cannot specify singleInstance resolution strategy alongside other strategies (" + this.key + ")");
        }
        this.resolver = new SingleInstanceResolver_1.default(this);
        return this;
    };
    Registration.prototype.instancePerDependency = function () {
        if (this.resolver != null) {
            throw new Error("Cannot specify instancePerDependency resolution strategy alongside other strategies (" + this.key + ")");
        }
        this.resolver = new InstancePerDependencyResolver_1.default(this);
        return this;
    };
    Registration.prototype.providedInstance = function (instance) {
        if (this.resolver != null) {
            throw new Error("Cannot specify providedInstance resolution strategy alongside other strategies (" + this.key + ")");
        }
        this.resolver = new ProvidedInstanceResolver_1.default(instance);
    };
    Registration.prototype.resetResolutionStrategy = function () {
        this.resolver = null;
        return this;
    };
    Registration.prototype.implementedBy = function (serviceImpl) {
        var implementerResolver = new ServiceImplementationResolver_1.default(serviceImpl);
        if (this.resolver == null) {
            this.resolver = implementerResolver;
        }
        else if (this.resolver instanceof ServiceImplementationResolver_1.default || this.resolver instanceof CombinedResolver_1.default) {
            this.resolver = new CombinedResolver_1.default(this.key, [this.resolver, implementerResolver]);
        }
        else {
            throw new Error("Attempted to use an invalid combination of resolution strategies (" + this.key + ")");
        }
        return this;
    };
    Registration.prototype.disposeBy = function (disposalFunction) {
        if (this.disposalFunction != null) {
            throw new Error("Disposal function already specified for " + this.key);
        }
        this.disposalFunction = disposalFunction;
        return this;
    };
    Registration.prototype.resolve = function (context, quantity) {
        if (this.resolver == null) {
            throw new Error("No resolution strategy specified for " + this.key);
        }
        try {
            if (this.isResolving) {
                throw new Error('Loop detected');
            }
            this.isResolving = true;
            if (quantity === Quantity.One) {
                return this.resolver.resolve(context);
            }
            else {
                return this.resolver.resolveMany(context);
            }
        }
        catch (error) {
            throw new Error("When resolving " + this.key + ":\n\t" + error);
        }
        finally {
            this.isResolving = false;
        }
    };
    return Registration;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Registration;
