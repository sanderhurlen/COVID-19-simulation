import Person from './Person';
import Location from '../Location/Location';
import Grid from '../Grid/Grid';
import HealthyPerson from './HealthyPerson';

/**
 * A infected person is a person that has been infected,
 * which also means the person can infect other people.
 * A infected person may only be in the starting stage of the disease. I.e. the incubation of the disease.
 * This means he/she may be in quarantine or something
 * @author sander hurlen
 */
export default class InfectedPerson extends Person {
    private readonly INCUBATION_TIME = 4; // days
    private readonly SICKNESS_PERIOD = 14; // days

    private timeSick: number;
    private _totalInfectedPersons = 0;

    constructor(field: Grid, location: Location, age?: number) {
        super(field, location, age);
        this.timeSick = 0;
    }

    public act(): void {
        this.timeSick++;
        // const people = this.getNeighbors();
        // FIX possibly only infecting people that are at same position when person is trying
        // E.G. a healthy person is at position 70, 49 on step 1
        // hp moves to 69,49 in step 2
        // Inf. person is at position 71, 49 on step 1. Tries to infect surrondings incl hp at 70, 49. But person is not there anymore
        this.tryInfectPeople();
        this.moveToRandomAdjacentLocation();
    }

    /** Returns the current stage of the sickness period
     * While a person is infected, it will endure different stages of the disease.
     * This function will return the information of the infected person,
     * much like a blood test!
     * ?TODO refactor this to more detailed
     * @return info about the current stage of the disease
     */
    public isSick(): boolean {
        return this.timeSick < this.SICKNESS_PERIOD;
    }

    public isRecovered(): boolean {
        return !this.isSick();
    }

    public get stage(): number {
        return this.timeSick;
    }

    /**
     * Try to infect people this person is in contact with.
     * Loops over all possible locations to possibly infect them.
     * @param neighbors to possibly infect
     */
    private tryInfectPeople(): void {
        const neighbors = this.getPeopleNearby(this.location);
        for (const neighbor of neighbors) {
            if (neighbor instanceof HealthyPerson) {
                if (this.infect(neighbor)) {
                    this._totalInfectedPersons++;
                }
            }
        }
    }

    private infect(person: Person): boolean {
        if (!person.isQuarantined()) {
            const infected = new InfectedPerson(person.getField(), person.location, person.age);
            this.getField().place(infected, infected.location);
            return true;
        }
        return false;
    }
}
