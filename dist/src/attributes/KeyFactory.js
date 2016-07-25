"use strict";
var KeyFactory = (function () {
    function KeyFactory() {
    }
    KeyFactory.create = function (factory) {
        var name = factory.name || factory;
        var id = ++KeyFactory.nextId;
        return name + "_" + id;
    };
    KeyFactory.nextId = 0;
    return KeyFactory;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = KeyFactory;
