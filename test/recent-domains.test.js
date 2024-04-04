import { jest } from "@jest/globals";
import { getRecentDomains } from "../src/recent-domains.js";

const recentDomainsExample = {
  "www.amazon.com": new Date().getTime(),
  "www.mercadolivre.com.br": new Date().getTime(),
};

const mockLocalStorageGet = (returnValue) => {
  global.chrome = {
    storage: {
      local: {
        get: jest
          .fn()
          .mockImplementationOnce((key) => Promise.resolve(returnValue)),
      },
    },
  };
};

describe("get recent domains tests", () => {
  test("should return an existent recentDomains object", async () => {
    mockLocalStorageGet({
      recentDomains: recentDomainsExample,
    });
    const recentDomains = await getRecentDomains();
    expect(recentDomains).toEqual(recentDomainsExample);
  });

  test("should return an empty object when recentDomains is undefined", async () => {
    mockLocalStorageGet(undefined);
    const recentDomains = await getRecentDomains();
    expect(recentDomains).toEqual({});
  });

  test("should return an empty object when recentDomains is empty object", async () => {
    mockLocalStorageGet({});
    const recentDomains = await getRecentDomains();
    expect(recentDomains).toEqual({});
  });

  test("should return an empty object when recentDomains is a string", async () => {
    mockLocalStorageGet("any-string");
    const recentDomains = await getRecentDomains();
    expect(recentDomains).toEqual({});
  });
});
