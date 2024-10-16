// ../src/sigma/graphMLgen.js
import { create } from "npm:xmlbuilder2";
import { pd } from "npm:pretty-data";
function generateMapGraph(windowsArray) {
  const root = create({
    encoding: "UTF-8",
    version: "1.0"
  }).ele("graphml", { xmlns: "http://graphml.graphdrawing.org/xmlns" }).ele("key").att("id", "l0").att("for", "node").att("attr.name", "label").att("attr.type", "string").up().ele("key").att("id", "l1").att("for", "node").att("attr.name", "url").att("attr.type", "string").up().ele("key").att("id", "l2").att("for", "node").att("attr.name", "size").att("attr.type", "string").up();
  for (let i = 0; i < windowsArray.length; i++) {
    const window = windowsArray[i];
    const graph = root.ele("graph").att("id", `G${window.id}`).att("edgedefault", "directed");
    populateWindowGraph(graph, window);
  }
  const xml = root.end({ prettyPrint: true });
  return xml;
}
function populateWindowGraph(graph, window) {
  const tabs = window.tabs;
  const winID = window.id;
  graph.ele("node").att("id", winID).ele("data").att("key", "l0").txt(`Window ${winID}`).up().ele("data").att("key", "l2").txt("20").up().up();
  for (let i = 0; i < tabs.length; i++) {
    const tab = tabs[i];
    const nodeID = `w${winID}t${i}`;
    const node = graph.ele("node").att("id", nodeID);
    const title = node.ele("data");
    title.att("key", "l0");
    title.txt(tab.title);
    const url = node.ele("data");
    url.att("key", "l1");
    url.txt(tab.url);
    const size = node.ele("data");
    size.att("key", "l2");
    size.txt("10");
    node.up();
    const edge = graph.ele("edge");
    edge.att("source", winID);
    edge.att("target", nodeID);
    edge.up();
  }
}

// ../src/sigma/graph.js
import { Sigma } from "npm:sigma";
import { Graph } from "npm:graphology";
import random from "npm:graphology-layout/random";
import ForceSupervisor from "npm:graphology-layout-force/worker";
import graphml from "npm:graphology-graphml";
document.addEventListener("DOMContentLoaded", async function() {
  const windows = await chrome.windows.getAll({ "populate": true });
  const xml = generateMapGraph(windows);
  const graph = graphml.parse(Graph, xml);
  random.assign(graph);
  const layout = new ForceSupervisor(graph, { maxIterations: 5 });
  layout.start();
  const container = document.getElementById("container");
  const sigmaInstance = new Sigma(graph, container);
});
