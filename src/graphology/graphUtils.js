export const UTILS = {
    CHROME_SESSION_STORAGE_GRAPH_KEY: "graph",
    CHROME_SIDE_PANEL_PORT_NAME: "sidePanelPort",
    ADD_NODE_ACTION_CODE: "addNode",
    DROP_NODE_ACTION_CODE: "dropNode",
    UPDATE_NODE_ACTION_CODE: "updateNode",
    SET_ACTIVE_TAB_ACTION_CODE: "setActiveTab",
    FORCE_MAX_ITER: 100,
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
            // // For testing purposes, we want only the tabs in the current window
            // const tabs = await chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT });
            const tabs = await chrome.tabs.query({});
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

export async function focusTab(tabId) {
    console.log(tabId);
    const tab = await chrome.tabs.get(tabId);
    const winID = tab.windowId;
    const tabIndex = tab.index;

    await chrome.windows.update(winID, { focused: true });
    await chrome.tabs.highlight({ tabs: tabIndex, windowId: winID });
}

export class FSM {
    static selectedNode = null;
    // This field had a typo, yet that seemed to cause no issues...
    static draggingNode = null;
    static preventMouseMoveDefault = false;
    constructor(config) {
        this.state = config.initialState;
        this.states = config.states;
    }

    transition(event, ...args) {
        console.debug(`FSM: Sending ${this.state} event ${event}`);
        const currentState = this.states[this.state];
        const transition = currentState.transitions?.[event];

        if (transition) {
            console.debug(`FSM: Transitioning to ${transition.target}`);
            if (transition.action) {
                transition.action(...args);
            }

            if (currentState.actions?.onExit) {
                currentState.actions.onExit(...args);
            }

            this.state = transition.target;

            const nextState = this.states[this.state];
            if (nextState.actions?.onEnter) {
                nextState.actions.onEnter(...args);
            }
        }
    }
}