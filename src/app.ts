import p5 from 'p5';
import Simulator from './Simulator/Simulator';

// Sketches
import intro from './Sketch/intro';

Simulator.Start();
// Start P5 canvas
new p5(intro);
