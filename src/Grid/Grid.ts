import Person from '../Person/Person';

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

    private grid: Person[][];

    constructor(w: number, h: number) {
        this.width = w;
        this.height = h;

        this.grid = this.create(w, h);
    }

    private create(rows: number, cols: number): Person[][] {
        const temp: Person[][] = [];
        for (let i = 0; i < rows; i++) {
            temp[i] = [];
            for (let j = 0; j < cols; j++) {
                temp[i][j] = {} as Person;
            }
        }
        return temp;
    }

    public add(person: Person): Person {
        this.grid[person.getLocation().X()][person.getLocation().Y()] = person;
        return this.grid[person.getLocation().X()][person.getLocation().Y()];
    }

    public get(atX: number, atY: number): Person {
        return this.grid[atX][atY];
    }

    public getGrid(): Person[][] {
        return this.grid;
    }
}
