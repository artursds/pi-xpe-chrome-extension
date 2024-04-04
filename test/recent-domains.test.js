import { jest } from "@jest/globals";
import {
  addRecentDomain,
  cleanRecentDomains,
  getRecentDomains,
} from "../src/recent-domains.js";

const oneDayInMs = 24 * 60 * 60 * 1000;
const recentDomainsExample = {
  "www.amazon.com": new Date().getTime(),
  "www.mercadolivre.com.br": new Date().getTime() - oneDayInMs,
};

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

describe("get recent domains tests", () => {
  test("should return an existent recentDomains object", async () => {
    mockLocalStorage({
      recentDomains: recentDomainsExample,
    });
    const recentDomains = await getRecentDomains();
    expect(recentDomains).toEqual(recentDomainsExample);
  });

  test("should return an empty object when recentDomains is undefined", async () => {
    mockLocalStorage(undefined);
    const recentDomains = await getRecentDomains();
    expect(recentDomains).toEqual({});
  });

  test("should return an empty object when recentDomains is empty object", async () => {
    mockLocalStorage({});
    const recentDomains = await getRecentDomains();
    expect(recentDomains).toEqual({});
  });

  test("should return an empty object when recentDomains is a string", async () => {
    mockLocalStorage("any-string");
    const recentDomains = await getRecentDomains();
    expect(recentDomains).toEqual({});
  });
});

describe("add recent domains tests", () => {
  test("should set new domain with time", async () => {
    const domain = "www.kabum.com.br";
    mockLocalStorage({
      recentDomains: recentDomainsExample,
    });
    jest.spyOn(chrome.storage.local, "set");
    const timeBefore = new Date().getTime();

    await addRecentDomain(domain);
    const timeAfter = new Date().getTime();

    const argument = chrome.storage.local.set.mock.calls[0][0];
    expect(argument).toHaveProperty("recentDomains");
    expect(argument.recentDomains["www.amazon.com"]).toBe(
      recentDomainsExample["www.amazon.com"]
    );
    expect(argument.recentDomains["www.mercadolivre.com.br"]).toBe(
      recentDomainsExample["www.mercadolivre.com.br"]
    );
    expect(argument.recentDomains[domain]).toBeGreaterThanOrEqual(timeBefore);
    expect(argument.recentDomains[domain]).toBeLessThanOrEqual(timeAfter);
  });
});

describe("clean recent domains tests", () => {
  test("should return a object without old domain", async () => {
    mockLocalStorage({ recentDomains: recentDomainsExample });
    jest.spyOn(chrome.storage.local, "set");

    await cleanRecentDomains();

    const argument = chrome.storage.local.set.mock.calls[0][0];
    expect(argument).toHaveProperty("recentDomains");
    expect(argument.recentDomains["www.amazon.com"]).toBe(
      recentDomainsExample["www.amazon.com"]
    );
    expect(argument.recentDomains["www.mercadolivre.com.br"]).toBeUndefined();
  });
});
