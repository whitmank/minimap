// Interface for "Tab" objects expecteed from the browser by the App.
export interface Tab {
  name: string;
  title: string;
  url: string;
}

// TEST DATA
import data from "./assets/rhizome-tabs.json";
export const tabs: Tab[] = data.tabs;

// CHROME DATA

// Get a list of opened tabs in the active window.
