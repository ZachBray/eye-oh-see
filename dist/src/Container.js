"use strict";
/// <reference path="IContainer.ts" />
require("reflect-metadata");
var Registration_1 = require("./registration/Registration");
var RegistrationMetadata_1 = require("./attributes/RegistrationMetadata");
var Container = (function () {
    function Container(parentImpl, scopeName) {
        if (parentImpl === void 0) { parentImpl = null; }
        this.parentImpl = parentImpl;
        this.scopeName = scopeName;
        this.instances = {};
        this.registrations = {};
        this.resources = {};
        this.removeParentDisposer = null;
    }
    Object.defineProperty(Container.prototype, "parent", {
        get: function () {
            return this.parentImpl;
        },
        enumerable: true,
        configurable: true
    });
    Container.prototype.createChild = function (scopeName) {
        return new Container(this, scopeName);
    };
    Container.prototype.register = function (factory) {
        var metadata = RegistrationMetadata_1.default.findOrCreate(factory);
        if (this.registrations[metadata.key] != null) {
            return this.registrations[metadata.key];
        }
        var registration = new Registration_1.default(metadata.key, factory);
        metadata.initializeRegistration(registration, this);
        this.registrations[metadata.key] = registration;
        return registration;
    };
    Container.prototype.resolve = function (service, resolvingContainer) {
        if (resolvingContainer === void 0) { resolvingContainer = this; }
        return this.resolveAbstract(service, resolvingContainer);
    };
    Container.prototype.resolveAbstract = function (service, resolvingContainer) {
        if (resolvingContainer === void 0) { resolvingContainer = this; }
        var serviceKey = RegistrationMetadata_1.default.findOrCreate(service).key;
        var registration = this.registrations[serviceKey];
        if (registration == null && this.parentImpl == null) {
            throw new Error("No registrations in container for " + serviceKey);
        }
        else if (registration == null) {
            return this.parentImpl.resolveAbstract(service, resolvingContainer);
        }
        return registration.resolveOne({
            registeringContainer: this,
            resolvingContainer: resolvingContainer
        });
    };
    Container.prototype.resolveMany = function (service, resolvingContainer) {
        if (resolvingContainer === void 0) { resolvingContainer = this; }
        return this.resolveManyAbstract(service, resolvingContainer);
    };
    Container.prototype.resolveManyAbstract = function (service, resolvingContainer) {
        if (resolvingContainer === void 0) { resolvingContainer = this; }
        var serviceKey = RegistrationMetadata_1.default.findOrCreate(service).key;
        var registration = this.registrations[serviceKey];
        if (registration == null && this.parentImpl == null) {
            throw new Error("No registrations in container for " + serviceKey);
        }
        else if (registration == null) {
            return this.parentImpl.resolveManyAbstract(service, resolvingContainer);
        }
        return registration.resolveMany({
            registeringContainer: this,
            resolvingContainer: resolvingContainer
        });
    };
    Container.prototype.registerDisposable = function (disposable) {
        var _this = this;
        if (this.removeParentDisposer == null && this.parentImpl != null) {
            this.removeParentDisposer = this.parentImpl.registerDisposable(function () { return _this.dispose(); });
        }
        var resourceId = Container.nextId++;
        this.resources[resourceId] = disposable;
        return function () { return delete _this.resources[resourceId]; };
    };
    Container.prototype.dispose = function () {
        var _this = this;
        if (this.removeParentDisposer != null) {
            this.removeParentDisposer();
        }
        Object.keys(this.resources).forEach(function (resourceKey) { return _this.resources[resourceKey](); });
        this.resources = {};
        this.registrations = {};
    };
    return Container;
}());
Container.nextId = 0;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Container;
