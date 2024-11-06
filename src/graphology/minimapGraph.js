import { Graph } from 'graphology';

const DEFAULT_NODE_SIZE = 20;
const NODE_MAX_DIST = 100;

export class MinimapGraph {
    #graph = new Graph();

    constructor(tabs) {
        if (tabs !== undefined) {
            this.initializeWithTabs(tabs);
        }
    }

    get graph() {
        return this.#graph;
    }

    initializeWithTabs(tabs) {
        for (const tab of tabs) {
            this.#graph.addNode(tab.id,
                {
                    label: tab.title,
                    url: tab.url,
                    x: Math.random() * NODE_MAX_DIST,
                    y: Math.random() * NODE_MAX_DIST,
                    size: DEFAULT_NODE_SIZE
                });
        }
    }

    addTabNode(tabId) {
        this.#graph.addNode(tabId,
            {
                x: Math.random() * NODE_MAX_DIST,
                y: Math.random() * NODE_MAX_DIST,
                size: DEFAULT_NODE_SIZE
            });
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