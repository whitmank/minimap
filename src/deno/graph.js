import { generateMapGraph } from './graphMLgen.js'
import { Sigma } from 'npm:sigma';
import { Graph } from 'npm:graphology';
import random from 'npm:graphology-layout/random';
import ForceSupervisor from 'npm:graphology-layout-force/worker';

document.addEventListener("DOMContentLoaded", async function() {
    const windows = await chrome.windows.getAll({ "populate": true });
    const xml = generateMapGraph(windows);

    const graphml = require('graphology-graphml');
    const graph = graphml.parse(Graph, xml);

    random.assign(graph)
    const layout = new ForceSupervisor(graph, {maxIterations: 5});
    layout.start();

    const container = document.getElementById("container");
    const sigmaInstance = new Sigma(graph, container);
});