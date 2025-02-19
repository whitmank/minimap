import { SimulationNodeDatum } from "d3-force";

// Tab from Chrome
export interface CustomTab {
  name: string;
  title: string;
  url: string;
}

export interface CustomNode extends SimulationNodeDatum, CustomTab {
  // name: string;
  // title: string;
  // url: string;
  // index: number;
  // x: number;
  // y: number;
  // vx: number;
  // vy: number;
}
