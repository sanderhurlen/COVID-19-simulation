import Grid from '../Grid/Grid';
import Person from '../Person/Person';
import HealthyPerson from '../Person/HealthyPerson';
import Location from '../Location/Location';
import InfectedPerson from '../Person/InfectedPerson';
import Cell, { CellStates } from '../Cell/Cell';

export default class Simulator {
    private readonly AMOUNT_OF_PERSONS = 200;
    private readonly START_AMOUNT_INFECTED = 1;
    private readonly START_AMOUNT_HEALTHY = this.AMOUNT_OF_PERSONS - this.START_AMOUNT_INFECTED;

    // Sceneario quarantine fence : simulation 2
    private SCENEARIO = '';
    private readonly QUARANTINE_FENCE_ATX = 15;
    private readonly QUARANTINE_FENCE_INTERVAL = 8; // sec
    private _fences: Array<Cell>;
    private readonly NUM_OF_TIMES = 3;
    private numOfTimes: number;
    private readonly THREE_QUARTER_FREE = Math.floor((3 / 4) * this.AMOUNT_OF_PERSONS);
    private readonly ONE_IN_EIGHT_FREE = Math.floor((7 / 8) * this.AMOUNT_OF_PERSONS);

    // timer
    private currentTime: number;
    private timeAtReset: number;

    private _simulationField: Grid;
    private healthypersons: number;
    private infectedpersons: number;
    private recoveredpersons: number;
    private inQuarantine: number;
    private _persons: Array<Person>;
    private hours: number;

    constructor(width: number, height: number, sceneario?: string) {
        let w = width;
        let h = height;
        if (width <= 0 && height <= 0) {
            console.warn('Provided width and height is not acceptable');
            console.warn('using default values');
            w = 200;
            h = 400;
        }
        this._simulationField = new Grid(w, h);
        this.hours = 0;
        this.timeAtReset = 0;
        this.currentTime = 0;
        if (sceneario) this.SCENEARIO = sceneario;

        this.numOfTimes = 0;

        this.healthypersons = 0;
        this.infectedpersons = 0;
        this.recoveredpersons = 0;
        this.inQuarantine = 0;
        this._persons = [];
        this._fences = [];

        this.reset();
    }

    public simulate(): void {
        this.simulateOneStep();
    }

    private simulateOneStep(): void {
        this.currentTime = new Date().getSeconds();
        this.hours++;

        if (
            this.currentTime > this.timeAtReset + this.QUARANTINE_FENCE_INTERVAL &&
            this.numOfTimes < this.NUM_OF_TIMES
        ) {
            this.reduceQuarantineFence();
            this.timeAtReset = new Date().getSeconds();
            this.numOfTimes++;
        }

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
        this.hours = 0;
        this.timeAtReset = new Date().getSeconds();

        this.numOfTimes = 0;

        this.healthypersons = 0;
        this.infectedpersons = 0;
        this.recoveredpersons = 0;
        this.inQuarantine = 0;
        this._persons = [];
        this._fences = [];
        // TODO reset simulator views
        this.populate();
        // TODO update simulator views
    }

    private populate(): void {
        let occupiedLocations = 0;
        let loopRestriction = 0;

        if (this.SCENEARIO === 'QUARANTINE-FENCE') this.applyQuarantineFence();

        this.pickInfectedPerson();

        while (occupiedLocations < this.START_AMOUNT_HEALTHY && loopRestriction < 10000) {
            const posX = Math.floor(Math.random() * this._simulationField.width);
            const posY = Math.floor(Math.random() * this._simulationField.height);
            const tryLocation = new Location(posX, posY);

            if (!this._simulationField.isOccupied(tryLocation)) {
                const age = Math.floor(Math.random() * 92 + 1); // TODO add a max age variable?
                const addPerson = new HealthyPerson(this._simulationField, tryLocation, age);

                if (this.SCENEARIO === 'QUARANTINE-QUARTER') this.applyQuarantine(this.THREE_QUARTER_FREE);
                if (this.SCENEARIO === 'QUARANTINE-EIGHT') this.applyQuarantine(this.ONE_IN_EIGHT_FREE);

                this._persons.push(addPerson);
                this._simulationField.add(addPerson);
                this.healthypersons++;
                occupiedLocations++;
            }

            loopRestriction++;
        }
    }

    // TODO make this a little bit prettier...
    reduceQuarantineFence(): void {
        const beginning = this._fences.slice(0, Math.floor(this._fences.length / 2));
        const remove1 = beginning.pop();
        const remove2 = beginning.pop();
        const end = this._fences.slice(Math.floor(this._fences.length / 2), this._fences.length);
        const remove3 = end.shift();
        const remove4 = end.shift();
        if (remove1 != null) this._simulationField.clear(remove1?.location);
        if (remove2 != null) this._simulationField.clear(remove2?.location);
        if (remove3 != null) this._simulationField.clear(remove3?.location);
        if (remove4 != null) this._simulationField.clear(remove4?.location);

        this._fences = beginning.concat(end);
    }

    private applyQuarantineFence(): void {
        for (let y = 0; y < this._simulationField.grid[this.QUARANTINE_FENCE_ATX].length; y++) {
            const c = new Cell(this._simulationField, new Location(this.QUARANTINE_FENCE_ATX, y), CellStates.FENCE);
            this._simulationField.add(c);
            this._fences.push(c);
        }
    }

    /**
     * Applies quarantine restriction to a specified amount of the population
     * @param amount the number of people in quarantine
     */
    private applyQuarantine(amount: number): void {
        let loopRestriction = 0;
        let rnd: number;
        while (this.inQuarantine < amount && loopRestriction < 1000) {
            rnd = Math.floor(Math.random() * this._persons.length);
            const person = this._persons[rnd];
            if (person instanceof HealthyPerson && !person.isQuarantined()) {
                person.setQuarantine(true);
                this.inQuarantine++;
            }
            loopRestriction++;
        }
    }

    private pickInfectedPerson(): void {
        let rnd = 0;
        let x = 0;
        let y = 0;
        if (this.SCENEARIO === 'QUARANTINE-FENCE') {
            rnd = Math.floor(Math.random() * this.QUARANTINE_FENCE_ATX);
            x = rnd;
        } else {
            x = Math.floor(Math.random() * this._simulationField.width);
        }
        y = Math.floor(Math.random() * this._simulationField.height);
        const p = new InfectedPerson(this._simulationField, new Location(x, y), Math.floor(Math.random() * 10));

        this._simulationField.add(p);
        this._persons.push(p);
        this.infectedpersons++;
        this.healthypersons--;
    }

    /**
     * Returns an array of numbers with number of healthy persons and number of infected persons
     * TODO refactor to include number of dead
     * @returns [healthy people, infected people]
     */
    public currentSimulationDetails(): Array<number> {
        return [
            Math.floor(this.hours / 24),
            this.healthypersons,
            this.infectedpersons,
            this.recoveredpersons,
            this.inQuarantine,
        ];
    }

    public get simulationField(): Grid {
        return this._simulationField;
    }

    public get persons(): Array<Person> {
        return this._persons;
    }

    public get fences(): Array<Cell> {
        return this._fences;
    }

    /** Returns the current day the simulation is at.
     * @return days since the simulation started
     */
    public get simulationIsAt(): number {
        return Math.floor(this.hours / 24);
    }

    public simulationShouldEnd(): boolean {
        if (this.recoveredpersons == this.AMOUNT_OF_PERSONS) return true;
        if (this.recoveredpersons + this.healthypersons == this.AMOUNT_OF_PERSONS) return true;
        return false;
    }
}
