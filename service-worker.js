const API_URL = "http://localhost:8000/api";
let blacklist = [];

const updateBlacklist = async () => {
  const response = await fetch(`${API_URL}/blacklist`);
  const content = await response.json();
  blacklist = content.domains;
};

const getAccessCounter = async () => {
  let { accessCounter } = await chrome.storage.local.get("accessCounter");
  return accessCounter;
};

const setAccessCounter = async (accessCounter) => {
  await chrome.storage.local.set({ accessCounter });
};

const createAccessCounter = async () => {
  const accessCounter = await getAccessCounter();
  if (accessCounter) return;
  await setAccessCounter(1);
};

const nextAccessCounter = async () => {
  let accessCounter = await getAccessCounter();
  if (!accessCounter) accessCounter = 1;
  await setAccessCounter(accessCounter + 1);
  return accessCounter;
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

  const [accessCounter] = await Promise.all([
    nextAccessCounter(),
    addRecentDomain(domain),
  ]);
  const query = `counter=${accessCounter}&domain=${domain}`;
  chrome.tabs.create({
    url: `${API_URL}/financial-content?${query}`,
  });
};

(async () => {
  await updateBlacklist();
  await createAccessCounter();
})();

chrome.runtime.onStartup.addListener(updateBlacklist);

chrome.runtime.onStartup.addListener(cleanRecentDomains);

chrome.tabs.onUpdated.addListener(checkCurrentUrl);
