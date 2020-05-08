import SimScenearios from './SimScenearios';

export default interface SimConfig {
    sceneario: SimScenearios;
    canvas: HTMLElement | undefined;
    START_AMOUNT_SUCEPTIBLE: number;
    START_AMOUNT_INFECTED: number;
}
