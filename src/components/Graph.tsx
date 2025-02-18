import { useEffect, useState } from "react";
import { CustomNode } from "../components/sim_config.ts";
import { forceSimulation } from "d3-force";
import { simConfig } from "./sim_config.ts";
import "../styles/Graph.css";

// Define prop type for Graph()
interface GraphProps {
  initNodes: CustomNode[];
}

// Expects a CustomNode[] as a prop
export default function Graph({ initNodes }: GraphProps) {
  // Component State
  const [nodes, setNodes] = useState<CustomNode[]>(initNodes);

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
  }, [initNodes]); //

  // Render to DOM
  return (
    // Parent SVG
    <svg className="canvas" viewBox="0 0 100 100">
      {nodes.map((node) => (
        // Individual circles
        <circle
          key={node.url} // Not being assigned for some reason?
          id={node.name}
          r="2"
          cx={node.x}
          cy={node.y}
        />
      ))}
    </svg>
  );
}
