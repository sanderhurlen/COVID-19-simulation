import assert from 'assert';
import Grid from '../../src/Grid/Grid';
import Location from '../../src/Location/Location';
import HealthyPerson from '../../src/Person/HealthyPerson';

describe('Person', function () {
    const p = new HealthyPerson(new Grid(100, 100), new Location(1, 1), 0);
    const p1 = new HealthyPerson(new Grid(100, 100), new Location(1, 1), 43);
    describe('#constructor() : alive', function () {
        it('should return false is age is 0 and true if > 0', function () {
            assert.equal(p.isAlive(), false);
            assert.equal(p1.isAlive(), true);
        });
        it('should return true if age is > 0', function () {
            assert.equal(p1.isAlive(), true);
        });
        it('should return correct age 43 if age is 43', function () {
            assert.equal(p1.getAge(), 43);
        });
    });

    describe('Quarantine', function () {
        it('should return false if not quarantined after object creation', function () {
            assert.equal(p.isQuarantined(), false);
        });
        it('should return true if quarantine is set', () => {
            assert.equal(p.setQuarantine(true), true);
        });
    });

    describe('do() and act()', () => {
        it('should return true if person can act', () => {
            assert.equal(p1.do(), true);
            assert.equal(p.do(), false);
        });
    });
});
