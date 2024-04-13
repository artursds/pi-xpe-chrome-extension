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
