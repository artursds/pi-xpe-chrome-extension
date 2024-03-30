const API_URL = "http://localhost:8000/api";
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

const getRecentDomains = async () => {
  let { recentDomains } = await chrome.storage.local.get("recentDomains");
  if (!recentDomains) recentDomains = {};
  return recentDomains;
};

const setRecentDomains = async (recentDomains) => {
  await chrome.storage.local.set({ recentDomains });
};

const addRecentDomain = async (domain) => {
  const recentDomains = await getRecentDomains();
  recentDomains[domain] = new Date().getTime();
  await setRecentDomains(recentDomains);
};

const dateIsLessThanADayAgo = (dateInMs) => {
  const oneDayInMs = 24 * 60 * 60 * 1000;
  const todayInMs = new Date().getTime();
  return dateInMs + oneDayInMs < todayInMs;
};

const cleanRecentDomains = async () => {
  const recentDomains = await getRecentDomains();
  for (const domain in recentDomains) {
    const domainInsertionDateInMs = recentDomains[domain];
    if (dateIsLessThanADayAgo(domainInsertionDateInMs)) continue;
    delete recentDomains[domain];
  }
  await setRecentDomains(recentDomains);
};

const checkCurrentUrl = async (_tabId, _changeInfo, tab) => {
  if (tab.status != "complete") return;
  const domain = new URL(tab.url).host;
  const recentDomains = await getRecentDomains();
  if (recentDomains[domain]) return;
  if (!blacklist.includes(domain)) return;

  const [counter] = await Promise.all([getCounter(), addRecentDomain(domain)]);
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

chrome.runtime.onStartup.addListener(cleanRecentDomains);

chrome.tabs.onUpdated.addListener(checkCurrentUrl);
