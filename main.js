import { generateGraphData } from './src/sigma/dataGenerator.js';
import { createGraph } from './src/sigma/graphCreator.js'

// Get browser windows and tabs (Chrome)
const windows = await chrome.windows.getAll({ "populate": true });

// Generate xml from chrome data: "windows"
const xml = generateGraphData(windows)

// Select html element to contain the graph.
const container = document.getElementById("container");

// Render the graph with the desired data source in the specified element.
document.addEventListener("DOMContentLoaded", async => createGraph(xml, container));
