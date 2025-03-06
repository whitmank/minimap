import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from "d3-force";

import { CustomNode, CustomEdge } from "./schemas";

// Function to configure the initial simulation forces.
export function initSim(nodes: CustomNode[], edges: CustomEdge[]) {
  return forceSimulation(nodes)
    .force(
      "link",
      forceLink(edges).id((d) => d.uuid),
    )
    .force("x", forceX(50))
    .force("y", forceY(50))
    .force("center", forceCenter(50, 50))
    .force("charge", forceManyBody());
}
