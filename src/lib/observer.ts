import Person from '../Person/Person';

export default abstract class Observer {
    public abstract update(data: {}): void;

    public abstract OnDead(person: Person): void;
}
