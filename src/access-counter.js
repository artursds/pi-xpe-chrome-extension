const getAccessCounter = async () => {
  const response = await chrome.storage.local.get("accessCounter");
  if (!response || !response.accessCounter) return false;
  return response.accessCounter;
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

export { createAccessCounter, nextAccessCounter };
