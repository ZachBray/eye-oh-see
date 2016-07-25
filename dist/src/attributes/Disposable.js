"use strict";
var RegistrationMetadata_1 = require('./RegistrationMetadata');
function Disposable(dispose) {
    if (dispose === void 0) { dispose = function (instance) { return instance.dispose(); }; }
    return function (target) {
        var metadata = RegistrationMetadata_1.default.findOrCreate(target);
        metadata.addInitialization(function (registration) { return registration.disposeBy(dispose); });
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Disposable;
