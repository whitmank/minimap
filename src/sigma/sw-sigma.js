console.log('sigma service worker loaded');

// These sigma interaction event listeners need to be reimplemented
// They were previously in the graphController.js file which is deprecated

/*
// Events
// [perhaps these should be moved?]

// State info
let draggedNode = null;
let isDragging = false;
let activeTab = null;

async function doubleClickNode(event, graph) {
    // Prevents default zooming 
    event.preventSigmaDefault();

    // Focuses the tab corresponding to the node that was double clicked
    const tab = await nodeToTab(event.node);
    await focusTab(tab);
}

function downNode(event, graph, layout) {
    // Freeze graph layout updates
    layout.stop();

    // Assign state info
    isDragging = true;
    draggedNode = event.node;

    // Highlight clicked node
    graph.setNodeAttribute(draggedNode, "highlighted", true);
    console.log(graph.getNodeAttributes(draggedNode));
}

function mouseMoveBody(event, graph, sigmaInstance) {
    // Do nothing if not in dragging state with well defined dragged node
    if (!isDragging || !draggedNode) return;

    // Translate mouse position to graph coordinates, and moved the dragged node there
    const pos = sigmaInstance.viewportToGraph(event);
    graph.setNodeAttribute(draggedNode, "x", pos.x);
    graph.setNodeAttribute(draggedNode, "y", pos.y);

    // Stop default panning behavior 
    event.preventSigmaDefault();
    event.original.preventDefault();
    event.original.stopPropagation();
}

function mouseUp(event, graph, layout) {
    // Resume graph layout updates
    layout.start();

    // If a node was being dragged
    if (draggedNode) {
        // Unhighlight the node
        graph.removeNodeAttribute(draggedNode, "highlighted");
    }

    // Reset state info
    isDragging = false;
    draggedNode = null;
}

async function onNewActiveTab(event, graph) {
    const newActiveTab = event.tabId;

    graph.updateEdge(activeTab, newActiveTab, attr => {
        return {
            ...attr,
            size: Math.min((attr.size || 0) + 1, 15),
            type: 'arrow',
            color: 'red',
        };
    });

    activeTab = newActiveTab;
}

async function onNewTab(tab, graph) {
    const newNodeAttributes =
    {
        chromeType: 'node',
        label: tab.title,
        size: '10',
        url: tab.url,
        x: 0,
        y: 0,
    }
    graph.addNode(tab.id, newNodeAttributes);
    graph.addEdge(tab.windowId, tab.id);
    graph.addEdge(activeTab, tab.id, { size: 1, type: 'arrow', color: 'green' });
}

async function onUpdatedTab(event, graph) {
    // update node title and url when tab is loaded
    graph.updateNodeAttributes(event.tabId, attr => {
        return {
            ...attr,
            label: event.tab.title,
            url: event.tab.url,
        };
    });
}



export async function setUpListeners(sigmaInstance, graph, layout) {
    console.log("Setting up listeners...");
    // Defaults to whatever tab is currently active. If multiple windows, takes the first
    const firstTab = await chrome.tabs.query({ active: true });
    activeTab = firstTab[0].id;

    // When a node is double clicked 
    // This does not override the single click [fix?]
    sigmaInstance.on("doubleClickNode", async (event) => doubleClickNode(event, graph));
    // When a node is clicked 
    sigmaInstance.on("downNode", (event) => downNode(event, graph, layout));
    // When the mouse is moved
    sigmaInstance.getMouseCaptor().on("mousemovebody", (event) => mouseMoveBody(event, graph, sigmaInstance));
    // When the mouse unclicks
    sigmaInstance.getMouseCaptor().on("mouseup", (event) => mouseUp(event, graph, layout));

    // Chrome event listeners
    chrome.tabs.onActivated.addListener(async (event) => onNewActiveTab(event, graph));

    chrome.tabs.onCreated.addListener(async (tab) => onNewTab(tab, graph));
    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => onUpdatedTab({tabId, changeInfo, tab}, graph));
}
*/


console.log('sigma service worker finished loading');