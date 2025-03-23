export function goToTab(tabIndex: number) {
  chrome.tabs.highlight({ tabs: tabIndex });
}
