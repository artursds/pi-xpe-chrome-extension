const API_URL = "http://localhost:8000/api";
let blacklist = [];

const updateBlacklist = async () => {
  const response = await fetch(`${API_URL}/blacklist`);
  const content = await response.json();
  blacklist = content.domains;
};

export { API_URL, blacklist, updateBlacklist };
