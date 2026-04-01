import { describe, expect, test } from "vitest";
import app from "../index";

describe("projects routes", () => {
  test("creates and lists projects", async () => {
    const createResponse = await app.request("/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ownerId: "owner-1",
        name: "Haunted Hotel",
        metadata: {
          tone: "spooky",
        },
      }),
    });

    expect(createResponse.status).toBe(201);

    const listResponse = await app.request("/projects?ownerId=owner-1");
    expect(listResponse.status).toBe(200);

    const payload = await listResponse.json();
    expect(payload.data).toHaveLength(1);
    expect(payload.data[0].name).toBe("Haunted Hotel");
  });

  test("requires ownerId when listing", async () => {
    const response = await app.request("/projects");
    expect(response.status).toBe(400);
  });
});
