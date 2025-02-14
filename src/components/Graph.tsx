import { forceSimulation, SimulationNodeDatum } from "d3-force";
import { Tab } from "../App.tsx";

// Define prop type for Graph()
interface GraphProps {
  tabArray: Tab[];
}

// CustomNode == SimulationNodeDatum + Tab
interface CustomNode extends SimulationNodeDatum, Tab {
  // index: number;
  // name: string;
  // title: string;
  // url: string;
  // vx: number;
  // vy: number;
  // x: number;
  // y: number;
}

function Graph({ tabArray }: GraphProps) {
  // convert Tab[] prop to CustomNode[] for use in force simulation
  const nodeArray: CustomNode[] = tabArray;
  // Create force simulation with the CustomNode[]
  const sim = forceSimulation(nodeArray);
  console.log(sim.nodes());

  return (
    <svg className="canvas" viewBox="0 0 100 100">
      {sim.nodes().map((tab) => (
        <circle id={tab.name} key={tab.index} cx={tab.x} cy={tab.y} r="3" />
      ))}
    </svg>
  );
}

export default Graph;
