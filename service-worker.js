let blacklist = [];

chrome.runtime.onStartup.addListener(async () => {
  const response = await fetch("https://pokeapi.co/api/v2/item/");
  const json = await response.json();
  blacklist = json.results.map((item) => new URL(item.url).host);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.status != "complete") return;
  const domain = new URL(tab.url).host;
  if (!blacklist.includes(domain)) return;
  chrome.tabs.create({ url: "https://www.youtube.com/@primorico" });
});