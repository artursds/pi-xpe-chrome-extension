const API_URL = "http://localhost:8000/api";
let blacklist = [];

const updateBlacklist = async () => {
  try {
    const response = await fetch(`${API_URL}/blacklist`);
    const content = await response.json();
    blacklist = content.domains;
  } catch (error) {
    blacklist = [];
  }
};

export { API_URL, blacklist, updateBlacklist };
