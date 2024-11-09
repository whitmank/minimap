console.log('sidePanel.js loaded at ' + new Date().toLocaleTimeString());

// import '/src/chrome/sw-chrome.js';
import { Sigma } from 'sigma';
import { FSM, UTILS, saveGraph, ensureGraph, focusTab } from '/src/graphology/graphUtils.js';
import FA2 from 'graphology-layout-forceatlas2/worker';
import NoOverlap from 'graphology-layout-noverlap';

async function initializeSigmaToContainer(containerId) {
    let minimapGraph = await ensureGraph();

    const layout = new NoOverlap(minimapGraph.graph, {
        maxIterations: UTILS.FORCE_MAX_ITER,
        settings: {
            margin: 20,
            expansion: 2
        }
    });
    NoOverlap.assign(minimapGraph.graph);

    const container = document.getElementById(containerId);
    const sigmaInstance = new Sigma(minimapGraph.graph, container, {
        labelDensity: 100,
        autoRescale: false,
        autoCenter: false,
    });

    return { minimapGraph, sigmaInstance };
}

function updateModeDisplay(mode) {
    const modeDisplay = document.getElementById('mode-display');
    if (modeDisplay) {
        modeDisplay.textContent = `Mode: ${mode}`;
    }
};

function setUpPortListeners() {
    chrome.runtime.onConnect.addListener((openedPort) => {
        if (openedPort.name === UTILS.CHROME_SIDE_PANEL_PORT_NAME) {
            console.log("side panel heard connection");
        }
    });
    

    // Connect to the side panel port
    const port = chrome.runtime.connect({ name: UTILS.CHROME_SIDE_PANEL_PORT_NAME });
    port.onDisconnect.addListener(() => {
        console.log('sw-chrome disconnected');
    });

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

    setInterval(() => {
        port.postMessage("ping");
    }, 1000);
}

function setUpEventListeners() {
    // Sigma Event Listeners
    sigmaInstance.on('clickNode', (event) => {
        machine.transition('clickNode', event.node);
    });

    sigmaInstance.on('clickStage', (event) => {
        machine.transition('clickStage', null);
    });

    sigmaInstance.on('doubleClickNode', (event) => {
        event.preventSigmaDefault();
        focusTab(parseInt(event.node));
    });

    sigmaInstance.on('downNode', (event) => {
        event.preventSigmaDefault();
        machine.transition('downNode', event.node);
    });

    sigmaInstance.on('doubleClickStage', (event) => {
        event.preventSigmaDefault();
    });

    sigmaInstance.getMouseCaptor().on('mousemovebody', (event) => {
        if (FSM.preventMouseMoveDefault) {
            event.preventSigmaDefault();
        }
        machine.transition('mouseMove', event);
    });

    sigmaInstance.getMouseCaptor().on('mouseup', (event) => {
        event.preventSigmaDefault();
        machine.transition('mouseUp', event);
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
        if (event.key === 's') {
            navigator.clipboard.writeText(JSON.stringify(minimapGraph.exportGraph()));
        }
        if (event.key === 'w') {
            navigator.clipboard.readText().then((text) => {
                minimapGraph.importGraph(JSON.parse(text));
                saveGraph(minimapGraph);
            });
        }
    });

}

function createStateMachine() {
    return new FSM({
        initialState: 'idle',
        states: {
            idle: {
                actions: {
                    onEnter() {
                        updateModeDisplay('Idle');
                    }
                },
                transitions: {
                    deleteKey: {
                        target: 'deleteMode'
                    },
                    addKey: {
                        target: 'addMode'
                    },
                    downNode: {
                        target: 'draggingNode',
                        action(node) {
                            FSM.draggingNode = node;
                            minimapGraph.highlightNode(node);
                        }
                    }
                },
            },
            deleteMode: {
                actions: {
                    onEnter() {
                        updateModeDisplay('Delete');
                    }
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
                            minimapGraph.highlightNode(node);
                        },
                    }
                },
            },
            draggingNode: {
                actions: {
                    onEnter() {
                        // This disables the camera as soon as we start dragging a node
                        // I am not entirely sure how it works, it is from the storybook example
                        // It is never reenabled. Only disabling it once we start dragging allows 
                        // The camera to fit the graph to the viewport when we first load the sidePanel.
                        if (!sigmaInstance.getCustomBBox()) sigmaInstance.setCustomBBox(sigmaInstance.getBBox());
                        FSM.preventMouseMoveDefault = true;

                        updateModeDisplay('Dragging');
                    },
                    onExit() {
                        FSM.preventMouseMoveDefault = false;
                    }
                },
                transitions: {
                    mouseMove: {
                        target: 'draggingNode',
                        action(event) {
                            const pos = sigmaInstance.viewportToGraph(event);
                            minimapGraph.updateTabNodePosition(FSM.draggingNode, pos.x, pos.y);
                        }
                    },
                    mouseUp: {
                        target: 'idle',
                        action() {
                            minimapGraph.unhighlightNode(FSM.draggingNode);
                            FSM.draggingNode = null;
                        }
                    }
                },
            },
            addMode: {
                actions: {
                    onEnter() {
                        updateModeDisplay('Add');
                    }
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
                            minimapGraph.highlightNode(node);
                        },
                    }
                },
            },
            addNodeClicked: {
                actions: {
                    onExit() {
                        minimapGraph.clearAllHighlights();
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
                        minimapGraph.clearAllHighlights();
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
    });
}

const { minimapGraph, sigmaInstance } = await initializeSigmaToContainer('container');
import '/src/sigma/sw-sigma.js';

setUpPortListeners();

// Input handling with a Finite State Machine
const machine = createStateMachine();

setUpEventListeners();

// Regularly save the graph to session storage
setInterval(() => {
    console.debug('sidePanel.js: Interval triggered, saving graph');
    saveGraph(minimapGraph);
}, UTILS.SAVE_INTERVAL_MS);
