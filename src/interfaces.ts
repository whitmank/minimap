import { SimulationNodeDatum, SimulationLinkDatum } from "d3-force";

/*
All Nodes are Pages.
Tabs are Pages that are currently open.
Some Nodes are Tabs.
*/

// Page (i.e. Bookmarks)
export interface Page {
  uuid: string; // Not intrinsic to the site, for use within the application.
  name: string; // Default = title // For custom renaming.
  title: string;
  url: string;
}

// Tab from Chrome
export interface CustomTab extends Page {
  tabId: number;
  tabIndex: number;
}

// Force Simulation - Custom Node
export interface CustomNode extends SimulationNodeDatum, Page {}
// Force Simulation - Custom Link
export interface CustomLink extends SimulationLinkDatum<CustomNode> {
  source: string;
  target: string;
  strength: number;
}
