import Graph from "./components/Graph";
import { tabs } from "./browserData";
import "./styles/App.css";

function App() {
  return (
    <>
      <Graph initNodes={tabs} />
    </>
  );
}

export default App;
