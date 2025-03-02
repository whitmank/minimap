import "../styles/Graph.css";
import { goToTab } from "../utils/handleClick.ts";
import { CustomNode } from "../schemas.ts";

interface GraphProps {
  nodes: CustomNode[];
}

export default function Graph({ nodes }: GraphProps) {
  return (
    <svg className="canvas" viewBox="0 0 100 100">
      {nodes.map((node) => {
        return (
          // Individual circles
          <g key={node.uuid}>
            <circle
              className="node"
              onClick={() => {
                // if node is an active tab
                if (node.tabId && node.tabIndex) {
                  goToTab(node.tabIndex!);
                }
              }}
              id={node.uuid}
              r="3"
              cx={node.x}
              cy={node.y}
            />
            <text dx={(node.x ?? 0) + 4} dy={node.y ?? 0} fontSize="3">
              {node.content!.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
