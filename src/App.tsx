import "./styles/App.css";
// REACT
import Graph from "./components/Graph";
import { useEffect, useState } from "react";
// DATA
import { getTestData } from "./dataHandling.ts";
// SIMULATION
import { initSim } from "./simulation.ts";
import { GraphData, SimData } from "./schemas.ts";

// APPLICATION
function App() {
  // DB DATA
  const [data, setData] = useState<GraphData>({ objs: [], rels: [] });
  // SIMULATION DATA
  const [simState, setSimState] = useState<SimData>({ nodes: [], edges: [] });

  // Set initial data.
  useEffect(() => {
    (async () => {
      const DATA = await getTestData();
      setData(DATA);
    })();
  }, []);
  //DEPENDENCY ARRAY TROUBLE
  useEffect(() => {
    setSimState({ nodes: data.objs, edges: data.rels });
    console.log(simState);
  }, []);

  // Make mutable copy of data and use it to set the Sim State, stead of setting directly from data.objs and data.rels

  // SIMULATION
  useEffect(() => {
    const simulation = initSim(simState.nodes, simState.edges);
    // Update the state every time 'nodes' changes
    simulation.on("tick", () => {
      setSimState({
        nodes: [...simulation.nodes()],
        edges: simState.edges,
      });
    });

    return () => {
      simulation.stop();
    };
  }, [simState]); //

  // COMPONENT
  return (
    <>
      <Graph {...simState} />
    </>
  );
}

export default App;
