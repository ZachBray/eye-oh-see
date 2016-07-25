"use strict";
var FactoryParameter = (function () {
    function FactoryParameter(paramServices, service) {
        this.paramServices = paramServices;
        this.service = service;
    }
    FactoryParameter.prototype.resolve = function (container) {
        var _this = this;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if (args.length !== _this.paramServices.length) {
                throw new Error('Incorrect number of arguments passed to factory.');
            }
            if (args.length === 0) {
                return container.resolve(_this.service);
            }
            var child = container.createChild();
            args.forEach(function (arg, i) {
                var paramService = _this.paramServices[i];
                child.register(paramService).providedInstance(arg);
            });
            return child.resolve(_this.service);
        };
    };
    return FactoryParameter;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FactoryParameter;
