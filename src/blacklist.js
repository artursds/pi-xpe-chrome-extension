const REPOSITORY_URL =
  "https://vitor-msp.github.io/pa-xpe-repository/api-url.json";
let API_URL;
let blacklist = [];

const updateBlacklist = async () => {
  try {
    let response = await fetch(REPOSITORY_URL);
    let content = await response.json();
    API_URL = content.apiUrl;
    response = await fetch(`${API_URL}/blacklist`);
    content = await response.json();
    blacklist = content.domains;
  } catch (error) {
    blacklist = [];
  }
};

export { API_URL, blacklist, updateBlacklist };
