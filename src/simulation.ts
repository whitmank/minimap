import {
  forceCenter,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from "d3-force";

import { CustomNode } from "./schemas";

// Function to configure the initial simulation forces.
export function initSim(nodes: CustomNode[]) {
  return forceSimulation(nodes)
    .force("x", forceX(50))
    .force("y", forceY(50))
    .force("center", forceCenter(50, 50))
    .force("charge", forceManyBody());
}
