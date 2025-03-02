// GRAPH PRIMITIVES
export type dataObj = {
  uuid: string;
  content_type: string;
  content: any;
  forceData: SimulationNodeDatum;
};

// export type Rel = {
//   source: string;
//   target: string;
//   strength: number;
// };

// export type GraphData = {
//   objects: Obj[];
//   relationships: Rel[];
// };

// A WEBPAGE
export type Page = {
  name: string; // Default = title // For custom renaming.
  title: string;
  url: string;
};

// BROWSER TAB - CHROME
export type CustomTab = Page & {
  tabId: number;
  tabIndex: number;
};

// SIMULATION
import { SimulationNodeDatum } from "d3-force";

export interface CustomNode
  extends SimulationNodeDatum,
    Partial<dataObj>,
    Partial<Page>,
    Partial<CustomTab> {}

// interface CustomLink extends SimulationLinkDatum<CustomNode> {
//   source: string;
//   target: string;
//   strength: number;
// }
