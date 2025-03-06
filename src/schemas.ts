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

import { SimulationNodeDatum, SimulationLinkDatum } from "d3-force";

export interface SimData {
  nodes: CustomNode[];
  edges: CustomEdge[];
}

export interface CustomNode
  extends SimulationNodeDatum,
    Partial<Obj>,
    Partial<Page> {}

export interface CustomEdge extends SimulationLinkDatum<CustomNode> {
  source: string;
  target: string;
  strength: number;
}

//----------------------------------------------------------------------
// A WEBPAGE
export type Page = {
  name: string; // Default = title // For custom renaming.
  title: string;
  url: string;
};

// BROWSER TAB - CHROME
// export type CustomTab = {
//   tabId: number;
//   tabIndex: number;
// };
