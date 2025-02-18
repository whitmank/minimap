import { Tab } from "../browserData";
import {
  Simulation,
  SimulationNodeDatum,
  forceCenter,
  forceManyBody,
  forceX,
  forceY,
} from "d3-force";

export interface CustomNode extends SimulationNodeDatum, Tab {}

// Function to configure the initial simulation forces.
export function simConfig(simulation: Simulation<CustomNode, undefined>) {
  return simulation
    // Add forces here.
      .force("x", forceX(50))
      .force("y", forceY(50))
      .force("center", forceCenter(50, 50))
      .force("charge", forceManyBody());
}
