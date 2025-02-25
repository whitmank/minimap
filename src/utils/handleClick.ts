export function handleNodeClick(tabIndex: number) {
  chrome.tabs.highlight({ tabs: tabIndex });
}
