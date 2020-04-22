// packing files
import p5 from 'p5';
import Chart from 'chart.js';

// Class files
import Simulator from './Simulator/Simulator';
import graph from './Chart/chart';

// Sketches
import intro from './Sketch/intro';

// main
Simulator.Start();

// set up a chart
var node = 'myChart';
var myChart = new Chart(node, graph);

// Start P5 canvas
new p5(intro);
