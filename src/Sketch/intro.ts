import p5 from 'p5';
import { Chart } from 'chart.js';
import { standard } from '../Chart/Config';
import Simulator from '../Simulator/Simulator';
import InfectedPerson from '../Person/InfectedPerson';
import Person from '../Person/Person';
import HealthyPerson from '../Person/HealthyPerson';
import Cell from '../Cell/Cell';

const sketch = (p: p5) => {
    let start = false;

    const CANVAS_HEIGHT = 300;
    const CANVAS_WIDTH = 480;
    const SIM_H = 40;
    const SIM_W = 60;
    const RESOLUTION = 6;

    const BACKGROUND = 100;

    const xHealthyData: Array<number> = [];
    const xInfectedData: Array<number> = [];

    let lastValue = 0;
    const sim = new Simulator(SIM_W, SIM_H);
    const SIMULATION_AMOUNT = 200;
    let grid = sim.simulationField;

    const canvas: any = document.getElementById('sim-1');
    const ctx = canvas.getContext('2d');
    let chart: Chart = new Chart(ctx, standard);

    const simulationEnded = false;

    function drawPerson(person: Person): void {
        const x = person?.location.X;
        const y = person?.location.Y;

        p.noStroke();
        p.fill(100, 100, 255);
        p.circle(x * RESOLUTION + RESOLUTION / 2, y * RESOLUTION + RESOLUTION / 2, RESOLUTION);
    }

    function drawSickPerson(person: Person): void {
        const x = person?.location.X;
        const y = person?.location.Y;
        p.noStroke();
        p.fill(255, 0, 180);
        p.circle(x * RESOLUTION + RESOLUTION / 2, y * RESOLUTION + RESOLUTION / 2, RESOLUTION);
    }

    function drawRecoveredPerson(person: Person): void {
        const x = person?.location.X;
        const y = person?.location.Y;
        p.noStroke();
        p.fill(0, 255, 180);
        p.circle(x * RESOLUTION + RESOLUTION / 2, y * RESOLUTION + RESOLUTION / 2, RESOLUTION);
    }

    // TODO refactor to object instead of array (data)
    function updateChart(data: Array<number>): void {
        const daysDataID = 0;
        const healthyDataID = 1;
        const infectedDataID = 2;
        const recoveredDataID = 3;

        chart.data.labels!.push(data[daysDataID]);
        if (chart.data.datasets) {
            chart.data.datasets[0].data!.push(data[healthyDataID]);
            chart.data.datasets[1].data!.push(data[infectedDataID]);
            chart.data.datasets[2].data!.push(data[recoveredDataID]);
        }
        console.log(data[0], data[1], data[2]);
        chart.update({ duration: 2 });
    }

    function renderChart(sim: Simulator): void {
        const canvas: any = document.getElementById('sim-1');
        const ctx = canvas.getContext('2d');

        chart = new Chart(ctx, standard);
        const c = document.getElementById('sim-1');
        c?.setAttribute('style', `width: ${600}px`);
        updateChart(sim.currentSimulationDetails());
    }

    p.setup = (): void => {
        lastValue = sim.simulationIsAt;
        p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        grid = sim.simulationField;
        p.background(BACKGROUND);
        for (let i = 0; i < grid.grid.length; i++) {
            for (let j = 0; j < grid.grid[i].length; j++) {
                const cell: Cell | null = grid.grid[i][j];
                if (cell instanceof Person) {
                    if (cell instanceof InfectedPerson) {
                        if (cell.isSick()) drawSickPerson(cell);
                    }
                    if (cell instanceof HealthyPerson) {
                        drawPerson(cell);
                    }
                }
            }
        }
        renderChart(sim);
    };

    p.mouseClicked = (): void => {
        if (!start) p.noLoop();
        start = true;
    };

    p.draw = (): void => {
        p.frameRate(10);
        if (sim.simulationShouldEnd()) p.noLoop();
        if (sim.simulationIsAt > lastValue) {
            updateChart(sim.currentSimulationDetails());
            lastValue = sim.simulationIsAt;
        }
        p.background(BACKGROUND);
        sim.simulate();
        for (const person of sim.persons) {
            if (person instanceof InfectedPerson) {
                if (person.isSick()) {
                    drawSickPerson(person);
                } else {
                    drawRecoveredPerson(person);
                }
            }
            if (person instanceof HealthyPerson) drawPerson(person);
        }
    };
};

export default sketch;
