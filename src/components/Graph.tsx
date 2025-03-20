import "../styles/Graph.css";
import { goToTab } from "../utils/handleClick.ts";
import { SimData } from "../schemas.ts";

export default function Graph(sim: SimData) {
  const [nodes, edges] = [sim.nodes, sim.edges];
  return (
    <svg className="canvas" viewBox="0 0 100 100">
      {/* RENDER NODES */}

      {edges.map((edge) => {
        const { source, target } = edge;
        const edgeSource = source as Node;
        const edgeTarget = target as Node;
        return (
          <line className="edge"
            strokeWidth="0.5"
            strokeOpacity="0.5"
            x1={edgeSource.x}
            y1={edgeSource.y}
            x2={edgeTarget.x}
            y2={edgeTarget.y}
          />
        );
      })}
      {nodes.map((node) => {
        return (
          // Individual circles
          <g key={node.uuid}>
            <circle
              className="node"
              onClick={() => {
                // if node is an active tab
                if (node.content.tabId && node.content.tabIndex) {
                  goToTab(node.content.tabIndex!);
                }
              }}
              id={node.uuid}
              r="2"
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
