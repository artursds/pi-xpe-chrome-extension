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

const getCounter = async () => {
  const { counter } = await chrome.storage.local.get("counter");
  await chrome.storage.local.set({ counter: counter + 1 });
  return counter;
};

const checkCurrentUrl = async (tab) => {
  if (tab.status != "complete") return;
  const domain = new URL(tab.url).host;
  if (!blacklist.includes(domain)) return;

  const counter = await getCounter();
  const query = `counter=${counter}&domain=${domain}`;
  chrome.tabs.create({
    url: `https://www.youtube.com/@primorico?${query}`,
  });
  await chrome.storage.local.set({ counter: counter + 1 });
};

(async () => {
  await updateBlacklist();
  await createCounter();
})();

chrome.runtime.onStartup.addListener(async () => await updateBlacklist());

chrome.tabs.onUpdated.addListener(
  async (_tabId, _changeInfo, tab) => await checkCurrentUrl(tab)
);
