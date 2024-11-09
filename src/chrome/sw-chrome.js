console.log('sw-chrome: sw-chrome.js loaded at ' + new Date().toLocaleTimeString());

import { UTILS, saveGraph, ensureGraph } from '/src/graphology/graphUtils.js';

let port = null;
// try {
//     port = chrome.runtime.connect({ name: UTILS.CHROME_SIDE_PANEL_PORT_NAME });
// } catch {
//     console.error('sw-chrome: Could not connect to side panel port');
// }
// let port = chrome.runtime.connect({ name: UTILS.CHROME_SIDE_PANEL_PORT_NAME });
let minimapGraph = await ensureGraph();
console.log('sw-chrome: Initial graph loaded:', minimapGraph);
// console.log('port:', port);

// This function listens for the side panel port being opened
// or closed, and sets the port variable accordingly.
chrome.runtime.onConnect.addListener((openedPort) => {
    if (openedPort.name === UTILS.CHROME_SIDE_PANEL_PORT_NAME) {
        port = openedPort;
        console.log('sw-chrome: Port connected:', port);
        port.onDisconnect.addListener(async () => {
            console.log('sidePanel.js disconnected from: ', port);
            port = null;

            // Reload the graph if the port is disconnected
            minimapGraph = await ensureGraph();
            console.log('sw-chrome: Graph reloaded after port disconnect:', minimapGraph);
        });
        port.onMessage.addListener(async (message) => {
            console.log('sw-chrome: Message received:', message);
        });
    }
});

// This function listens for tabs being created and either sends
// a message to the side panel if the port is open, or updates
// the sw-chrome version of the graph if the port is not open.
chrome.tabs.onCreated.addListener(async (tab) => {
    const tabId = tab.id;
    if (port) {
        port.postMessage({ action: UTILS.ADD_NODE_ACTION_CODE, tabId: tabId });
        console.log('sw-chrome: Message sent to port: ADD_NODE_ACTION_CODE', tabId);
        return;
    }
    console.log('sw-chrome: Tab created:', tabId);
    minimapGraph.addTabNode(tabId);
    await saveGraph(minimapGraph);
    console.debug('sw-chrome: Graph saved after tab creation:', minimapGraph);
});

// This function listens for tabs being removed and either sends
// a message to the side panel if the port is open, or updates
// the sw-chrome version of the graph if the port is not open.
chrome.tabs.onRemoved.addListener(async (tabId) => {
    if (port) {
        port.postMessage({ action: UTILS.DROP_NODE_ACTION_CODE, tabId: tabId });
        console.log('sw-chrome: Message sent to port: DROP_NODE_ACTION_CODE', tabId);
        return;
    }
    console.log('sw-chrome: Tab removed:', tabId);
    minimapGraph.removeTabNode(tabId);
    await saveGraph(minimapGraph);
    console.debug('sw-chrome: Graph saved after tab removal:', minimapGraph);
});

// This function listens for tabs being updated and either sends
// a message to the side panel if the port is open, or updates
// the sw-chrome version of the graph if the port is not open.
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (port) {
        port.postMessage({ action: UTILS.UPDATE_NODE_ACTION_CODE, tabId: tabId, title: tab.title, url: tab.url });
        console.log('sw-chrome: Message sent to port: UPDATE_NODE_ACTION_CODE', tabId, tab.title, tab.url);
        return;
    }
    console.log('sw-chrome: Tab updated:', tabId, changeInfo, tab);
    minimapGraph.updateTabNode(tabId, tab.title, tab.url);
    await saveGraph(minimapGraph);
    console.debug('sw-chrome: Graph saved after tab update:', minimapGraph);
});

// This function listens for the active tab changing and either
// sends a message to the side panel if the port is open, or updates
// the sw-chrome version of the graph if the port is not open.
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tabId = activeInfo.tabId;
    if (port) {
        port.postMessage({ action: UTILS.SET_ACTIVE_TAB_ACTION_CODE, tabId: tabId });
        console.log('sw-chrome: Message sent to port: SET_ACTIVE_TAB_ACTION_CODE', tabId);
        return;
    }
    console.log('sw-chrome: Tab activated:', tabId);
    minimapGraph.activeTab = tabId;
    await saveGraph(minimapGraph);
    console.debug('sw-chrome: Graph saved after tab activation:', minimapGraph);
});
