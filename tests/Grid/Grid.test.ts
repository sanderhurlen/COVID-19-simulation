import assert from 'assert';
import Grid from '../../src/Grid/Grid';
import Person from '../../src/Person/Person';
import HealthyPerson from '../../src/Person/HealthyPerson';
import Location from '../../src/Location/Location';

describe('Grid', function () {
    const grid = new Grid(3, 5);
    const l = new Location(1, 1);
    const p = new HealthyPerson(grid, l, 43);
    describe('#constructor()', function () {
        it('should set fields: width and heigth', function () {
            assert.equal(grid.width, 3);
            assert.equal(grid.height, 5);
        });
        it('should print a Person[3][5]', () => {
            const print = (grid: Person[][]) => {
                for (const row of grid) {
                    for (const col of grid) {
                        console.log(row, col);
                    }
                }
            };
            print(grid.getGrid());
        });
        it('should be able to add a Person on [1][1]', () => {
            grid.add(p);
            assert.equal(grid.get(1, 1), p);
        });
    });
});
