import { updateBlacklist } from "./blacklist.js";
import { createAccessCounter } from "./access-counter.js";
import { cleanRecentDomains } from "./recent-domains.js";
import { checkCurrentUrl } from "./check-url.js";

(async () => {
  await updateBlacklist();
  await createAccessCounter();
})();

chrome.runtime.onStartup.addListener(updateBlacklist);

chrome.runtime.onStartup.addListener(cleanRecentDomains);

chrome.tabs.onUpdated.addListener(checkCurrentUrl);
