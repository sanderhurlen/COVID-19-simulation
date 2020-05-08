// packing files
import './assets/app.scss';

// Class files
import Simulator from './Simulator/Simulator';
import SimScenearios from './helper/SimScenearios';

const root = document.getElementById('bcg');
const column = document.getElementById('left');
const sticky = column?.offsetTop;

window.onscroll = function (): void {
    if (sticky) {
        if (window.pageYOffset > sticky) {
            column?.classList.add('sticky');
            root?.classList.add('bcg');
            if (root) root.style.transition = 'background 1s';
        } else {
            column?.classList.remove('sticky');
            root?.classList.remove('bcg');
            if (root) root.style.transition = 'background 1s';
        }
    }
};

// set up all p5 canvases
const canvFFA = document.getElementById('free-for-all');
const freeForAll = new Simulator(60, 40, {
    sceneario: SimScenearios.FREE_FOR_ALL,
    canvas: canvFFA ? canvFFA : undefined,
    START_AMOUNT_SUCEPTIBLE: 199,
    START_AMOUNT_INFECTED: 1,
});

const canvForced = document.getElementById('forced-quarantine');
const forcedQ = new Simulator(60, 40, {
    sceneario: SimScenearios.QUARANTINE_FENCE,
    canvas: canvForced ? canvForced : undefined,
    START_AMOUNT_SUCEPTIBLE: 199,
    START_AMOUNT_INFECTED: 1,
});

const canvQuarter = document.getElementById('one-quarter-free');
const quarterFree = new Simulator(60, 40, {
    sceneario: SimScenearios.QUARANTINE_QUARTER,
    canvas: canvQuarter ? canvQuarter : undefined,
    START_AMOUNT_SUCEPTIBLE: 199,
    START_AMOUNT_INFECTED: 1,
});

const canvEight = document.getElementById('one-eight-free');
const eightFree = new Simulator(60, 40, {
    sceneario: SimScenearios.QUARANTINE_EIGHT,
    canvas: canvEight ? canvEight : undefined,
    START_AMOUNT_SUCEPTIBLE: 199,
    START_AMOUNT_INFECTED: 1,
});

// age and death checkboxes

const enableAge = document.getElementById('age-checkbox') as HTMLInputElement;
enableAge.checked = false;
const enableDeath = document.getElementById('death-checkbox') as HTMLInputElement;
enableDeath.checked = false;

function enableAgeForSimulations(): void {
    freeForAll.enableAge(enableAge.checked);
    forcedQ.enableAge(enableAge.checked);
    quarterFree.enableAge(enableAge.checked);
    eightFree.enableAge(enableAge.checked);
}

function enableDeathForSimulations(): void {
    freeForAll.enableMortality(enableDeath.checked);
    forcedQ.enableMortality(enableDeath.checked);
    quarterFree.enableMortality(enableDeath.checked);
    eightFree.enableMortality(enableDeath.checked);
}
enableAge?.addEventListener('click', () => {
    if (!enableDeath.checked) {
        enableDeath.checked = true;
        enableDeathForSimulations();
    }
    enableAgeForSimulations();
});

enableDeath?.addEventListener('click', () => {
    enableDeathForSimulations();
});

// Free for all buttons
const startButtonFFA = document.getElementById('FFA-start') as HTMLInputElement;
startButtonFFA.addEventListener('click', () => {
    freeForAll.start();
});

const pauseButtonFFA = document.getElementById('FFA-pause') as HTMLInputElement;
pauseButtonFFA.addEventListener('click', () => {
    freeForAll.pause();
});

const restartButtonFFA = document.getElementById('FFA-restart') as HTMLInputElement;
restartButtonFFA.addEventListener('click', () => {
    freeForAll.restart();
});

// Forced quarantine buttons
const startButtonFQ = document.getElementById('FQ-start') as HTMLInputElement;
startButtonFQ.addEventListener('click', () => {
    forcedQ.start();
});

const pauseButtonFQ = document.getElementById('FQ-pause') as HTMLInputElement;
pauseButtonFQ.addEventListener('click', () => {
    forcedQ.pause();
});

const restartButtonFQ = document.getElementById('FQ-restart') as HTMLInputElement;
restartButtonFQ.addEventListener('click', () => {
    forcedQ.restart();
});

// One quarter free buttons
const startButtonOQ = document.getElementById('OQ-start') as HTMLInputElement;
startButtonOQ.addEventListener('click', () => {
    quarterFree.start();
});

const pauseButtonOQ = document.getElementById('OQ-pause') as HTMLInputElement;
pauseButtonOQ.addEventListener('click', () => {
    quarterFree.pause();
});

const restartButtonOQ = document.getElementById('OQ-restart') as HTMLInputElement;
restartButtonOQ.addEventListener('click', () => {
    quarterFree.restart();
});

// One quarter free buttons
const startButtonOE = document.getElementById('OE-start') as HTMLInputElement;
startButtonOE.addEventListener('click', () => {
    eightFree.start();
});

const pauseButtonOE = document.getElementById('OE-pause') as HTMLInputElement;
pauseButtonOE.addEventListener('click', () => {
    eightFree.pause();
});

const restartButtonOE = document.getElementById('OE-restart') as HTMLInputElement;
restartButtonOE.addEventListener('click', () => {
    eightFree.restart();
});
