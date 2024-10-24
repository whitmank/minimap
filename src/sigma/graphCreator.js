import { generateGraphData } from './dataGenerator.js'
import { Sigma } from 'sigma';
import { Graph } from 'graphology';
import random from 'graphology-layout/random';
import ForceSupervisor from 'graphology-layout-force/worker';

function moveTabToWindow(tabId, windowId) {
    chrome.tabs.move([parseInt(tabId)], { index: 0, windowId: parseInt(windowId) });
}

// Calculates Euclidean distance between two points in a graphology graph
function dist(graph, uId, vId) {
    const ux = graph.getNodeAttributes(uId).x;
    const uy = graph.getNodeAttributes(uId).y;
    const vx = graph.getNodeAttributes(vId).x;
    const vy = graph.getNodeAttributes(vId).y;

    return Math.sqrt((ux - vx) * (ux -  vx) + (uy - vy) * (uy - vy));
}

// Gets the id of the closest window node to the given node (presumably a tab node)
function getNearestWinNode(graph, tabNode) {
    // Gets the node ids of every window node
    const windowNodes = graph.filterNodes((_, attributes) => { return (attributes.chromeType == 'window'); });

    // Find the closest window node to the given tab node
    let closest_dist = Number.MAX_SAFE_INTEGER;
    let closest_win_node = tabNode;

    for (const winNode of windowNodes) {
        const new_distance = dist(graph, tabNode, winNode);
        if (new_distance < closest_dist) {
            closest_dist = new_distance;
            closest_win_node = winNode;
        }
    }

    return closest_win_node;
}

async function nodeToTab(node) {
    return await chrome.tabs.get(parseInt(node));
}

async function focusTab(tab) {
    const winID = tab.windowId;
    const tabIndex = tab.index;

    await chrome.windows.update(winID, { focused: true });
    await chrome.tabs.highlight({ tabs: tabIndex, windowId: winID });
}

export async function createGraph(data, element) {
    // const windows = await chrome.windows.getAll({ "populate": true });
    // const xml = generateGraphData(windows);

    const graphml = require('graphology-graphml');
    const graph = graphml.parse(Graph, data);

    random.assign(graph)
    const layout = new ForceSupervisor(graph, {maxIterations: 5});
    layout.start();

    // const container = document.getElementById("container");
    // Create new Sigma instance (source graph, html container element to put it in)
    const sigmaInstance = new Sigma(graph, element, { enablePanning: false });

    
    // Events
    // [perhaps these should be moved?]

    // State info
    let draggedNode = null;
    let isDragging = false;

    // When a node is double clicked 
    // This does not override the single click [fix?]
    sigmaInstance.on("doubleClickNode", async (event) => {
        // Prevents default zooming 
        event.preventSigmaDefault();

        // Focuses the tab corresponding to the node that was double clicked
        const tab = await nodeToTab(event.node);
        await focusTab(tab);
    });

    // When a node is clicked 
    sigmaInstance.on("downNode", (e) => {
        // Freeze graph layout updates
        layout.stop();

        // Assign state info
        isDragging = true;
        draggedNode = e.node;

        // Highlight clicked node
        graph.setNodeAttribute(draggedNode, "highlighted", true);

        // Removes the edge that connects the window node to the clicked tab node 
        // This assumes that the clicked node was a tab node and had exactly one incoming edge
        graph.findInEdge(draggedNode, (edge) => {
            graph.dropEdge(edge);
        });
    });

    // When the mouse is moved
    sigmaInstance.getMouseCaptor().on("mousemovebody", (e) => {
        // Do nothing if not in dragging state with well defined dragged node
        if (!isDragging || !draggedNode) return;

        // Translate mouse position to graph coordinates, and moved the dragged node there
        const pos = sigmaInstance.viewportToGraph(e);
        graph.setNodeAttribute(draggedNode, "x", pos.x);
        graph.setNodeAttribute(draggedNode, "y", pos.y);

        // Stop default panning behavior 
        e.preventSigmaDefault();
        e.original.preventDefault();
        e.original.stopPropagation();
    });

    // When the mouse unclicks
    sigmaInstance.getMouseCaptor().on("mouseup", () => {
        // Resume graph layout updates
        layout.start();

        // If a node was being dragged
        if (draggedNode) {
            // Unhighlight the node
            graph.removeNodeAttribute(draggedNode, "highlighted");

            // Create a new edge from the closest window node to the dragged node
            const newWinNode = getNearestWinNode(graph, draggedNode);
            graph.addEdge(newWinNode, draggedNode);

            // Reassign the tab to its new window
            moveTabToWindow(draggedNode, newWinNode);
        }

        // Reset state info
        isDragging = false;
        draggedNode = null;
    });
};