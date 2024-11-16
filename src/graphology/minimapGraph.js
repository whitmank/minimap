import { Graph } from 'graphology';

const DEFAULT_NODE_SIZE = 20;
const NODE_MAX_DIST = 100;
const TITLE_LEN = 30;

export class MinimapGraph {
    #graph = new Graph();
    #activeTab = 0;

    constructor(tabs, activeTab) {
        if (tabs === undefined) {
            return;
        }
        
        this.initializeWithTabs(tabs);

        if (activeTab !== undefined) {
            this.#activeTab = activeTab;
        }
    }

    get graph() {
        return this.#graph;
    }

    set activeTab(tabId) {
        this.#activeTab = tabId;
    }

    initializeWithTabs(tabs) {
        console.log('Initializing graph with these tabs:', tabs);
        for (const tab of tabs) {
            this.addTabNode(tab.id);
            this.updateTabNodeData(tab.id, tab.title, tab.url);
        }
    }

    addTabNode(tabId) {
        const x = Math.random() * NODE_MAX_DIST;
        const y = Math.random() * NODE_MAX_DIST;
        this.addTabNodeAt(tabId, x, y);
    }

    addTabNodeAt(tabId, x, y) {
        if (this.hasNode(tabId)) {
            console.log('Cannot add this node as it already exists:', tabId);
            return;
        }
        this.#graph.addNode(tabId,
            {
                x: x,
                y: y,
                size: DEFAULT_NODE_SIZE
            });
        console.log('This node was added:', tabId);
    }

    removeTabNode(tabId) {
        if (!this.hasNode(tabId)) { 
            console.log('Cannot remove node as it does not exist:', tabId);
            return;
        }
        this.#graph.dropNode(tabId);
        console.log('This node was removed:', tabId);
    }

    updateTabNodeData(tabId, title, url) {
        if (!this.hasNode(tabId)) {
            console.log('Cannot update data as this node does not exist:', tabId);
            return;
        }
        this.#graph.updateNodeAttributes(tabId, attr => {
            return {
                ...attr,
                label: title.length > TITLE_LEN ? title.substring(0, TITLE_LEN) + '...' : title,
                title: title,
                url: url,
            };
        });
        console.log('This node was updated:', tabId, 'with this title:', title, 'and this url:', url);
    }

    updateTabNodePosition(tabId, x, y) {
        if (!this.hasNode(tabId)) {
            console.log('Cannot update position as this node does not exist:', tabId);
            return;
        }
        this.#graph.updateNodeAttributes(tabId, attr => {
            return {
                ...attr,
                x: x,
                y: y,
            };
        });
        console.log('This node was updated:', tabId, 'with this position:', x, y);
    }

    exportGraph() {
        return this.#graph.export();
    }

    importGraph(data) {
        this.#graph.clear();
        this.#graph.import(data);
    }

    hasNode(tabId) {
        return this.#graph.hasNode(tabId);
    }

    hasEdge(from, to) {
        return this.#graph.hasEdge(from, to);
    }

    addEdge(from, to) {
        if(from === to) {
            console.log('Cannot add edge between the same node:', from);
            return;
        }
        this.#graph.addEdge(from, to);
        console.log('This edge was added:', from, to);
    }

    ensureEdge(from, to) {
        let alreadyExists = false;
        if (this.hasEdge(from, to)) {
            console.log('This edge already exists:', from, to);
            alreadyExists = true;
        }
        if (this.hasEdge(to, from)) {
            console.log('the reverse of this edge already exists:', from, to);
            alreadyExists = true;
        }
        if (alreadyExists) {
            return;
        }
        this.addEdge(from, to);
        console.log('This edge was added:', from, to);
    }

    clearEdge(from, to) {
        let removedEdge = false;
        if (this.hasEdge(from, to)) {
            this.#graph.dropEdge(from, to);
            removedEdge = true;
            console.log('This edge was removed:', from, to);
        }
        if (this.hasEdge(to, from)) {
            this.#graph.dropEdge(to, from);
            removedEdge = true;
            console.log('The reverse of this edge was removed:', from, to);
        }
        if (!removedEdge) {
            console.log('No edge was removed:', from, to);
        }
    }

    getTabNodeEdges(tabId) {
        let edges = [];
        for (const edge of this.#graph.edges(tabId)) {
            edges.push(edge);
        }
        return edges;
    }

    highlightNode(tabId) { 
        if (!this.hasNode(tabId)) {
            console.log('Cannot highlight this node as it does not exist:', tabId);
            return;
        }
        const fullTitle = this.#graph.getNodeAttribute(tabId, 'title');
        this.#graph.mergeNodeAttributes(tabId, { highlighted: true, label: fullTitle } );
        console.log('This node was highlighted:', tabId);
    }

    unhighlightNode(tabId) {
        if (!this.hasNode(tabId)) {
            console.log('Cannot unhighlight this node as it does not exist:', tabId);
            return;
        }
        const title = this.#graph.getNodeAttribute(tabId, 'title');
        this.#graph.mergeNodeAttributes(tabId, { highlighted: false, label: title.length > TITLE_LEN ? title.substring(0, TITLE_LEN) + '...' : title});
        console.log('This node was unhighlighted:', tabId);
    }

    clearAllHighlights() {
        for (const node of this.#graph.nodes()) {
            this.unhighlightNode(node);
        }
    }
}