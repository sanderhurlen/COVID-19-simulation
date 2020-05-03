import Grid from '../Grid/Grid';
import Person from '../Person/Person';
import HealthyPerson from '../Person/HealthyPerson';
import Location from '../Location/Location';
import InfectedPerson from '../Person/InfectedPerson';
import Cell, { CellStates } from '../Cell/Cell';
import { selectAgeFromDistribution } from '../Person/PersonAgeStats';
import { getRandomInt } from '../helper/random';
import SimulationStats from '../helper/SimulationStats';
import p5 from 'p5';
import { Chart } from 'chart.js';
import { standard } from '../Chart/Config';
import { SimulationColors } from '../helper/SimulationColors';
import SimConfig from '../helper/SimConfig';
import SimScenearios from '../helper/SimScenearios';
import Subject from '../lib/subject';
import StatView from '../Views/StatsViewController';
import ChartViewController from '../Views/ChartViewController';
import SimulationEventsController from '../Views/SimEventsController';

export default class Simulator extends Subject {
    private readonly AMOUNT_OF_PERSONS = 200;
    private readonly START_AMOUNT_INFECTED = 1;
    private readonly START_AMOUNT_HEALTHY = this.AMOUNT_OF_PERSONS - this.START_AMOUNT_INFECTED;

    private SCENEARIO: SimScenearios;
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
    // TODO redo this to one object of stats
    private healthypersons: number;
    private infectedpersons: number;
    private recoveredpersons: number;
    private inQuarantine: number;
    private dead: number;
    // ENDTODO
    private _persons: Array<Person>;
    private hours: number;

    private ageIsEnabled: boolean;
    private deathIsEnabled: boolean;

    private _p5: p5 | undefined;

    constructor(width: number, height: number, config: SimConfig) {
        super();
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
        this.SCENEARIO = config.sceneario;

        this.ageIsEnabled = false;
        this.deathIsEnabled = false;

        this.numOfTimes = 0;

        this.healthypersons = 0;
        this.infectedpersons = 0;
        this.recoveredpersons = 0;
        this.inQuarantine = 0;
        this.dead = 0;
        this._persons = [];
        this._fences = [];

        const statView = new StatView();
        const chartView = new ChartViewController('sim-1');
        const eventLog = new SimulationEventsController('logged-events');

        this.addObserver(statView);
        this.addObserver(chartView);
        this.addObserver(eventLog);

        this.reset();

        this.initialize(config.canvas);
    }

