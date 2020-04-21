import assert from 'assert';
import Calculator from '../src/Calculator';

describe('calculate', function () {
  it('add', function () {
    let result = Calculator.Sum(5, 2);
    assert.equal(result, 7);
  });
});
