import Person from '../Person/Person';
import Location from '../Location/Location';
import Cell, { CellStates } from '../Cell/Cell';

/**
 * Creates a grid to simulate on
 * The grid is generated with a width and height, and a single position in the grid can hold a Actor
 * @author sander hurlen
 */
export default class Grid {
    private readonly DEFAULT_WIDTH = 400;
    private readonly DEFAULT_HEIGHT = 400;
    public readonly width: number;
    public readonly height: number;

    private _grid: Array<Array<Cell | null>>;

    constructor(w: number, h: number) {
        this.width = w;
        this.height = h;

        this._grid = this.create(w, h);
    }

    private create(rows: number, cols: number): Array<Array<Cell | null>> {
        const temp: Array<Array<Cell | null>> = [];
        for (let i = 0; i < rows; i++) {
            temp[i] = [];
            for (let j = 0; j < cols; j++) {
                temp[i][j] = null;
            }
        }

        return temp;
    }

    // ! TODO is this working??
    public getAdjacentLocations(location: Location): Array<Location> {
        const dirs: Array<Location> = [];
        if (location.Y + 1 < this.height) dirs.push(new Location(location.X, location.Y + 1)); // TOP
        if (location.X + 1 < this.width) dirs.push(new Location(location.X + 1, location.Y)); // RIGHT
        if (location.Y - 1 >= 0) dirs.push(new Location(location.X, location.Y - 1)); // BOTTOM
        if (location.X - 1 >= 0) dirs.push(new Location(location.X - 1, location.Y)); // LEFT
        return dirs;
    }

    public getAllAdjacentLocations(loc: Location): Array<Person> {
        const selected = new Array<Person>();
        for (let row = -1; row <= 1; row++) {
            const currentRow = loc.X + row;
            if (currentRow >= 0 && currentRow < this.width) {
                for (let column = -1; column <= 1; column++) {
                    const currentColumn = loc.Y + column;
                    if (currentColumn >= 0 && currentColumn < this.height && (column != 0 || row != 0)) {
                        // const some = this.get(new Location(currentRow, currentColumn));
                        const some = this.grid[currentRow][currentColumn];
                        console.log(some);

                        // if (some instanceof Person) selected.push(some);
                    }
                }
            }
        }
        return selected;
    }

    public getNeighbors(locations: Array<Location>): Array<Person> {
        const people: Array<Person> = [];
        locations.forEach((value) => {
            const some = this.get(value);
            if (some instanceof Person) people.push(some);
        });
        return people;
    }

    public getMoveableDirections(location: Location): Array<Location> {
        const dirs: Array<Location> = this.getAdjacentLocations(location);

        if (dirs.length > 0) {
            for (let i = dirs.length - 1; i >= 0; i--) {
                // Remove an occupied element from array
                if (this.isOccupied(dirs[i])) dirs.splice(i, 1);
            }
        }
        dirs.push(location); // ADD STAY AS DEFAULT
        return dirs;
    }

    public add(cell: Cell): void {
        this.grid[cell.location.X][cell.location.Y] = cell;
    }

    public get(loc: Location): Cell | null {
        return this.grid[loc.X][loc.Y];
    }

    public place(person: Person, location: Location): void {
        this.clear(location);
        this.add(person);
    }

    public clear(location: Location): void {
        this.grid[location.X][location.Y] = null;
    }

    public isOccupied(loc: Location): boolean {
        return this.grid[loc.X][loc.Y] != null;
    }

    public get grid(): Array<Array<Cell | null>> {
        return this._grid;
    }
}
