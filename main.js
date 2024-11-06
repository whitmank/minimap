// import { generateGraphData } from './src/sigma/dataGenerator.js';
// import { createGraph } from './src/sigma/graphCreator.js'
// import { setUpListeners } from './src/sigma/graphController.js'
// import { Sigma } from 'sigma';
// import ForceSupervisor from 'graphology-layout-force/worker';

// // Get browser windows and tabs (Chrome)
// const windows = await chrome.windows.getAll({ "populate": true });

// // Generate xml from chrome data: "windows"
// const xml = generateGraphData(windows)

// // Select html element to contain the graph.
// const container = document.getElementById("container");

// // Render the graph with the desired data source in the specified element.
// let graph = await createGraph(xml);

// const layout = new ForceSupervisor(graph, {maxIterations: 5});
// layout.start();

// const sigmaInstance = new Sigma(graph, container);     
// setUpListeners(sigmaInstance, graph, layout);

console.log('main.js loaded');