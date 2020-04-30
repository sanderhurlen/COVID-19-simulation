// import assert from 'assert';
// import Grid from '../../src/Grid/Grid';
// import HealthyPerson from '../../src/Person/HealthyPerson';
// import Location from '../../src/Location/Location';
// import InfectedPerson from '../../src/Person/InfectedPerson';
// import Simulator from '../../src/Simulator/Simulator';

// describe('Grid', function () {
//     const grid: Grid = new Grid(3, 5);
//     const l = new Location(1, 1);
//     const lI = new Location(2, 2);
//     const p = new HealthyPerson(grid, l, 43);
//     const ip = new InfectedPerson(grid, lI, 44);

//     describe('#constructor()', function () {
//         it('should set fields: width and heigth', function () {
//             assert.equal(grid.width, 3);
//             assert.equal(grid.height, 5);
//         });
//         it('should be able to add a Person on [1][1]', () => {
//             grid.add(p);
//             assert.equal(grid.get(l), p);
//         });
//     });
//     describe('isOccupied()', function () {
//         it('should return true if place is occupied by person', () => {
//             grid.add(p);
//             grid.add(ip);
//             assert.equal(grid.isOccupied(lI), true);
//             assert.equal(grid.isOccupied(l), true);
//         });
//         it('should return true if place is not occupied. I.e. a null object is initialized at position', () => {
//             const noInl = new Location(0, 1);
//             assert.equal(grid.isOccupied(noInl), false);
//         });
//     });
//     describe('getAdjacentLocation()', () => {
//         const dirGrid = new Grid(1, 1);
//         it('should return (0,1) - bottom', () => {
//             const result = dirGrid.getAdjacentLocations(new Location(0, 0));
//             assert.equal(result[0].X, 0);
//             assert.equal(result[0].Y, 1);
//         });
//         it('should return (1, 0) - right', () => {
//             const result = dirGrid.getAdjacentLocations(new Location(0, 0));
//             assert.equal(result[1].X, 1);
//             assert.equal(result[1].Y, 0);
//         });
//         it('should return (1, 0) - top', () => {
//             const result = dirGrid.getAdjacentLocations(new Location(1, 1));
//             assert.equal(result[0].X, 1);
//             assert.equal(result[0].Y, 0);
//         });
//         it('should return (0, 1) - left', () => {
//             const result = dirGrid.getAdjacentLocations(new Location(1, 1));
//             assert.equal(result[1].X, 0);
//             assert.equal(result[1].Y, 1);
//         });
//     });
//     describe('getMoveableDirections()', function () {
//         const dirGrid = new Grid(1, 1);
//         const moveableGrid = new Grid(4, 4);
//         // it('should return only top, left and stay', () => {
//         //     assert.deepEqual(dirGrid.getMoveableDirections(new Location(1, 1)), [
//         //         new Location(1, 0),
//         //         new Location(0, 1),
//         //         new Location(1, 1),
//         //     ]);
//         // });
//         it('should return all moveable directions', () => {
//             const testArr = moveableGrid.getMoveableDirections(new Location(2, 2));
//             assert.deepEqual(testArr, [
//                 new Location(2, 3), // TOP
//                 new Location(3, 2), // RIGHT
//                 new Location(2, 1), // BOTTOM
//                 new Location(1, 2), // LEFT
//                 new Location(2, 2), // STAY
//             ]);
//         });
//         it('should return all but right which has a neighbor moveable directions', () => {
//             const p = new HealthyPerson(moveableGrid, new Location(3, 2));
//             moveableGrid.add(p);
//             console.log();

//             const testArr = moveableGrid.getMoveableDirections(new Location(2, 2));
//             assert.deepEqual(testArr, [
//                 new Location(2, 3), // TOP
//                 new Location(3, 2), // RIGHT
//                 new Location(2, 1), // BOTTOM
//                 new Location(1, 2), // LEFT
//                 new Location(2, 2), // STAY
//             ]);
//         });
//     });
//     describe('get()', function () {
//         it('should return a person', () => {});
//     });
// });
