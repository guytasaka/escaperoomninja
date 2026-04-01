import { describe, expect, test } from "vitest";
import app from "./index";

describe("api", () => {
  test("health check returns ok", async () => {
    const response = await app.request("/health");
    expect(response.status).toBe(200);
  });
});
