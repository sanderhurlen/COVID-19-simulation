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

    /** Constructs a Person object that can be refered to from the simulation
     * The base class for all persons in the simulation. Needs to have a grid and location.
     * isQuarantied is an optional parameter that can be set if needed.
     */
    constructor(field: Grid, location: Location, age = -1, isQuarantined = false) {
        super(field, location);
        this._age = age;
        this._ageMortality = this.calculateMortalityOfAgeGroup();

        this._age > 0 ? (this.alive = true) : (this.alive = false);
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
        if (!this.alive) {
            this.setDead();
            return false;
        }
        // if (this.isQuarantined()) return false;

        this.act();

        return true;
    }

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
     * increments the age of the person.
     * When the person is aging and approaching a new decade, the mortality changes to the new age group
     */
    public incrementAge(): void {
        this._age++;
        if (this._age % 10 == 0) {
            this._ageMortality = this.calculateMortalityOfAgeGroup();
        }
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
