import {
  forceCenter,
  forceCollide,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from "d3-force";


export function simConfig(simulation: Simulation<customNode, undefined>) {
  return simulation
    // Configure initial simulation forces here.
      .force("x", forceX(50))
      .force("y", forceY(50))
      .force("center", forceCenter(50, 50))
      .force("charge", forceManyBody());
}
