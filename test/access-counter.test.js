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
    jest.spyOn(chrome.storage.local, "set");

    await createAccessCounter();

    const argument = chrome.storage.local.set.mock.calls[0][0];
    expect(argument).toEqual({ accessCounter: 1 });
  });

  test("should not create access counter when it already exists", async () => {
    mockLocalStorage({ accessCounter: 1 });
    jest.spyOn(chrome.storage.local, "set");

    await createAccessCounter();

    const calls = chrome.storage.local.set.mock.calls;
    expect(calls).toEqual([]);
  });
});

describe("next access counter tests", () => {
  test("should return and save 1 when access counter is undefinded", async () => {
    mockLocalStorage(undefined);
    jest.spyOn(chrome.storage.local, "set");

    const accessCounter = await nextAccessCounter();

    expect(accessCounter).toBe(1);
    const argument = chrome.storage.local.set.mock.calls[0][0];
    expect(argument).toEqual({ accessCounter: 2 });
  });

  test("should return access counter and save it incremented by 1", async () => {
    mockLocalStorage({ accessCounter: 5 });
    jest.spyOn(chrome.storage.local, "set");

    const accessCounter = await nextAccessCounter();

    expect(accessCounter).toBe(5);
    const argument = chrome.storage.local.set.mock.calls[0][0];
    expect(argument).toEqual({ accessCounter: 6 });
  });
});
