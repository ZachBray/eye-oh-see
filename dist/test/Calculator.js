"use strict";
var chai = require('chai');
var Calculator_1 = require('../src/Calculator');
var expect = chai.expect;
describe('Adding', function () {
    it('should be commutative', function () {
        var calculator = new Calculator_1.default();
        expect(calculator.add(1, 2)).to.equal(calculator.add(2, 1));
    });
});
