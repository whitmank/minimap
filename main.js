import { generateGraphData } from './src/sigma/dataGenerator.js';
import { createGraph } from './src/sigma/graphCreator.js'

// Get browser windows and tabs (Chrome)
const windows = await chrome.windows.getAll({ "populate": true });

// Generate xml from chrome data: "windows"
const xml = generateGraphData(windows)

// Select container for the graph
const container = document.getElementById("container");

// Render the graph with desired data source in specified html element.
document.addEventListener("DOMContentLoaded", async => createGraph(xml, container));
