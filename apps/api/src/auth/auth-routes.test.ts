import { describe, expect, test } from "vitest";
import app from "../index";

describe("auth routes", () => {
  test("registers a user", async () => {
    const response = await app.request("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "agent@example.com",
        password: "password123",
      }),
    });

    expect(response.status).toBe(201);
    const payload = await response.json();
    expect(payload.email).toBe("agent@example.com");
    expect(payload.role).toBe("user");
  });

  test("rejects duplicate email", async () => {
    await app.request("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "dupe@example.com",
        password: "password123",
      }),
    });

    const response = await app.request("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "dupe@example.com",
        password: "password123",
      }),
    });

    expect(response.status).toBe(409);
  });
});
