"use strict";
/// <reference path="../IContainer.ts" />
require("reflect-metadata");
var Parameter_1 = require("../parameters/Parameter");
var KeyFactory_1 = require("./KeyFactory");
var IOC_METADATA_KEY = 'ioc:metadata';
var RegistrationMetadata = (function () {
    function RegistrationMetadata(factory) {
        this.factory = factory;
        this.initializers = [];
        this.key = KeyFactory_1.default.create(factory);
        this.findDependencies();
    }
    RegistrationMetadata.hasMetadata = function (factory) {
        return factory[IOC_METADATA_KEY] != null;
    };
    RegistrationMetadata.findOrCreate = function (factory) {
        if (!RegistrationMetadata.hasMetadata(factory)) {
            Object.defineProperty(factory, IOC_METADATA_KEY, {
                // enumerable is false by default so we shouldn't inherit this property on sub types
                value: new RegistrationMetadata(factory)
            });
        }
        return factory[IOC_METADATA_KEY];
    };
    RegistrationMetadata.prototype.initializeRegistration = function (registration, container) {
        this.initializers.forEach(function (init) { return init(registration, container); });
    };
    RegistrationMetadata.prototype.addInitialization = function (initializer) {
        this.initializers.push(initializer);
    };
    RegistrationMetadata.prototype.findDependencies = function () {
        var paramTypes = Reflect.getMetadata('design:paramtypes', this.factory);
        if (paramTypes != null) {
            this.addInitialization(function (registration) {
                registration.parameters = paramTypes.map(function (t) { return new Parameter_1.default(t); });
            });
        }
    };
    return RegistrationMetadata;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RegistrationMetadata;
