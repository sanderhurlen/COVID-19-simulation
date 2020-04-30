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
        if (!this.isQuarantined()) {
            this.getAdjacentLocations();
            this.moveToRandomAdjacentLocation();
        }
    }

    public testMortality(): boolean {
        // if person suddenly dies, return true
        if (Math.random() <= this.mortality) return false;

        return true;
    }

    public onNewDay(): void {}
}
