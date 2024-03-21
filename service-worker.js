let blacklist = [];

const updateBlacklist = async () => {
  const response = await fetch("https://pokeapi.co/api/v2/item/");
  const json = await response.json();
  blacklist = json.results.map((item) => new URL(item.url).host);
};

const createCounter = async () => {
  const { counter } = await chrome.storage.local.get("counter");
  if (counter) return;
  await chrome.storage.local.set({ counter: 1 });
};

updateBlacklist();
createCounter();

chrome.runtime.onStartup.addListener(async () => updateBlacklist());

chrome.tabs.onUpdated.addListener(async (_tabId, _changeInfo, tab) => {
  if (tab.status != "complete") return;
  const domain = new URL(tab.url).host;
  if (!blacklist.includes(domain)) return;

  const { counter } = await chrome.storage.local.get("counter");
  chrome.tabs.create({
    url: `https://www.youtube.com/@primorico?counter=${counter}`,
  });
  await chrome.storage.local.set({ counter: counter + 1 });
});
