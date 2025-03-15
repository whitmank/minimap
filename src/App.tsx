import "./styles/App.css";
// REACT
import Graph from "./components/Graph";
import { useEffect, useState, useRef } from "react";
// DATA
import { getTestData } from "./dataHandling.ts";
// SIMULATION
import { initSim } from "./simulation.ts";
import { CustomSimulation, GraphData, SimData } from "./schemas.ts";

// APPLICATION
function App() {
  // DB DATA
  const [data, setData] = useState<GraphData>({ objs: [], rels: [] });
  // SIMULATION DATA
  const [simData, setSimData] = useState<SimData>({ nodes: [], edges: [] });
  const simulationRef = useRef<CustomSimulation>(null);

  // Load initial data
  useEffect(() => {
    (async () => {
      const DATA = await getTestData();
      setData(DATA);
    })();
  }, []);

  // When data is loaded, initialize the simData variable.
  useEffect(() => {
    if (data.objs.length > 0) {
      setSimData({ nodes: [...data.objs], edges: [...data.rels] });
    }
  }, [data]);

  // SIMULATION
  useEffect(() => {
    const nodes = simData.nodes;
    const edges = simData.edges;
    // If simState has not yet been assigned a value, do nothing.
    if (nodes.length === 0) return;

    // If sim hasn't been initialized
    if (!simulationRef.current) {
      // Initialize simulation
      simulationRef.current = initSim(nodes, edges);
      // Update on each tick of the sim
      simulationRef.current.on("tick", () => {
        setSimData((prev) => ({
          nodes: [...simulationRef.current!.nodes()],
          edges: prev.edges // TODO
        }));
      });
    } else {
      // Update the simulation with new data, without restarting it.
      simulationRef.current.updateData(simData.nodes, simData.edges);
      console.log(simData)
    }

    return () => {
      simulationRef.current?.stop();
    };
  }, [simData]); //

  // COMPONENT
  return (
    <>
      <Graph {...simData} />
    </>
  );
}

export default App;
