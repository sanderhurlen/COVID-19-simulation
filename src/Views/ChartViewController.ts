import Observer from '../lib/observer';
import Chart from 'chart.js';
import { standard } from '../Chart/Config';
import SimulationStats from '../helper/SimulationStats';
import Person from '../Person/Person';

export default class ChartViewController extends Observer {
    private chartCanvas: any;
    private chartElement: any;
    private chart: Chart;

    constructor(canvasName: string) {
        super();
        this.chartCanvas = document.getElementById(canvasName);
        this.chartElement = this.chartCanvas.getContext('2d');
        this.chart = new Chart(this.chartElement, standard);
    }

    private setWidth(width: number): void {
        this.chartCanvas?.setAttribute('style', `width: ${width}px`);
    }

    private updateChart(data: SimulationStats): void {
        this.chart.data.labels!.push(data.day);
        if (this.chart.data.datasets) {
            this.chart.data.datasets[0].data!.push(data.suceptible);
            this.chart.data.datasets[1].data!.push(data.infected);
            this.chart.data.datasets[2].data!.push(data.recovered);
        }
        this.chart.update({ duration: 2 });
    }

    public update(data: SimulationStats): void {
        this.updateChart(data);
    }

    public OnDead(person: Person): void {}
}
