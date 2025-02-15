import { useEffect, useState } from "react";
import { forceSimulation, forceX, forceY} from "d3-force";
import { CustomNode } from "../App.tsx";

// Define prop type for Graph()
interface GraphProps {
  nodeArray: CustomNode[];
}

// Expects a CustomNode[] as a prop
function Graph({ nodeArray }: GraphProps) {
  // COMPONENT STATE
  const [nodes, setNodes] = useState<CustomNode[]>(nodeArray);

  // RERENDER LOGIC
  useEffect(() => {
    // INITIAL SIMULATION CONDITIONS
    const simulation = forceSimulation(nodes)
      .force("x", forceX(10))
      .force("y", forceY(10))



    simulation.on("tick", () => {
      setNodes([...simulation.nodes()])
    });

    return () => { simulation.stop() }

  }, [nodeArray]);

  console.log(nodes)

  return (
    <svg className="canvas" viewBox="0 0 100 100">
      {nodes.map((node) => (
        <circle
          id={node.name}
          key={node.index}
          r="2"
          cx={node.x}
          cy={node.y} />
      ))}
    </svg>
  );
}

export default Graph;
