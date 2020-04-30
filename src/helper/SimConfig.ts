import SimScenearios from './SimScenearios';

export default interface SimConfig {
    sceneario: SimScenearios;
    canvas: HTMLElement | undefined;
}
