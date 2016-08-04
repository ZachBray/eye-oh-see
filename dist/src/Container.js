"use strict";
/// <reference path="IContainer.ts" />
require('reflect-metadata');
var Registration_1 = require('./registration/Registration');
var RegistrationMetadata_1 = require('./attributes/RegistrationMetadata');
var Container = (function () {
    function Container(parentImpl) {
        if (parentImpl === void 0) { parentImpl = null; }
        this.parentImpl = parentImpl;
        this.registrations = {};
        this.children = {};
        this.resources = [];
        this.id = ++Container.nextId;
        this.parent = parentImpl;
    }
    Container.prototype.createChild = function () {
        var _this = this;
        var child = new Container(this);
        this.children[child.id] = child;
        child.registerDisposable(function () { return delete _this.children[child.id]; });
        return child;
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
        var serviceKey = RegistrationMetadata_1.default.findOrCreate(service).key;
        var registration = this.registrations[serviceKey];
        if (registration == null && this.parentImpl == null) {
            throw new Error("No registrations in container for " + serviceKey);
        }
        else if (registration == null) {
            return this.parentImpl.resolve(service, resolvingContainer);
        }
        return registration.resolveOne({
            registeringContainer: this,
            resolvingContainer: resolvingContainer
        });
    };
    // TODO: Refactor to remove duplication here.
    Container.prototype.resolveMany = function (service, resolvingContainer) {
        if (resolvingContainer === void 0) { resolvingContainer = this; }
        var serviceKey = RegistrationMetadata_1.default.findOrCreate(service).key;
        var registration = this.registrations[serviceKey];
        if (registration == null && this.parentImpl == null) {
            throw new Error("No registrations in container for " + serviceKey);
        }
        else if (registration == null) {
            return this.parentImpl.resolveMany(service, resolvingContainer);
        }
        return registration.resolveMany({
            registeringContainer: this,
            resolvingContainer: resolvingContainer
        });
    };
    Container.prototype.registerDisposable = function (disposable) {
        this.resources.push(disposable);
    };
    Container.prototype.dispose = function () {
        var _this = this;
        Object.keys(this.children).forEach(function (id) { return _this.children[id].dispose(); });
        this.children = {};
        this.resources.forEach(function (dispose) { return dispose(); });
        this.resources = [];
        this.registrations = {};
    };
    Container.nextId = 0;
    return Container;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Container;
