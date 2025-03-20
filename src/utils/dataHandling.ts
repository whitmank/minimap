import { GraphData, Obj } from "../App/schemas";

// TEST DATA

export async function getTestData() {
  const data = await import("../test_data/rhizome-tabs.json");
  const graphData: GraphData = {
    objs: data.objs,
    rels: data.rels,
  };
  return graphData;
}

// CHROME DATA
export async function getChromeTabs() {
  const tabObjs: Obj[] = [];
  const currentWindow = await chrome.windows.getCurrent({ populate: true });
  const currentTabs = currentWindow.tabs!;

  currentTabs.forEach((tab) => {
    const customTab: Obj = {
      uuid: "none",
      content_type: "Tab",
      content: {
        tabId: tab.id!,
        tabIndex: tab.index!,
        name: tab.title!,
        title: tab.title!,
        url: tab.url!,
      }
    };
    tabObjs.push(customTab);
  });

  const graphData: GraphData = {
    objs: tabObjs,
    rels: [],
  };
  return graphData;
}
