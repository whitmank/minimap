import { GraphData } from "./schemas";

// TEST DATA

export async function getTestData() {
  const data = await import("./test_data/abc.json");
  const graphData: GraphData = {
    objs: data.objs,
    rels: data.rels,
  };
  return graphData;
}

// // CHROME DATA
// export async function getChromeTabs() {
//   const tabArray: CustomTab[] = [];
//   const currentWindow = await chrome.windows.getCurrent({ populate: true });
//   const currentTabs = currentWindow.tabs!;

//   currentTabs.forEach((tab) => {
//     const customTab: CustomTab = {
//       uuid: "none",
//       tabId: tab.id!,
//       tabIndex: tab.index!,
//       name: "empty"!,
//       title: tab.title!,
//       url: tab.url!,
//     };
//     tabArray.push(customTab);
//   });
//   return tabArray;
// }
