const API_URL = "https://pa-xpe-api.netlify.app/api";
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

const checkCurrentUrl = async (_tabId, _changeInfo, tab) => {
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

chrome.runtime.onStartup.addListener(updateBlacklist);

chrome.tabs.onUpdated.addListener(checkCurrentUrl);
