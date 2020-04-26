import p5 from 'p5';
import { Chart } from 'chart.js';
import Simulator from '../Simulator/Simulator';
import InfectedPerson from '../Person/InfectedPerson';
import Person from '../Person/Person';
import HealthyPerson from '../Person/HealthyPerson';

const sketch = (p: p5) => {
    const CANVAS_HEIGHT = 300;
    const CANVAS_WIDTH = 480;
    const SIM_H = 30;
    const SIM_W = 50;
    const RESOLUTION = 6;

    const BACKGROUND = 100;

    const xHealthyData: Array<number> = [];
    const xInfectedData: Array<number> = [];

    const sim = new Simulator(SIM_W, SIM_H);
    const SIMULATION_AMOUNT = 200;
    let grid = sim.simulationField;

    const canvas: any = document.getElementById('myChart');
    const ctx = canvas.getContext('2d');
    let chart: Chart = new Chart(ctx, {});

    const simulationEnded = false;

    function drawPerson(person: Person): void {
        const x = person?.location.X;
        const y = person?.location.Y;

        p.noStroke();
        p.fill(100, 100, 255);
        p.circle(x * RESOLUTION + RESOLUTION / 2, y * RESOLUTION + RESOLUTION / 2, RESOLUTION);
    }

    function drawSickPerson(person: Person, stage?: number): void {
        const x = person?.location.X;
        const y = person?.location.Y;
        p.noStroke();
        stage != null ? p.fill(255, 0, 180 + stage) : p.fill(255, 0, 180);
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
        chart.update();
    }

    function renderChart(sim: Simulator): void {
        const canvas: any = document.getElementById('myChart');

        const ctx = canvas.getContext('2d');

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'healthy',
                        data: [],
                        backgroundColor: ['rgba(54, 162, 235, 0.2)'],
                        borderColor: ['rgba(54, 162, 235, 1)'],
                        borderWidth: 1,
                        pointRadius: 0.5,
                        fill: false,
                    },
                    {
                        label: 'infected',
                        data: [],
                        backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                        borderColor: ['rgba(255, 99, 132, 1)'],
                        borderWidth: 1,
                        pointRadius: 0.5,
                    },
                    {
                        label: 'recovered',
                        data: [],
                        backgroundColor: ['rgba(0, 255, 180, 0.2)'],
                        borderColor: ['rgba(0, 255, 180, 1)'],
                        borderWidth: 1,
                        pointRadius: 0.5,
                    },
                ],
            },
            options: {
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                                suggestedMin: 0,
                                suggestedMax: 200,
                                fontColor: '#161616',
                            },
                            gridLines: {
                                color: '#161616',
                            },
                            display: false,
                        },
                    ],
                    xAxes: [
                        {
                            display: true,
                        },
                    ],
                },
            },
        });

        updateChart(sim.currentSimulationDetails());
    }

    p.setup = (): void => {
        p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        grid = sim.simulationField;
        p.background(BACKGROUND);
        for (let i = 0; i < grid.grid.length; i++) {
            for (let j = 0; j < grid.grid[i].length; j++) {
                const person: Person | null = grid.grid[i][j];
                if (person instanceof InfectedPerson) {
                    if (person.isSick()) drawSickPerson(person, person.stage);
                }
                if (person instanceof HealthyPerson) {
                    drawPerson(person);
                }
            }
        }
        renderChart(sim);
    };

    p.mouseClicked = (): void => {
        p.noLoop();
        console.log(chart.data.datasets);
    };

    p.draw = (): void => {
        p.frameRate(20);
        if (sim.simulationShouldEnd()) p.noLoop();
        if (sim.simulationIsAt % 20 == 0) updateChart(sim.currentSimulationDetails());

        p.background(BACKGROUND);
        sim.simulate();
        for (const person of sim.persons) {
            if (person instanceof InfectedPerson) {
                if (person.isSick()) {
                    drawSickPerson(person, person.stage);
                } else {
                    drawRecoveredPerson(person);
                }
            }
            if (person instanceof HealthyPerson) drawPerson(person);
        }
    };
};

export default sketch;
