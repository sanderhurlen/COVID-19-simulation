import Grid from '../Grid/Grid';
import Location from '../Location/Location';
import Cell from '../Cell/Cell';
import { defaultMortality, ageMortalities } from './PersonAgeStats';
/**
 * An interface for an actor in the simulator
 * The Actor is a entity that can be stored in the grid,
 * and soSomething() - act()
 * The different classes that can act in the simulator would
 * have to extend this class to be eligeble to act in the simulator
 * @author sander hurlen
 */

export default abstract class Person extends Cell {
    private _age: number;
    private _ageMortality = -1;

    private alive: boolean;
    private quarantined: boolean;

    private deathIsAllowed: boolean;
    private ageIsAllowed: boolean;

    private _days: number;
    private _hours: number;

    /** Constructs a Person object that can be refered to from the simulation
     * The base class for all persons in the simulation. Needs to have a grid and location.
     * isQuarantied is an optional parameter that can be set if needed.
     */
    constructor(field: Grid, location: Location, age = -1, isQuarantined = false) {
        super(field, location);
        this._age = age;
        this._ageMortality = this.calculateMortalityOfAgeGroup();

        // ? TODO maybe this should be passed in as parameters to do()?
        this._days = 0;
        this._hours = 0;
        // TOD0-END

        this.deathIsAllowed = false;
        this.ageIsAllowed = false;

        this._age >= 0 ? (this.alive = true) : (this.alive = false);
        this.quarantined = isQuarantined;
    }

    /**
     * Abstract method that should implement what a person that is alive can do.
     * A healthy person might move freely, and just live their lives.
     * A sick person might not understand it is sick yet.
     * etc.
     */
    abstract act(): void;

    /**
     * Actionable method to make a person do something.
     * This method makes the person interact if it is alive.
     */
    public do(): boolean {
        this._hours++;

        if (this._hours == 24 && this.alive) {
            this.incrementDay();
            this._hours = 0;

            if (this._days == 3) {
                this.incrementAge();
                this._days = 0;
            }
        }

        if (!this.alive) {
            this.setDead();
            return false;
        }

        this.act();

        return true;
    }

    /**
     * increments the age of the person.
     * When person is aging and approaching a new decade, the mortality changes to the new age group.
     * Every birthday, the person is also tested for their mortality. If the person dies
     */
    public incrementAge(): void {
        this._age++;
        if (this._age % 10 == 0) {
            this._ageMortality = this.calculateMortalityOfAgeGroup();
        }

        if (this.deathIsAllowed) {
            this.alive = this.testMortality(this.ageIsAllowed);
        }
    }

    private incrementDay(): void {
        this._days++;
        this.onNewDay();
    }

    /** a trivial abstract method for a class that is extending the person to apply something
     *  that is happening every day. For example a sick person
     * may increment the count of days sick... */
    public abstract onNewDay(): void;

    /**
     * Implement this method to test the mortality of the person.
     * Should return true if person died of their mortality probability or false if not.
     * A healthy person is not affected by the different probability of mortality unless it becomes infected.
     * This means a infected person is more likely to die because of a higher mortality.
     *
     * @param ageAllowed pass the value of if age is allowed in the simulation
     */
    public abstract testMortality(ageAllowed: boolean): boolean;

    private setDead(): void {
        this.alive = false;
    }

    public isAlive(): boolean {
        return this.alive;
    }

    public isQuarantined(): boolean {
        return this.quarantined;
    }

    public setQuarantine(value: boolean): boolean {
        this.quarantined = value;
        return this.quarantined;
    }

    public get age(): number {
        if (this._age === -1) throw new Error('Age is not assigned to a simulation value');

        return this._age;
    }

    /**
     * Returns the given mortatlity for the persons age group.
     * This value is updated at every single enter of a new decade
     * @returns mortality of the age group is within
     */
    public get mortality(): number {
        if (this._ageMortality === -1) throw new Error('Mortality is not assigned to a simulation value');

        return this._ageMortality;
    }

    /**
     * get the mortality rate for this person's age group.
     * @returns mortality of the persons age group
     */
    public calculateMortalityOfAgeGroup(): number {
        let mortality = defaultMortality; // set default value from './PersonAgeStats'
        let index = 0;
        let found = false;
        while (index < ageMortalities.length && !found) {
            const mg = ageMortalities[index];

            if (this._age >= mg.age) {
                mortality = mg.mortality;
                found = true;
            }
            index++;
        }

        return mortality;
    }

    // ! TODO REFACTOR THIS OUT

    /**
     * Returns a list of adjacent locations of persons position
     * @returns locations of moveable directions
     */
    public getAdjacentLocations(): Array<Location> {
        return this.grid.getAdjacentLocations(this.location);
    }

    public getNeighbors(): Array<Person> {
        return this.grid.getNeighbors(this.getAdjacentLocations());
    }

    public getPeopleNearby(loc: Location): Array<Person> {
        let selected: Array<Person> = [];
        selected = this.grid.getAllAdjacentLocations(loc);
        return selected;
    }

    public moveToRandomAdjacentLocation(): void {
        const adjacents = this.grid.getMoveableDirections(this.location);
        const lucky = Math.floor(Math.random() * adjacents.length);
        this.move(adjacents[lucky]);
    }

    /**
     * Moves to the desired location.
     * @param newLocation the location the person are moving to
     */
    public move(newLocation: Location): void {
        this.grid.clear(this.location);
        this.setLocation(newLocation);
        this.grid.place(this, newLocation);
    }
}
