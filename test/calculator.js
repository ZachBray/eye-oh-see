/* @flow */

import Calculator from '../src/calculator';
import {describe, it} from 'mocha';
import {expect} from 'chai';

describe('Adding', () => {
  it('should be commutative', () => {
    const calculator = new Calculator();
    expect(calculator.add(1, 2)).to.equal(calculator.add(2, 1));
  });
});
