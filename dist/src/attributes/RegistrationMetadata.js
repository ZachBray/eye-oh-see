"use strict";
/// <reference path="../IContainer.ts" />
require('reflect-metadata');
var Parameter_1 = require('../parameters/Parameter');
var KeyFactory_1 = require('./KeyFactory');
var IOC_METADATA_KEY = 'ioc:metadata';
var RegistrationMetadata = (function () {
    function RegistrationMetadata(factory) {
        this.factory = factory;
        this.initializers = [];
        this.key = KeyFactory_1.default.create(factory);
        this.findDependencies();
    }
    RegistrationMetadata.findOrCreate = function (factory) {
        var existingMetadata = Reflect.getOwnMetadata(IOC_METADATA_KEY, factory);
        if (existingMetadata != null) {
            return existingMetadata;
        }
        var metadata = new RegistrationMetadata(factory);
        Reflect.defineMetadata(IOC_METADATA_KEY, metadata, factory);
        return metadata;
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
