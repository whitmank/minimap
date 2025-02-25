import { CustomNode } from "../interfaces.ts";
import { getChromeTabs } from "../browserData.ts";
import { useEffect, useState } from "react";
import { forceSimulation } from "d3-force";
import { simConfig } from "./simulation.ts";
import "../styles/Graph.css";
import { handleNodeClick } from "../utils/handleClick.ts";

// GRAPH COMPONENT
export default function Graph() {
  // Component State
  const [nodes, setNodes] = useState<CustomNode[]>([]);
  // Get tabs » setState
  useEffect(() => {
    getChromeTabs().then((tabArray) => {
      const initNodes: CustomNode[] = tabArray;
      setNodes(initNodes);
    });
  }, []);

  // Update the state every time 'nodes' changes
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

  // Render SVG to DOM

  return (
    <svg className="canvas" viewBox="0 0 100 100">
      {nodes.map((node) => (
        // Individual circles
        <g>
          <circle
            className="node"
            onClick={() => {
              handleNodeClick(node.tabIndex);
            }}
            key={node.url} // Not being assigned for some reason?
            id={node.title}
            r="3"
            cx={node.x}
            cy={node.y}
          />
          <text dx={(node.x ?? 0) + 4} dy={node.y ?? 0} fontSize="3">
            {node.title}
          </text>
        </g>
      ))}
    </svg>
  );
}
