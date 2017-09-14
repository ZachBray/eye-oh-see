"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = KeyFactory;
