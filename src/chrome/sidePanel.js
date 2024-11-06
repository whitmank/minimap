console.log('sidePanel.js loaded at ' + new Date().toLocaleTimeString());


const FORCE_MAX_ITER = 5;
const SAVE_INTERVAL = 2000;

import { Sigma } from 'sigma';
import { UTILS, saveGraph, ensureGraph } from '/src/graphology/graphUtils.js';
import ForceSupervisor from 'graphology-layout-force/worker';

let minimapGraph = await ensureGraph();

const layout = new ForceSupervisor(minimapGraph.graph, {maxIterations: UTILS.FORCE_MAX_ITER});
layout.start();

const container = document.getElementById("container");
const sigmaInstance = new Sigma(minimapGraph.graph, container);

const port = chrome.runtime.connect({ name: UTILS.CHROME_SIDE_PANEL_PORT_NAME });

port.onMessage.addListener((message) => {
    const tabId = message.tabId;
    if (message.action === UTILS.ADD_NODE_ACTION_CODE) {
        minimapGraph.addTabNode(tabId);
    }
    if (message.action === UTILS.DROP_NODE_ACTION_CODE) {
        minimapGraph.removeTabNode(tabId);
    }
    if (message.action === UTILS.UPDATE_NODE_ACTION_CODE) {
        minimapGraph.updateTabNode(tabId, message.title, message.url);
    }
    saveGraph(minimapGraph);
});

setInterval(() => {
    console.log("Saving graph to session storage");
    saveGraph(minimapGraph);
}, UTILS.SAVE_INTERVAL);