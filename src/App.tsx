// REACT
import "./styles/App.css";
import Graph from "./components/Graph";
import { useEffect, useState } from "react";
// DATA
import { getChromeTabs, getTestPages } from "./data.ts";
import { CustomNode } from "./interfaces.ts";
// SIMULATION
import { initSim } from "./simulation.ts";

// Application
function App() {
  // Set initial component state
  const [nodes, setNodes] = useState<CustomNode[]>([]);

  // Get data and set state.
  useEffect(() => {
    const DATA = getTestPages();
    (async () => {
      const initNodes: CustomNode[] = await DATA;
      console.log(initNodes);
      setNodes(initNodes);
    })();
  }, []);

  // Update the state every time 'nodes' changes
  useEffect(() => {
    // Initial sim conditions » sim_config.ts
    // const simulation = simConfig(forceSimulation(nodes));
    const simulation = initSim(nodes);
    // With each tick of the simulation, update nodes.
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
Import simulation.ts
init sim = empty nodes, empty edges
initialize nodes, save in local storage.
intialize edges, save in local storage.

props to pass to Graph = {nodes: node[], edges: edge[]}
*/
