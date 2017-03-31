'use-strict';
var p5 = require('p5');
import sketch from './../Viz/sketch';

function startViz() {
    // console.log("startViz");
    // start sketch
    new p5(sketch);
};

module.exports = { startViz: startViz };
