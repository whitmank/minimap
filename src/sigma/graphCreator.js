import { Sigma } from 'sigma';
import { Graph } from 'graphology';
import random from 'graphology-layout/random'
import ForceSupervisor from 'graphology-layout-force/worker';


export async function createGraph(data, element) {
    const graphml = require('graphology-graphml');
    const graph = graphml.parse(Graph, data);

    random.assign(graph)
    const layout = new ForceSupervisor(graph, {maxiterations: 5});
    layout.start();

    const sigmaInstance = new Sigma(graph, element);
}