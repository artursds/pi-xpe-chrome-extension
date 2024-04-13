import { jest } from "@jest/globals";
import {
  createAccessCounter,
  nextAccessCounter,
} from "../src/access-counter.js";

const mockLocalStorage = (getReturnValue) => {
  global.chrome = {
    storage: {
      local: {
        get: jest
          .fn()
          .mockImplementationOnce((key) => Promise.resolve(getReturnValue)),
        set: jest.fn().mockImplementationOnce((object) => Promise.resolve()),
      },
    },
  };
};

describe("create access counter tests", () => {
  test("should create access counter setted with 1", async () => {
    mockLocalStorage(undefined);
    await createAccessCounter();
    expect(chrome.storage.local.set).toHaveBeenCalledTimes(1);
    expect(chrome.storage.local.set).toHaveBeenCalledWith({ accessCounter: 1 });
  });

  test("should not create access counter when it already exists", async () => {
    mockLocalStorage({ accessCounter: 1 });
    await createAccessCounter();
    expect(chrome.storage.local.set).toHaveBeenCalledTimes(0);
  });
});

describe("next access counter tests", () => {
  test("should return and save 1 when access counter is undefinded", async () => {
    mockLocalStorage(undefined);
    const accessCounter = await nextAccessCounter();
    expect(accessCounter).toBe(1);
    expect(chrome.storage.local.set).toHaveBeenCalledTimes(1);
    expect(chrome.storage.local.set).toHaveBeenCalledWith({ accessCounter: 2 });
  });

  test("should return access counter and save it incremented by 1", async () => {
    mockLocalStorage({ accessCounter: 5 });
    const accessCounter = await nextAccessCounter();
    expect(accessCounter).toBe(5);
    expect(chrome.storage.local.set).toHaveBeenCalledTimes(1);
    expect(chrome.storage.local.set).toHaveBeenCalledWith({ accessCounter: 6 });
  });
});
