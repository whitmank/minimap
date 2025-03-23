import {
  forceCenter,
  ForceLink,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from "d3-force";
import { CustomSimulation } from "./schemas";

import { Node, Edge } from "./schemas";

// Function to configure the initial simulation forces.
export function initSim(nodes: Node[], edges: Edge[]): CustomSimulation {

  const simulation = forceSimulation<Node, Edge>(nodes)
    .force("link", forceLink(edges).id ((node) => hasUuid(node) ? node.uuid! : ""))
    .force("x", forceX(50))
    .force("y", forceY(50))
    .force("center", forceCenter(50, 50))
    .force("charge", forceManyBody());

  const customSimulation = simulation as CustomSimulation;

  customSimulation.updateData = (newNodes: Node[], newEdges: Edge[]) => {
    customSimulation.nodes(newNodes);
    const linkForce = customSimulation.force("link") as ForceLink<Node, Edge>;
    if (linkForce) { linkForce.links(newEdges) };
    customSimulation.alpha(1).restart();
  };

  return customSimulation;
}

// Type Guard to check if 'node' has a 'uuid'
const hasUuid = (d: Node): d is Node => 'uuid' in d;
