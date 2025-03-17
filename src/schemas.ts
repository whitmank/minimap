// ----------------------------------------------------------------------
// GRAPH PRIMITIVES
export type GraphData = {
  objs: Obj[];
  rels: Rel[];
};

export type Obj = {
  uuid: string;
  content_type: string;
  content: any;
};

export type Rel = {
  source: string;
  target: string;
  strength: number;
};

//----------------------------------------------------------------------
// SIMULATION
// Everything is a node:
// Node => (Page) + (Tab) + (SimNode)

import { Simulation, SimulationNodeDatum, SimulationLinkDatum } from "d3-force";

export interface SimData {
  nodes: Node[];
  edges: Edge[];
}

export interface Node
  extends SimulationNodeDatum, Partial<Obj>, Partial<Page>, Partial<Tab>{}

export interface Edge extends SimulationLinkDatum<Node> {
  source: string;
  target: string;
  strength: number;
}

export interface CustomSimulation extends Simulation<Node, Edge> {
  updateData: (newNodes: Node[], newEdges: Edge[]) => void;
}

//----------------------------------------------------------------------
// A WEBPAGE
export type Page = {
  name: string; // Default = title // For custom renaming.
  title: string;
  url: string;
};

// BROWSER TAB - CHROME
export type Tab = Page & {
  tabId: number;
  tabIndex: number;
};
