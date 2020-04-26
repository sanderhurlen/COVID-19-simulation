/**
 * Holds the current location in the grid for a actor
 * @author sander hurlen
 */
export default class Location {
    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    public get X(): number {
        return this._x;
    }
    public get Y(): number {
        return this._y;
    }
}
