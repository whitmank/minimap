import { useEffect, useState } from "react";
import { CustomNode } from "../App.tsx";
import { forceSimulation } from "d3-force";
import { simConfig } from "./sim_config.ts";

// Define prop type for Graph()
interface GraphProps {
  nodeArray: CustomNode[];
}

// Expects a CustomNode[] as a prop
export default function Graph({ nodeArray }: GraphProps) {
  // Component State
  const [nodes, setNodes] = useState<CustomNode[]>(nodeArray);

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
  }, [nodeArray]); //


  // Render to DOM
  return (
    // Parent SVG
    <svg className="canvas" viewBox="0 0 100 100">
      {nodes.map((node) => (
        // Individual circles
        <circle
          key={node.name} // Not being assigned for some reason?
          id={node.name}
          r="2"
          cx={node.x}
          cy={node.y}
        />
      ))}
    </svg>
  );
}
