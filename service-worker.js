let blacklist = [];

chrome.runtime.onStartup.addListener(async () => {
  const response = await fetch("https://pokeapi.co/api/v2/item/");
  const json = await response.json();
  blacklist = json.results.map((item) => new URL(item.url).host);
});
