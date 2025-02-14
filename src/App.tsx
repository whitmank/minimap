import Graph from './components/Graph';
import data from './assets/abc.json';

// Interface for "Tab" object expected in the data file.
export interface Tab {
  name: string;
  title: string;
  url: string;
}
const tabArray: Tab[] = data.tabs;

function App() {
  return (
    <>
      <Graph tabArray={tabArray} />
    </>
  )
}

export default App;
