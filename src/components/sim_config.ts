import { CustomNode } from "../interfaces.ts";
import {
  Simulation,
  forceCenter,
  forceManyBody,
  forceX,
  forceY,
} from "d3-force";

// Function to configure the initial simulation forces.
export function simConfig(simulation: Simulation<CustomNode, undefined>) {
  return (
    simulation
      // Add forces here.
      .force("x", forceX(50))
      .force("y", forceY(50))
      .force("center", forceCenter(50, 50))
      .force("charge", forceManyBody())
  );
}
