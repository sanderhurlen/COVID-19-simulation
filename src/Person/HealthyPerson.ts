import Person from './Person';
import Grid from '../Grid/Grid';
import Location from '../Location/Location';

/**
 * A healthy person is a person with no sickness,
 * which also means the person will not be able to infect other people
 * @author sander hurlen
 */
export default class HealthyPerson extends Person {
    constructor(field: Grid, location: Location, age?: number) {
        super(field, location, age);
    }

    public act(): void {
        const adjacents = this.getAdjacentLocations();

        this.moveToRandomAdjacentLocation();
    }
}
