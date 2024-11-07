export const UTILS = {
    CHROME_SESSION_STORAGE_GRAPH_KEY: "graph",
    CHROME_SIDE_PANEL_PORT_NAME: "sidePanelPort",
    ADD_NODE_ACTION_CODE: "addNode",
    DROP_NODE_ACTION_CODE: "dropNode",
    UPDATE_NODE_ACTION_CODE: "updateNode",
    SET_ACTIVE_TAB_ACTION_CODE: "setActiveTab",
    FORCE_MAX_ITER: 5,
    SAVE_INTERVAL_MS: 2000,
    HISTORY_MODE: true
};

import { MinimapGraph } from '/src/graphology/minimapGraph.js';

// This function ensures that the graph in session storage is
// loaded into memory, and if it doesn't exist, initializes it
// and saves it to session storage.
export async function ensureGraph() {
    const key = UTILS.CHROME_SESSION_STORAGE_GRAPH_KEY;
    let minimapGraph = new MinimapGraph();
    try {
        const result = await chrome.storage.session.get([key]);
        console.debug('Session storage get result:', result);
        if (result[key]) {
            console.debug('Graph found in session storage. Importing at', new Date().toLocaleTimeString());
            minimapGraph.importGraph(result[key]);
        } else {
            console.debug('Graph not found in session storage. Initializing with current tabs at', new Date().toLocaleTimeString());
            // For testing purposes, we want only the tabs in the current window
            const tabs = await chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT });
            minimapGraph.initializeWithTabs(tabs);
            await saveGraph(minimapGraph);
        }
    } catch (error) {
        console.error('Error accessing session storage:', error);
    }

    return minimapGraph;
}

export async function saveGraph(minimapGraph) {
    const graphData = minimapGraph.exportGraph();
    const key = UTILS.CHROME_SESSION_STORAGE_GRAPH_KEY;
    try {
        await chrome.storage.session.set({ [key]: graphData });
        console.debug('Graph saved to session storage at', new Date().toLocaleTimeString());
    } catch (error) {
        console.error('Error saving graph to session storage:', error);
    }
}