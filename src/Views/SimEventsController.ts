import Observer from '../lib/observer';
import Person from '../Person/Person';

export default class SimulationEventsController extends Observer {
    private eventsDOM: HTMLElement | null;
    private deadPeople: Array<Person>;

    constructor(id: string) {
        super();
        this.eventsDOM = document.getElementById(id);
        this.deadPeople = [];
    }

    private appendEvent(info: string, data: {}): void {
        const newNode = document.createElement('p');
        const node = document.createTextNode(info + data);
        newNode.appendChild(node);
        this.eventsDOM?.appendChild(newNode);
    }

    public update(data: {}): void {}

    public OnReset(): void {
        let child = this.eventsDOM?.lastElementChild;
        while (child) {
            this.eventsDOM?.removeChild(child);
            child = this.eventsDOM?.lastElementChild;
        }
    }

    public OnDead(person: Person): void {
        if (person != null) {
            let inList = false;
            this.deadPeople.forEach((p) => {
                if (person.age === p.age) {
                    inList = true;
                }
            });
            if (!inList) {
                this.appendEvent('A player died at age of ', person.age);
                this.deadPeople.push(person);
            }
        }
    }
}
