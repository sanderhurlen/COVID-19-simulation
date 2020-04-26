import Person from '../Person/Person';
import Location from '../Location/Location';

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

    private _grid: Array<Array<Person | null>>;

    constructor(w: number, h: number) {
        this.width = w;
        this.height = h;

        this._grid = this.create(w, h);
    }

    private create(rows: number, cols: number): Array<Array<Person | null>> {
        const temp: Array<Array<Person | null>> = [];
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

    public getNeighbors(locations: Array<Location>): Array<Person> {
        const people: Array<Person> = [];
        locations.forEach((value) => {
            const some = this.get(value);
            if (some != null) people.push(some);
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

    public add(person: Person): Person | null {
        this._grid[person.location.X][person.location.Y] = person;
        return this._grid[person.location.X][person.location.Y];
    }

    public get(loc: Location): Person | null {
        return this._grid[loc.X][loc.Y];
    }

    public place(person: Person, location: Location): void {
        this.clear(location);
        this._grid[location.X][location.Y] = person;
    }

    public clear(location: Location): void {
        this._grid[location.X][location.Y] = null;
    }

    public isOccupied(loc: Location): boolean {
        return this._grid[loc.X][loc.Y] != null;
    }

    public get grid(): Array<Array<Person | null>> {
        return this._grid;
    }
}
