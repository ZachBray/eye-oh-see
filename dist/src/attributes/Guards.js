"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assert = function (name, value) { return ({
    is: {
        a: {
            function: function () {
                if (typeof value !== 'function') {
                    var error = new Error("Expected " + name + " to be a function");
                    console.error(error.message, ' but was:', value, error);
                    if (value.default) {
                        console.warn("The error in " + name + " may result from importing the default export rather than a specific export.");
                    }
                    throw error;
                }
            }
        },
        not: {
            empty: function () {
                if (!(value instanceof Array)) {
                    var error = new Error("Expected " + name + " to be an array");
                    console.error(error.message, ' but was:', value, error);
                    throw error;
                }
                if (value.length === 0) {
                    var error = new Error("Expected " + name + " to be non-empty");
                    console.error(error.message, ' but was:', value, error);
                    throw error;
                }
            }
        }
    }
}); };
