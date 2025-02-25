import { CustomTab, Page } from "./interfaces";

// TEST DATA
export async function getTestPages() {
  const pageArray: Page[] = (await import("./test_data/rhizome-tabs.json"))
    .nodes;
  return pageArray;
}

// CHROME DATA
export async function getChromeTabs() {
  const tabArray: CustomTab[] = [];
  const currentWindow = await chrome.windows.getCurrent({ populate: true });
  const currentTabs = currentWindow.tabs!;

  currentTabs.forEach((tab) => {
    const customTab: CustomTab = {
      uuid: "none",
      tabId: tab.id!,
      tabIndex: tab.index!,
      name: "empty"!,
      title: tab.title!,
      url: tab.url!,
    };
    tabArray.push(customTab);
  });
  return tabArray;
}
