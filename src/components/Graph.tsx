import "../styles/Graph.css";
import { handleNodeClick } from "../utils/handleClick.ts";
import { CustomNode } from "../interfaces.ts";

interface GraphProps {
  nodes: CustomNode[];
}

export default function Graph({ nodes }: GraphProps) {
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
