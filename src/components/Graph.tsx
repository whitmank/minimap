import { useEffect, useState } from "react";
import { CustomNode } from "../App.tsx";
import { forceSimulation } from "d3-force";
import { simConfig } from "./sim_config.ts";

// Define prop type for Graph()
interface GraphProps {
  nodeArray: CustomNode[];
}

// Expects a CustomNode[] as a prop
function Graph({ nodeArray }: GraphProps) {
  // COMPONENT STATE
  const [nodes, setNodes] = useState<CustomNode[]>(nodeArray);

  useEffect(() => {
    // INITIAL SIMULATION CONDITIONS — sim_config.ts
    const simulation = simConfig(forceSimulation(nodes));

    // UPDATE THE SIM STATE WITH EACH TICK
    simulation.on("tick", () => {
      setNodes([...simulation.nodes()]);
    });

    return () => {
      simulation.stop();
    };
  }, [nodeArray]);

  console.log(nodes);

  return (
    <svg className="canvas" viewBox="0 0 100 100">
      {nodes.map((node) => (
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

export default Graph;
