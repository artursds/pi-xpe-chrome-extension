import { jest } from "@jest/globals";
import { API_URL, blacklist, updateBlacklist } from "../src/blacklist.js";

const blacklistExample = ["www.amazon.com", "www.mercadolivre.com.br"];

global.fetch = jest.fn((key) =>
  Promise.resolve({
    json: () => Promise.resolve({ domains: blacklistExample }),
  })
);

describe("update blacklist tests", () => {
  test("should set blacklist array", async () => {
    await updateBlacklist();
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/blacklist`);
    expect(blacklist).toEqual(blacklistExample);
  });

  test("should set empty blacklist when fetch was rejected", async () => {
    global.fetch = jest
      .fn()
      .mockImplementationOnce((key) => Promise.reject(new Error("")));
    await updateBlacklist();
    expect(blacklist).toEqual([]);
  });

  test("should set empty blacklist when json was rejected", async () => {
    global.fetch = jest.fn().mockImplementationOnce((key) =>
      Promise.resolve({
        json: () => Promise.reject(new Error("")),
      })
    );
    await updateBlacklist();
    expect(blacklist).toEqual([]);
  });
});
