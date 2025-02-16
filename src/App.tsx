import Graph from "./components/Graph";
import data from "./assets/rhizome-tabs.json";
import { SimulationNodeDatum } from "d3-force";

// Interface for "Tab" object expected in the data file.
export interface Tab {
  name: string;
  title: string;
  url: string;
}
// CustomNode == SimulationNodeDatum + Tab
export interface CustomNode extends SimulationNodeDatum, Tab {
}

const tabArray: Tab[] = data.tabs;
const nodeArray: CustomNode[] = tabArray;

function App() {
  return (
    <>
      <Graph nodeArray={nodeArray} />
    </>
  );
}

export default App;
