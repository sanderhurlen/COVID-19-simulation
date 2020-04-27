import Grid from '../Grid/Grid';
import Location from '../Location/Location';

enum CellStates {
    'FREE',
    'BLOCKED',
}

enum StateType {
    'FENCE',
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
    private _stateType: StateType | null;

    constructor(grid: Grid, location: Location, state?: StateType) {
        this._grid = grid;
        this._location = location;

        if (state != null) {
            this._state = CellStates.BLOCKED;
            this._stateType = state;
        } else {
            this._state = CellStates.FREE;
            this._stateType = StateType.PERSON;
        }
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
