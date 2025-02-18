// Interface for "CustomTab" objects expected from the browser by the App.
// "Tab" is defined by the Chrome API

export interface CustomTab {
  name: string;
  title: string;
  url: string;
}

// TEST DATA
import test_data from "./test_data/rhizome-tabs.json";

// CHROME DATA

// Gets a list of tabs in the active window.
async function getChromeTabs() {
  const tabArray: CustomTab[] = [];
  const currentWindow = await chrome.windows.getCurrent({ populate: true });
  const currentTabs = currentWindow.tabs;

  currentTabs.forEach((tab) => {
    const customTab: CustomTab = {
      name: "empty",
      title: tab.title,
      url: tab.url,
    };
    tabArray.push(customTab);
    console.log(tabArray);
  });
}

getChromeTabs();

// EXPORT tabs to App.tsx
export const tabs: CustomTab[] = test_data.tabs;
