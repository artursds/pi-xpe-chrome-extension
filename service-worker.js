const API_URL = "http://localhost:8000";
let blacklist = [];

const updateBlacklist = async () => {
  const response = await fetch(`${API_URL}/blacklist`);
  const content = await response.json();
  blacklist = content.domains;
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
    url: `${API_URL}/financial-content?${query}`,
  });
};

(async () => {
  await updateBlacklist();
  await createCounter();
})();

chrome.runtime.onStartup.addListener(async () => await updateBlacklist());

chrome.tabs.onUpdated.addListener(
  async (_tabId, _changeInfo, tab) => await checkCurrentUrl(tab)
);
