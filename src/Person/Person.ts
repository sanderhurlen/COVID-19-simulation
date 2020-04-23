import Grid from '../Grid/Grid';
import Location from '../Location/Location';
/**
 * An interface for an actor in the simulator
 * The Actor is a entity that can be stored in the grid,
 * and soSomething() - act()
 * The different classes that can act in the simulator would
 * have to extend this class to be eligeble to act in the simulator
 * @author sander hurlen
 */

export default abstract class Person {
    private grid: Grid;
    private location: Location;

    private alive: boolean;
    private age: number;

    private quarantined: boolean;

    /** Constructs a Person object that can be refered to from the simulation
     * The base class for all persons in the simulation. Needs to have a grid and location.
     * isQuarantied is an optional parameter that can be set if needed.
     */
    constructor(
        grid: Grid,
        location: Location,
        age = 0,
        isQuarantined = false
    ) {
        this.grid = grid;
        this.location = location;
        this.age = age;
        this.age > 0 ? (this.alive = true) : (this.alive = false);
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
        if (this.alive) {
            this.act();

            return true;
        }
        return false;
    }

    public getAge(): number {
        return this.age;
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

    public getLocation(): Location {
        return this.location;
    }
}
