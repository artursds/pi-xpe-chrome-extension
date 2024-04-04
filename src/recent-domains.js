const getRecentDomains = async () => {
  const response = await chrome.storage.local.get("recentDomains");
  if (!response || !response.recentDomains) return {};
  return response.recentDomains;
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
  const nowInMs = new Date().getTime();
  return dateInMs < nowInMs && nowInMs - oneDayInMs < dateInMs;
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

export { getRecentDomains, addRecentDomain, cleanRecentDomains };
