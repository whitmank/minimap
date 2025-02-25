import { CustomTab } from "./interfaces";
// CHROME DATA

// Gets a list of tabs in the active window.
export async function getChromeTabs() {
  const tabArray: CustomTab[] = [];
  const currentWindow = await chrome.windows.getCurrent({ populate: true });
  const currentTabs = currentWindow.tabs!;

  currentTabs.forEach((tab) => {
    const customTab: CustomTab = {
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
