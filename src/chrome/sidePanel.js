console.log('sidePanel.js loaded at ' + new Date().toLocaleTimeString());

import { Sigma } from 'sigma';
import { UTILS, saveGraph, ensureGraph } from '/src/graphology/graphUtils.js';
import ForceSupervisor from 'graphology-layout-force/worker';
import { FSM } from '/src/sigma/fsm.js';

// Ensure the graph exists and is loaded into memory
let minimapGraph = await ensureGraph();

// Create and start the force layout worker for the graph
const layout = new ForceSupervisor(minimapGraph.graph, { maxIterations: UTILS.FORCE_MAX_ITER });
layout.start();

// Create a Sigma instance and render the graph
const container = document.getElementById("container");
const sigmaInstance = new Sigma(minimapGraph.graph, container);

// Connect to the side panel port
const port = chrome.runtime.connect({ name: UTILS.CHROME_SIDE_PANEL_PORT_NAME });

// Add event listeners to get messages from sw-chrome in order to
// update the live graph in the side panel view. 
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
    if (message.action === UTILS.SET_ACTIVE_TAB_ACTION_CODE) {
        minimapGraph.activeTab = tabId;
        console.log('sidePanel.js: Active tab set to', tabId);
    }
    saveGraph(minimapGraph);
    console.debug('sidePanel.js: Graph saved after message processing');
});

// Regularly save the graph to session storage
setInterval(() => {
    console.debug('sidePanel.js: Interval triggered, saving graph');
    saveGraph(minimapGraph);
}, UTILS.SAVE_INTERVAL_MS);



// Input handling with a Finite State Machine
const machine = new FSM({
    initialState: 'idle', 
    states: {
        idle: {
            actions: {

            },
            transitions: {
                deleteKey: {
                    target: 'deleteMode'
                },
                addKey: {
                    target: 'addMode'
                }
            },
        },
        deleteMode: {
            actions: {

            },
            transitions: {
                deleteKey: {
                    target: 'idle'
                },
                addKey: {
                    target: 'addMode'
                },
                clickNode: {
                    target: 'deleteNodeClicked',
                    action(node) {
                        FSM.selectedNode = node;
                    },
                }
            },
        },
        addMode: {
            actions: {

            },
            transitions: {
                deleteKey: {
                    target: 'deleteMode'
                },
                addKey: {
                    target: 'idle'
                },
                clickNode: {
                    target: 'addNodeClicked',
                    action(node) {
                        FSM.selectedNode = node;
                    },
                }
            },
        },
        addNodeClicked: {
            actions: {
                onExit() {
                    FSM.selectedNode = null;
                }
            },
            transitions: {
                clickNode: {
                    target: 'addMode',
                    action(node) {
                        minimapGraph.ensureEdge(FSM.selectedNode, node);
                    },
                },
                clickStage: {
                    target: 'addMode',
                    action() {

                    },
                }
            },
        },
        deleteNodeClicked: {
            actions: {
                onExit() {
                    FSM.selectedNode = null;
                }
            },
            transitions: {
                clickNode: {
                    target: 'deleteMode',
                    action(node) {
                        minimapGraph.clearEdge(FSM.selectedNode, node);
                    },
                },
                clickStage: {
                    target: 'deleteMode',
                    action() {

                    },
                }
            },
        },
    }
})

// Sigma Event Listeners
sigmaInstance.on('clickNode', (event) => {
    machine.transition('clickNode', event.node);
});

sigmaInstance.on('clickStage', (event) => {
    machine.transition('clickStage', null);
});

sigmaInstance.on('rightClickNode', (event) => {
    machine.transition('rightClickNode', event.node);
});

// JavaScript keypress event listeners
document.addEventListener('keydown', (event) => {
    console.log('Key pressed:', event.key);
    if (event.key === 'd') {
        machine.transition('deleteKey', null);
    }
    if (event.key === 'a') {
        machine.transition('addKey', null);
    }
});
