import { create } from 'xmlbuilder2';
import { pd }     from 'pretty-data';

function generateMapGraph(windowsArray) {
    // Create root element
    const root = create({
        encoding: 'UTF-8',
        version: '1.0'
    })
    
    // Add graphML element
    .ele('graphml', { xmlns: 'http://graphml.graphdrawing.org/xmlns' })
        // Add graphML attribute for node (tab) titles
        .ele('key').att('id', 'l0').att('for', 'node').att('attr.name', 'title').att('attr.type', 'string').up()
        // Add graphML attribute for node (tab) URLs
        .ele('key').att('id', 'l1').att('for', 'node').att('attr.name', 'url').att('attr.type', 'string').up()

    // Create a graph for each window
    for (let i = 0; i < windowsArray.length; i++) {
        const window = windowsArray[i];
        const graph = root.ele('graph').att('id', `G${window.id}`).att('edgedefault', 'directed');
        
        // Generate graph for each window's tabs
        populateWindowGraph(graph, window);
    }

    // Close root element and output XML
    const xml = root.end({ prettyPrint: true });
    console.log(xml);
}

function populateWindowGraph(graph, window) {
    const tabs = window.tabs;
    const winID = window.id;

    // Create the node for the window itself
    graph.ele('node').att('id', winID)
        .ele('data').att('key', 'l0').txt(`Window ${winID}`).up().up();

    // Create nodes and edges for each tab
    for (let i = 0; i < tabs.length; i++) {
        // Create a node representing a tab
        const tab = tabs[i];
        const nodeID = `w${winID}t${i}`;
        const node = graph.ele('node').att('id', nodeID);
        
        // Set the node's title
        const title = node.ele('data');
        title.att('key', 'l0');
        title.txt(tab.title);

        // Set the node's URL
        const url = node.ele('data');
        url.att('key', 'l1');
        url.txt(tab.url);

        // Close the node
        node.up();

        // Create the edge, set source and target, and close 
        const edge = graph.ele('edge');
        edge.att('source', winID);
        edge.att('target', nodeID);
        edge.up();
    }
}

const windows = await chrome.windows.getAll({ "populate": true });
generateMapGraph(windows);