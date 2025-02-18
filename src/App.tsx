import Graph from "./components/Graph";
import { tabs } from "./browserData";

function App() {
  return (
    <>
      <Graph initNodes={tabs} />
    </>
  );
}

export default App;
