import { CustomNode } from "../interfaces.ts";
import { getChromeTabs } from "../browserData.ts";
import { useEffect, useState } from "react";
import { forceSimulation } from "d3-force";
import { simConfig } from "./sim_config.ts";
import "../styles/Graph.css";

// TEST DATA
// import test_data from "../test_data/rhizome-tabs.json";
// const test_tabs: CustomTab[] = test_data.tabs;

// Expects a CustomNode[] as a prop
export default function Graph() {
  // Component State
  const [nodes, setNodes] = useState<CustomNode[]>([]);
  // Get tabs
  useEffect(() => {
    getChromeTabs().then((tabArray) => {
      const initNodes: CustomNode[] = tabArray;
      setNodes(initNodes);
    });
  }, []);

  // Update the state every time nodeArray changes
  useEffect(() => {
    // Initial sim conditions » sim_config.ts
    const simulation = simConfig(forceSimulation(nodes));
    // With each tick of the simulation, update nodes.
    simulation.on("tick", () => {
      setNodes([...simulation.nodes()]);
    });
    // Stop sim??
    return () => {
      simulation.stop();
    };
  }, [nodes]); //

  // Render to DOM
  return (
    // Parent SVG
    <svg className="canvas" viewBox="0 0 100 100">
      {nodes.map((node) => (
        // Individual circles
        <circle
          key={node.url} // Not being assigned for some reason?
          id={node.title}
          r="2"
          cx={node.x}
          cy={node.y}
        />
      ))}
    </svg>
  );
}