    private initialize(node: HTMLElement | undefined): void {
        const sketch = (p: p5): any => {
            const SIM_H = 40;
            const SIM_W = 60;
            const RESOLUTION = 6;
            const SPACE = 3;
            const POINT_POS = RESOLUTION;
            const POINT_CENTER = POINT_POS / 2;
            const CANVAS_HEIGHT = SIM_H * POINT_POS;
            const CANVAS_WIDTH = SIM_W * POINT_POS;

            let lastValue = 0;
            let grid = this.simulationField;

            function inQuarantineMarker(person: Person): void {
                p.strokeWeight(2);
                p.stroke(SimulationColors.QUARANTINE);
                p.noFill();
                p.rectMode('center');
                p.square(person.location.X * RESOLUTION + SPACE, person.location.Y * RESOLUTION + SPACE, RESOLUTION);
            }

            const drawPerson = (person: Person): void => {
                const x = person?.location.X;
                const y = person?.location.Y;
                let color = '#ffffff';

                if (person.isAlive()) {
                    if (person instanceof InfectedPerson) {
                        if (person.isSick()) {
                            color = SimulationColors.INFECTED;
                        } else {
                            color = SimulationColors.RECOVERED;
                        }
                    }
                    if (person instanceof HealthyPerson) {
                        color = SimulationColors.SUSCEPTIBLE;
                    }
                } else {
                    color = SimulationColors.DEAD;
                }

                p.stroke(color);
                p.strokeWeight(5);
                p.point(x * RESOLUTION + POINT_CENTER, y * RESOLUTION + POINT_CENTER);
                if (person.isQuarantined()) inQuarantineMarker(person);
            };

            function drawFence(cell: Cell): void {
                const x = cell?.location.X;
                const y = cell?.location.Y;
                p.noStroke();
                p.fill(SimulationColors.FENCE);
                p.rectMode('center');
                p.square(x * RESOLUTION + SPACE, y * RESOLUTION + SPACE, RESOLUTION);
            }

            p.setup = (): void => {
                lastValue = this.simulationIsAt;
                p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
                grid = this.simulationField;
                p.background(SimulationColors.CANVAS_BACKGROUND);
                for (let i = 0; i < grid.grid.length; i++) {
                    for (let j = 0; j < grid.grid[i].length; j++) {
                        const cell: Cell | null = grid.grid[i][j];
                        if (cell instanceof Cell && cell.isFence) drawFence(cell);
                        if (cell instanceof Person) drawPerson(cell);
                    }
                }
                this.notify(this.currentSimulationDetails());
                p.noLoop();
            };

            p.draw = (): void => {
                p.frameRate(20);
                if (this.simulationShouldEnd()) p.noLoop();
                if (this.simulationIsAt > lastValue) {
                    this.notify(this.currentSimulationDetails());
                    lastValue = this.simulationIsAt;
                }
                p.background(SimulationColors.CANVAS_BACKGROUND);

                // draw fence
                if (this.fences.length != 0) {
                    for (const fence of this.fences) {
                        if (fence.isFence) drawFence(fence);
                    }
                }

                this.simulate();

                // draw all persons in grid
                for (const person of this.persons) {
                    drawPerson(person);
                }
            };
        };

        this._p5 = new p5(sketch, node);
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
                this.notifyDead(person);
            }
        }
        this._persons = this.updateStats();
    }

    private updateStats(): Array<Person> {
        this._persons = new Array<Person>();
        this.healthypersons = 0;
        this.infectedpersons = 0;
        this.recoveredpersons = 0;
        this.dead = 0;
        const temp = new Array<Person>();
        for (const row in this._simulationField.grid) {
            for (const col of this._simulationField.grid[row]) {
                if (col instanceof Person) temp.push(col);
                if (col instanceof Person && !col.isAlive()) this.dead++;
                if (col instanceof HealthyPerson) this.healthypersons++;
                if (col instanceof InfectedPerson && col.isRecovered()) this.recoveredpersons++;
                if (col instanceof InfectedPerson && col.isSick()) this.infectedpersons++;
            }
        }
        return temp;
    }

    public start(): void {
        this._p5?.loop();
    }

    public pause(): void {
        this._p5?.noLoop();
    }

    public restart(): void {
        this.reset();
        this.pause();
        this._p5?.draw();
    }

    public enableAge(v: boolean): void {
        this.ageIsEnabled = v;
        this.restart();
    }

    public enableMortality(v: boolean): void {
        this.deathIsEnabled = v;
        this.restart();
    }

    private reset(): void {
        this._simulationField = new Grid(60, 40);
        this.hours = 0;
        this.timeAtReset = new Date().getSeconds();

        this.numOfTimes = 0;

        this.healthypersons = 0;
        this.infectedpersons = 0;
        this.recoveredpersons = 0;
        this.inQuarantine = 0;
        this._persons = [];
        this._fences = [];
        this.populate();
    }

    private populate(): void {
        let occupiedLocations = 0;
        let loopRestriction = 0;

        if (this.SCENEARIO === SimScenearios.QUARANTINE_FENCE) this.applyQuarantineFence();

        this.pickInfectedPerson();

        while (occupiedLocations < this.START_AMOUNT_HEALTHY && loopRestriction < 10000) {
            const posX = Math.floor(Math.random() * this._simulationField.width);
            const posY = Math.floor(Math.random() * this._simulationField.height);
            const tryLocation = new Location(posX, posY);

            if (!this._simulationField.isOccupied(tryLocation)) {
                const pa = selectAgeFromDistribution();
                const age = getRandomInt(pa.minAge, pa.maxAge);
                const addPerson = new HealthyPerson(this._simulationField, tryLocation, age);

                addPerson.enableAgeOption(this.ageIsEnabled);
                addPerson.enableDeathOption(this.deathIsEnabled);

                if (this.SCENEARIO === SimScenearios.QUARANTINE_QUARTER) this.applyQuarantine(this.THREE_QUARTER_FREE);
                if (this.SCENEARIO === SimScenearios.QUARANTINE_EIGHT) this.applyQuarantine(this.ONE_IN_EIGHT_FREE);

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
        if (this.SCENEARIO === SimScenearios.QUARANTINE_FENCE) {
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
     * @returns [healthy people, infected people]
     */
    public currentSimulationDetails(): SimulationStats {
        return {
            day: Math.floor(this.hours / 24),
            suceptible: this.healthypersons,
            infected: this.infectedpersons,
            recovered: this.recoveredpersons,
            inQuarantine: this.inQuarantine,
            dead: this.dead,
        };
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
