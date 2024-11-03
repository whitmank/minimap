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

export async function createGraph(data) {
    // const windows = await chrome.windows.getAll({ "populate": true });
    // const xml = generateGraphData(windows);

    const graphml = require('graphology-graphml');
    const graph = graphml.parse(Graph, data);

    random.assign(graph)
    const layout = new ForceSupervisor(graph, {maxIterations: 5});
    layout.start();

    console.log(graph);

    return graph;
};