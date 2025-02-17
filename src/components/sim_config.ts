import {
  forceCenter,
  forceManyBody,
  forceX,
  forceY,
  Simulation
} from "d3-force";
import { CustomNode } from "../App";

export function simConfig(simulation: Simulation<CustomNode, undefined>) {
  return simulation
    // Configure initial simulation forces here.
      .force("x", forceX(50))
      .force("y", forceY(50))
      .force("center", forceCenter(50, 50))
      .force("charge", forceManyBody());
}
