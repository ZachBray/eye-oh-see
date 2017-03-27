"use strict";
var KeyFactory = (function () {
    function KeyFactory() {
    }
    KeyFactory.create = function (factory) {
        var name = factory.name || factory;
        var id = ++KeyFactory.nextId;
        return name + "_" + id;
    };
    return KeyFactory;
}());
KeyFactory.nextId = 0;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = KeyFactory;
