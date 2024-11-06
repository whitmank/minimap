console.log('sidePanel.js loaded at ' + new Date().toLocaleTimeString());

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
    console.log('sidePanel.js: Received message', message);
    if (message.action === UTILS.ADD_NODE_ACTION_CODE) {
        minimapGraph.addTabNode(tabId);
        console.log('sidePanel.js: Node added', tabId);
    }
    if (message.action === UTILS.DROP_NODE_ACTION_CODE) {
        minimapGraph.removeTabNode(tabId);
        console.log('sidePanel.js: Node removed', tabId);
    }
    if (message.action === UTILS.UPDATE_NODE_ACTION_CODE) {
        minimapGraph.updateTabNode(tabId, message.title, message.url);
        console.log('sidePanel.js: Node updated', tabId, message.title, message.url);
    }
    if (message.action === UTILS.UPDATE_ACTIVE_TAB_ACTION_CODE) {
        minimapGraph.activeTab = tabId;
        console.log('sidePanel.js: Active tab updated to', tabId);
    }
    saveGraph(minimapGraph);
    console.log('sidePanel.js: Graph saved after message processing');
});

console.log(UTILS.SAVE_INTERVAL);

setInterval(() => {
    console.log('sidePanel.js: Interval triggered, saving graph');
    saveGraph(minimapGraph);
}, UTILS.SAVE_INTERVAL_MS);