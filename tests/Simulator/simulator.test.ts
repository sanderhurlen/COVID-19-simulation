import assert from 'assert';
import Grid from '../../src/Grid/Grid';
import HealthyPerson from '../../src/Person/HealthyPerson';
import Location from '../../src/Location/Location';
import InfectedPerson from '../../src/Person/InfectedPerson';
import Simulator from '../../src/Simulator/Simulator';

describe('Simulator', function () {
    const grid: Grid = new Grid(3, 5);
    const l = new Location(1, 1);
    const p = new HealthyPerson(grid, l, 43);

    describe('test if simulation grid is different()', function () {
        it('should not have to equal grids', function () {
            const arr = [p];
            // assert.deepEqual(arr[0], p);
            assert.equal(arr[0].location.X, l.X);
            const l2 = new Location(2, 2);
            p.move(l2);
            assert.equal(arr[0].location.X, l2.X);
        });
    });
});
