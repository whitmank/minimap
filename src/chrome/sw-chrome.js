console.log('sw-chrome.js loaded at ' + new Date().toLocaleTimeString());


import { UTILS, saveGraph, ensureGraph } from '/src/graphology/graphUtils.js';

let port = null;
let minimapGraph = await ensureGraph();

// This function listens for the side panel port being opened
// or closed, and sets the port variable accordingly.
chrome.runtime.onConnect.addListener((openedPort) => {
    if (openedPort.name === UTILS.CHROME_SIDE_PANEL_PORT_NAME) {
        port = openedPort;
        port.onDisconnect.addListener(async () => {
            // This signal fires when a listener on the port is disconnected.
            // Currently, the only listener is the side panel, so we 
            // nullify the port variable to indicate that the side panel
            // is no longer connected and stop sending messages to it.
            port = null;

            // Then we grab the latest graph from session storage in 
            // order to keep working with whatever the side panel last saw.
            minimapGraph = await ensureGraph();
        });
    }
});

// This function listens for tabs being created, adds a tab node
// to the graph in session storage, and passes the same message
// to the side panel.
chrome.tabs.onCreated.addListener(async (tab) => {
    const tabId = tab.id;
    minimapGraph.addTabNode(tabId);
    await saveGraph(minimapGraph);

    if (port) {
        port.postMessage({ action: UTILS.ADD_NODE_ACTION_CODE, tabId: tabId });
    }
});

// This function listens for tabs being removed, drops the
// corresponding tab node from the graph in session storage,
// and passes the same message to the side panel.
chrome.tabs.onRemoved.addListener(async (tabId) => {
    minimapGraph.removeTabNode(tabId);
    await saveGraph(minimapGraph);

    if (port) {
        port.postMessage({ action: UTILS.DROP_NODE_ACTION_CODE, tabId: tabId });
    }
});

// This function listens for tabs being updated, updates the
// corresponding tab node in the graph in session storage, and
// passes the same message to the side panel.
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    minimapGraph.updateTabNode(tabId, tab.title, tab.url);
    await saveGraph(minimapGraph);

    if (port) {
        port.postMessage({ action: UTILS.UPDATE_NODE_ACTION_CODE, tabId: tabId, title: tab.title, url: tab.url });
    }
});