import Grid from '../Grid/Grid';
import Person from '../Person/Person';
import HealthyPerson from '../Person/HealthyPerson';
import Location from '../Location/Location';
import InfectedPerson from '../Person/InfectedPerson';

export default class Simulator {
    private readonly AMOUNT_OF_PERSONS = 200;
    private readonly START_AMOUNT_INFECTED = 1;
    private readonly START_AMOUNT_HEALTHY = this.AMOUNT_OF_PERSONS - this.START_AMOUNT_INFECTED;

    private _simulationField: Grid;
    private healthypersons: number;
    private infectedpersons: number;
    private recoveredpersons: number;
    private _persons: Array<Person>;
    private days: number;

    constructor(width: number, height: number) {
        let w = width;
        let h = height;
        if (width <= 0 && height <= 0) {
            console.warn('Provided width and height is not acceptable');
            console.warn('using default values');
            w = 200;
            h = 400;
        }
        this._simulationField = new Grid(w, h);
        this.days = 0;
        this.healthypersons = 0;
        this.infectedpersons = 0;
        this.recoveredpersons = 0;
        this._persons = [];

        this.reset();
    }

    public simulate(): void {
        this.simulateOneStep();
    }

    private simulateOneStep(): void {
        this.days++;

        for (let i = this._persons.length - 1; i >= 0; i--) {
            const person = this._persons[i];
            if (!person.do()) {
                this._persons.splice(i, 1);
            }
        }
        this._persons = this.updateStats();
    }

    private updateStats(): Array<Person> {
        this._persons = new Array<Person>();
        this.healthypersons = 0;
        this.infectedpersons = 0;
        this.recoveredpersons = 0;
        const temp = new Array<Person>();
        for (const row in this._simulationField.grid) {
            for (const col of this._simulationField.grid[row]) {
                if (col instanceof Person) temp.push(col);
                if (col instanceof HealthyPerson) this.healthypersons++;
                if (col instanceof InfectedPerson && col.isSick()) this.infectedpersons++;
                if (col instanceof InfectedPerson && col.isRecovered()) this.recoveredpersons++;
            }
        }
        return temp;
    }

    private reset(): void {
        this.days = 0;
        this.healthypersons = 0;
        this.infectedpersons = 0;
        this.recoveredpersons = 0;
        this._persons = [];
        // TODO reset simulator views
        this.populate();
        // TODO update simulator views
    }

    private populate(): void {
        let occupiedLocations = 0;
        let loopRestriction = 0;
        this.placeInfectedPerson();

        while (occupiedLocations < this.START_AMOUNT_HEALTHY && loopRestriction < 10000) {
            const posX = Math.floor(Math.random() * this._simulationField.width);
            const posY = Math.floor(Math.random() * this._simulationField.width);
            const tryLocation = new Location(posX, posY);

            if (!this._simulationField.isOccupied(tryLocation)) {
                const age = Math.floor(Math.random() * 92 + 1); // TODO add a max age variable?
                const addPerson = new HealthyPerson(this._simulationField, tryLocation, age);

                this._persons.push(addPerson);
                this._simulationField.add(addPerson);
                this.healthypersons++;
                occupiedLocations++;
            }

            loopRestriction++;
        }
    }

    // TODO change the way we do it later
    private placeInfectedPerson(): void {
        const loc = new Location(
            Math.floor(Math.random() * this._simulationField.width),
            Math.floor(Math.random() * this._simulationField.height),
        );
        const p = new InfectedPerson(this._simulationField, loc, Math.floor(Math.random() * 10));
        this._simulationField.add(p);
        this.infectedpersons++;
        this._persons.push(p);
    }

    /**
     * Returns an array of numbers with number of healthy persons and number of infected persons
     * TODO refactor to include number of dead
     * @returns [healthy people, infected people]
     */
    public currentSimulationDetails(): Array<number> {
        return [this.days, this.healthypersons, this.infectedpersons, this.recoveredpersons];
    }

    public get simulationField(): Grid {
        return this._simulationField;
    }

    public get persons(): Array<Person> {
        return this._persons;
    }

    public get simulationIsAt(): number {
        return this.days;
    }

    public simulationShouldEnd(): boolean {
        if (this.recoveredpersons == this.AMOUNT_OF_PERSONS) return true;
        return false;
    }
}
