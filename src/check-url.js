import { getRecentDomains, addRecentDomain } from "./recent-domains.js";
import { blacklist } from "./blacklist.js";
import { nextAccessCounter } from "./access-counter.js";

const needInterceptUrl = async (tab) => {
  if (tab.status != "complete") return false;

  const domain = new URL(tab.url).host;
  const recentDomains = await getRecentDomains();
  if (recentDomains[domain]) return false;

  return blacklist.includes(domain);
};

const checkCurrentUrl = async (_tabId, _changeInfo, tab) => {
  const needIntercept = await needInterceptUrl(tab);
  if (!needIntercept) return;

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
