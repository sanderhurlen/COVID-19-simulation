import Grid from '../Grid/Grid';
import Location from '../Location/Location';

export enum CellStates {
    'FREE',
    'FENCE',
    'BLOCKED',
    'PERSON',
}

/** A cell for the simulation grid.
 * This cell is able to hold special grid elements, for ex obstacles or other things that is necessary
 * @author sander hurlen
 */
export default class Cell {
    private _grid: Grid;
    private _location: Location;

    private _state: CellStates;

    constructor(grid: Grid, location: Location, state?: CellStates) {
        this._grid = grid;
        this._location = location;

        if (state != null) {
            this._state = state;
        } else {
            this._state = CellStates.FREE;
        }
    }

    public get isFence(): boolean {
        if (this._state == CellStates.FENCE) return true;
        return false;
    }

    public get grid(): Grid {
        return this._grid;
    }

    public get location(): Location {
        return this._location;
    }

    public setLocation(v: Location): void {
        this._location = v;
    }
}
