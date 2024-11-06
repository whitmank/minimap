import { Graph } from 'graphology';

const DEFAULT_NODE_SIZE = 20;
const NODE_MAX_DIST = 100;

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
                label: title,
                url: url,
            };
        });
    }

    exportGraph() {
        return this.#graph.export();
    }

    importGraph(data) {
        this.#graph.import(data);
    }

    hasNode(tabId) {
        return this.#graph.hasNode(tabId);
    }
}