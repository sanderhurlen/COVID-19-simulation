import Person from './Person';
import Location from '../Location/Location';
import Grid from '../Grid/Grid';
import HealthyPerson from './HealthyPerson';
import { defaultMortality } from './PersonAgeStats';

/**
 * A infected person is a person that has been infected,
 * which also means the person can infect other people.
 * A infected person may only be in the starting stage of the disease. I.e. the incubation of the disease.
 * This means he/she may be in quarantine or something
 * @author sander hurlen
 */
export default class InfectedPerson extends Person {
    private INCUBATION_TIME = 4; // days
    private SICKNESS_PERIOD = 14; // days

    private _daysSick: number;
    private _totalInfectedPersons = 0;

    constructor(field: Grid, location: Location, age?: number) {
        super(field, location, age);
        this._daysSick = 0;
    }

    public act(): void {
        if (this.isSick()) {
            this.tryInfectPeople();
        }

        // const people = this.getNeighbors();
        // FIX possibly only infecting people that are at same position when person is trying
        // E.G. a healthy person is at position 70, 49 on step 1
        // hp moves to 69,49 in step 2
        // Inf. person is at position 71, 49 on step 1. Tries to infect surrondings incl hp at 70, 49. But person is not there anymore
        if (!this.isQuarantined()) this.moveToRandomAdjacentLocation();
    }

    /** Implements abstract method from Person class.
     * This function is triggered on every new day.
     */
    public onNewDay(): void {
        this._daysSick++;
    }

    /** Implements the abstract method given by Person class.
     * - See documentation on Person class
     * Comments:
     * - A infected person, that is sick (not recovered), has the mortality given by age group, if age and deaths is allowed.
     * - A infected person, that is recovered has normal mortality, given by the default value
     */
    public testMortality(ageIsAllowed: boolean): boolean {
        if (this.isSick() && ageIsAllowed) {
            if (Math.random() <= this.mortality) return true;
        } else {
            if (Math.random() <= defaultMortality) return true;
        }

        return false;
    }

    /** Returns the current stage of the sickness period
     * While a person is infected, it will endure different stages of the disease.
     * This function will return the information of the infected person,
     * much like a blood test!
     * ?TODO refactor this to more detailed
     * @return info about the current stage of the disease
     */
    public isSick(): boolean {
        return this._daysSick < this.SICKNESS_PERIOD;
    }

    public isRecovered(): boolean {
        return !this.isSick();
    }

    public get stage(): number {
        return this._daysSick;
    }

    /**
     * Try to infect people this person is in contact with.
     * Loops over all possible locations to possibly infect them.
     * @param neighbors to possibly infect
     */
    private tryInfectPeople(): void {
        const neighbors = this.getAdjacentLocations();
        for (const neighbor of neighbors) {
            const test = this.grid.get(neighbor);
            if (test instanceof HealthyPerson) {
                if (this.infect(test)) {
                    this._totalInfectedPersons++;
                }
            }
        }
    }

    private infect(person: Person): boolean {
        const infected = new InfectedPerson(person.grid, person.location, person.age);
        if (person.isQuarantined()) infected.setQuarantine(true);
        this.grid.place(infected, infected.location);
        return true;
    }
}
