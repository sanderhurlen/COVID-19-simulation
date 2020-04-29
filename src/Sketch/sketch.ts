import p5 from 'p5';
import { Chart } from 'chart.js';
import { standard } from '../Chart/Config';
import Simulator from '../Simulator/Simulator';
import InfectedPerson from '../Person/InfectedPerson';
import Person from '../Person/Person';
import HealthyPerson from '../Person/HealthyPerson';
import Cell from '../Cell/Cell';
import { SimulationColors } from '../helper/SimulationColors';
import SimulationStats from '../helper/SimulationStats';

const sketch = (p: p5) => {
    let pause = false;

    const SIM_H = 40;
    const SIM_W = 60;
    const RESOLUTION = 6;
    const SPACE = 3;
    const POINT_POS = RESOLUTION;
    const POINT_CENTER = POINT_POS / 2;
    const SQUARE_POS = RESOLUTION;
    const POINT_SIZE = RESOLUTION;
    const SQUARE_SIZE = RESOLUTION;
    const CANVAS_HEIGHT = SIM_H * POINT_POS;
    const CANVAS_WIDTH = SIM_W * POINT_POS;

    const BACKGROUND = 100;

    let lastValue = 0;
    const sim = new Simulator(SIM_W, SIM_H, 'QUARANTINE-EIGHT');
    let grid = sim.simulationField;

    const canvas: any = document.getElementById('sim-1');
    const ctx = canvas.getContext('2d');
    let chart: Chart = new Chart(ctx, standard);

    function inQuarantineMarker(person: Person): void {
        p.strokeWeight(2);
        p.stroke(SimulationColors.QUARANTINE);
        p.noFill();
        p.rectMode('center');
        p.square(person.location.X * RESOLUTION + SPACE, person.location.Y * RESOLUTION + SPACE, RESOLUTION);
    }

    function drawPerson(person: Person): void {
        const x = person?.location.X;
        const y = person?.location.Y;
        let color = '#ffffff';

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

        if (!person.isAlive()) color = SimulationColors.DEAD;

        p.stroke(color);
        p.strokeWeight(5);
        p.point(x * RESOLUTION + POINT_CENTER, y * RESOLUTION + POINT_CENTER);
        if (person.isQuarantined()) inQuarantineMarker(person);
    }

    function drawFence(cell: Cell): void {
        const x = cell?.location.X;
        const y = cell?.location.Y;
        p.noStroke();
        p.fill(SimulationColors.FENCE);
        p.rectMode('center');
        p.square(x * RESOLUTION + SPACE, y * RESOLUTION + SPACE, RESOLUTION);
    }

    function updateChart(data: SimulationStats): void {
        chart.data.labels!.push(data.day);
        if (chart.data.datasets) {
            chart.data.datasets[0].data!.push(data.suceptible);
            chart.data.datasets[1].data!.push(data.infected);
            chart.data.datasets[2].data!.push(data.recovered);
        }
        console.log(data);
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
        p.background(SimulationColors.CANVAS_BACKGROUND);
        for (let i = 0; i < grid.grid.length; i++) {
            for (let j = 0; j < grid.grid[i].length; j++) {
                const cell: Cell | null = grid.grid[i][j];
                if (cell instanceof Cell && cell.isFence) drawFence(cell);
                if (cell instanceof Person) drawPerson(cell);
            }
        }
        renderChart(sim);
    };

    p.mouseClicked = (): void => {
        if (pause) {
            pause = false;
            p.loop();
        } else {
            pause = true;
        }
    };

    p.draw = (): void => {
        p.frameRate(20);
        if (sim.simulationShouldEnd() || pause) p.noLoop();
        if (sim.simulationIsAt > lastValue) {
            updateChart(sim.currentSimulationDetails());
            lastValue = sim.simulationIsAt;
        }
        p.background(SimulationColors.CANVAS_BACKGROUND);

        // draw fence
        if (sim.fences.length != 0) {
            for (const fence of sim.fences) {
                if (fence.isFence) drawFence(fence);
            }
        }

        sim.simulate();

        // draw all persons in grid
        for (const person of sim.persons) {
            drawPerson(person);
        }
    };
};

export default sketch;
