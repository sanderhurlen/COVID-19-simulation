import Observer from './observer';
import Person from '../Person/Person';

export default class Subject {
    private observers: Array<Observer>;

    constructor() {
        this.observers = [];
    }

    public addObserver(observer: Observer): void {
        this.observers.push(observer);
    }

    public removeObserver(observer: Observer): void {
        const removeIndex = this.observers.findIndex((obs) => {
            return observer === obs;
        });

        if (removeIndex !== -1) {
            this.observers = this.observers.slice(removeIndex, 1);
        }
    }

    public notify(data: {}): void {
        this.observers.forEach((observer) => {
            observer.update(data);
        });
    }

    public notifyDead(person: Person): void {
        this.observers.forEach((observer) => {
            observer.OnDead(person);
        });
    }

    public notifyReset(): void {
        this.observers.forEach((observer) => {
            observer.OnReset();
        });
    }
}
