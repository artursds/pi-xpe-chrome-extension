import { getRecentDomains, addRecentDomain } from "./recent-domains.js";
import { blacklist } from "./blacklist.js";
import { nextAccessCounter } from "./access-counter.js";

const needInterceptUrl = async (tab) => {
  if (tab.status != "complete") return false;

  const domain = new URL(tab.url).host;
  const recentDomains = await getRecentDomains();
  if (recentDomains[domain]) return false;

  if (!blacklist.includes(domain)) return false;
  return true;
};

const checkCurrentUrl = async (_tabId, _changeInfo, tab) => {
  const needInterceptUrl = await needInterceptUrl(tab);
  if (!needInterceptUrl) return;

  const [accessCounter] = await Promise.all([
    nextAccessCounter(),
    addRecentDomain(domain),
  ]);
  const query = `counter=${accessCounter}&domain=${domain}`;
  chrome.tabs.create({
    url: `${API_URL}/financial-content?${query}`,
  });
};

export { checkCurrentUrl };
