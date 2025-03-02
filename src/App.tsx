// REACT
import "./styles/App.css";
import Graph from "./components/Graph";
import { useEffect, useState } from "react";
// DATA HANDLING
import { getTestData } from "./dataHandling.ts";
// SIMULATION
import { initSim } from "./simulation.ts";
import { SimulationNodeDatum } from "d3-force";

// APPLICATION
function App() {
  // Set initial component state
  const [nodes, setNodes] = useState<SimulationNodeDatum[]>([]);

  // Get data and set state.
  useEffect(() => {
    const DATA = getTestData();
    (async () => {
      const initNodes = await DATA;

      setNodes(initNodes);
    })();
  }, []);

  // Update the state every time 'nodes' changes
  useEffect(() => {
    const simulation = initSim(nodes);
    simulation.on("tick", () => {
      setNodes([...simulation.nodes()]);
    });
    // Stop sim??
    return () => {
      simulation.stop();
    };
  }, [nodes]); //

  return (
    <>
      <Graph nodes={nodes} />
    </>
  );
}

export default App;

/* TODO:

Implement edges!
Everything is a node:
Node => (Page) + (Tab) + (SimNode)

props to pass to Graph = {nodes: node[], edges: edge[]}
*/
