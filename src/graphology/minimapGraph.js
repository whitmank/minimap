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
        for (const tab of tabs) {
            this.addTabNode(tab.id);
            this.updateTabNode(tab.id, tab.title, tab.url);
        }
    }

    addTabNode(tabId) {
        const x = Math.random() * NODE_MAX_DIST;
        const y = Math.random() * NODE_MAX_DIST;
        this.addTabNodeAt(tabId, x, y);
    }

    addTabNodeAt(tabId, x, y) {
        this.#graph.addNode(tabId,
            {
                x: x,
                y: y,
                size: DEFAULT_NODE_SIZE
            });
    }

    removeTabNode(tabId) {
        this.#graph.dropNode(tabId);
    }

    updateTabNode(tabId, title, url) {
        this.#graph.updateNodeAttributes(tabId, attr => {
            return {
                ...attr,
                label: title.length > TITLE_LEN ? title.substring(0, TITLE_LEN) + '...' : title,
                title: title,
                url: url,
            };
        });
    }

    updateTabNodePosition(tabId, x, y) {
        this.#graph.updateNodeAttributes(tabId, attr => {
            return {
                ...attr,
                x: x,
                y: y,
            };
        });
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
            return;
        }
        this.#graph.addEdge(from, to);
    }

    ensureEdge(from, to) {
        if (!this.hasEdge(from, to) && !this.hasEdge(to, from)) {
            this.addEdge(from, to);
        }
    }

    clearEdge(from, to) {
        if (this.hasEdge(from, to)) {
            this.#graph.dropEdge(from, to);
        }
        if (this.hasEdge(to, from)) {
            this.#graph.dropEdge(to, from);
        }
    }

    highlightNode(tabId) { 
        const fullTitle = this.#graph.getNodeAttribute(tabId, 'title');
        this.#graph.mergeNodeAttributes(tabId, { highlighted: true, label: fullTitle } );
    }

    unhighlightNode(tabId) {
        const title = this.#graph.getNodeAttribute(tabId, 'title');
        this.#graph.mergeNodeAttributes(tabId, { highlighted: false, label: title.length > TITLE_LEN ? title.substring(0, TITLE_LEN) + '...' : title});
    }

    clearAllHighlights() {
        for (const node of this.#graph.nodes()) {
            this.unhighlightNode(node);
        }
    }
}