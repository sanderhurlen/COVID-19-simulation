import assert from 'assert';
import Grid from '../../src/Grid/Grid';
import Location from '../../src/Location/Location';
import HealthyPerson from '../../src/Person/HealthyPerson';

describe('Person', function () {
    const grid = new Grid(3, 5);
    const p = new HealthyPerson(grid, new Location(1, 1), 0);
    const p1 = new HealthyPerson(grid, new Location(1, 1), 43);
    describe('#constructor() : alive', function () {
        it('should return false is age is 0 and true if > 0', function () {
            assert.equal(p.isAlive(), false);
            assert.equal(p1.isAlive(), true);
        });
        it('should return true if age is > 0', function () {
            assert.equal(p1.isAlive(), true);
        });
        it('should return correct age 43 if age is 43', function () {
            assert.equal(p1.age, 43);
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

    describe('is sick or recovered', () => {
        it('should return true if person is sick', () => {
            assert.equal(p1.do(), true);
            assert.equal(p.do(), false);
        });
    });

    describe('mortality', () => {
        it('should return 0.08 if person is 70+', () => {
            const hp = new HealthyPerson(grid, new Location(1, 1), 70);
            const hp1 = new HealthyPerson(grid, new Location(1, 1), 71);
            const hp2 = new HealthyPerson(grid, new Location(1, 1), 80);
            assert.equal(hp.mortality, 0.08);
            assert.equal(hp1.mortality, 0.08);
            assert.notEqual(hp2.mortality, 0.08);
        });

        it('should return default value when age is not set', () => {
            const hp = new HealthyPerson(grid, new Location(1, 1));
            assert.equal(hp.mortality, 0.03);
        });

        it('should return correct mortality when 69 y/old, then when becoming 70 mortality should change', () => {
            const hp = new HealthyPerson(grid, new Location(1, 1), 69);
            assert.equal(hp.mortality, 0.036);
            hp.incrementAge();
            assert.equal(hp.mortality, 0.08);
        });

        it('should return default value if age is not set', () => {
            const hp = new HealthyPerson(grid, new Location(1, 1));
            assert.equal(hp.mortality, 0.03);
        });
    });
});
