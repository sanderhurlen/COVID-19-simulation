import Simulator from '../Simulator/Simulator';
import Observer from '../lib/observer';
import SimulationStats from '../helper/SimulationStats';
import Person from '../Person/Person';

export default class StatView extends Observer {
    private suceptible: HTMLElement | null;
    private infected: HTMLElement | null;
    private recovered: HTMLElement | null;
    private dead: HTMLElement | null;

    constructor() {
        super();
        this.suceptible = document.getElementById('suceptible');
        this.infected = document.getElementById('infected');
        this.recovered = document.getElementById('recovered');
        this.dead = document.getElementById('dead');

        this.reset();
    }

    public update(data: SimulationStats): void {
        if (data) {
            if (this.suceptible) this.suceptible.innerText = '' + data.suceptible;
            if (this.infected) this.infected.innerText = '' + data.infected;
            if (this.recovered) this.recovered.innerText = '' + data.recovered;
            if (this.dead) this.dead.innerText = '' + data.dead;
        }
    }

    private reset(): void {
        if (this.suceptible) this.suceptible.innerText = '-';
        if (this.infected) this.infected.innerText = '-';
        if (this.recovered) this.recovered.innerText = '-';
        if (this.dead) this.dead.innerText = '-';
    }

    /** Called when the subject notifies a OnReset event needs to happen.
     * Usually upon initiliaztion of a new simulation, and on restart
     */
    public OnReset(): void {
        this.reset();
    }

    public OnDead(person: Person): void {}
}
