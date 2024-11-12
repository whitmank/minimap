console.log('sw-chrome: sw-chrome.js loaded at ' + new Date().toLocaleTimeString());

import { UTILS, saveGraph, ensureGraph } from '/src/graphology/graphUtils.js';

let port = null;
let minimapGraph = null;
let minimapGraphPromise = ensureGraph();
let eventQueue = [];

minimapGraphPromise.then((graph) => {
    minimapGraph = graph;
    console.log('sw-chrome: Initial graph loaded:', minimapGraph);

    eventQueue.forEach((event) => event());
    eventQueue = null;
});

function queueOrExecute(callback) {
    if (eventQueue) {
        eventQueue.push(callback);
    } else {
        callback();
    }
}

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
    }
});

chrome.tabs.onCreated.addListener((tab) => {
    queueOrExecute(async () => {
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
});

chrome.tabs.onRemoved.addListener((tabId) => {
    queueOrExecute(async () => {
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
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    queueOrExecute(async () => {
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
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    queueOrExecute(async () => {
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
});
