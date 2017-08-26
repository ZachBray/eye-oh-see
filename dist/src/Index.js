"use strict";
var RegistrationMetadata_1 = require("./attributes/RegistrationMetadata");
var Container_1 = require("./Container");
exports.Container = Container_1.default;
var SingleInstance_1 = require("./attributes/SingleInstance");
exports.SingleInstance = SingleInstance_1.default;
var InstancePerDependency_1 = require("./attributes/InstancePerDependency");
exports.InstancePerDependency = InstancePerDependency_1.default;
var InstancePerScope_1 = require("./attributes/InstancePerScope");
exports.InstancePerScope = InstancePerScope_1.default;
var Disposable_1 = require("./attributes/Disposable");
exports.Disposable = Disposable_1.default;
var ParamOf_1 = require("./attributes/ParamOf");
exports.ParamOf = ParamOf_1.default;
var ArrayOf_1 = require("./attributes/ArrayOf");
exports.ArrayOf = ArrayOf_1.default;
var Factory_1 = require("./attributes/Factory");
exports.Factory = Factory_1.default;
var ScopedFactory_1 = require("./attributes/ScopedFactory");
exports.ScopedFactory = ScopedFactory_1.default;
var UnitOfWork_1 = require("./attributes/UnitOfWork");
exports.UnitOfWork = UnitOfWork_1.default;
var ScopedUnitOfWork_1 = require("./attributes/ScopedUnitOfWork");
exports.ScopedUnitOfWork = ScopedUnitOfWork_1.default;
function hasRegistrationAnnotation(factory) {
    return RegistrationMetadata_1.default.hasMetadata(factory);
}
exports.hasRegistrationAnnotation = hasRegistrationAnnotation;
