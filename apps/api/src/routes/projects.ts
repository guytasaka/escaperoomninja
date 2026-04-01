import { Hono } from "hono";
import { z } from "zod";
import type { ProjectService } from "../projects/service";

const createProjectSchema = z.object({
  ownerId: z.string().min(1),
  name: z.string().min(1),
  metadata: z.record(z.unknown()).optional(),
});

export function createProjectsRouter(projectService: ProjectService) {
  const router = new Hono();

  router.post("/", async (c) => {
    const body = await c.req.json();
    const parsed = createProjectSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid project payload",
          },
        },
        400,
      );
    }

    const project = await projectService.createProject(parsed.data);
    return c.json(project, 201);
  });

  router.get("/", async (c) => {
    const ownerId = c.req.query("ownerId");

    if (!ownerId) {
      return c.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "ownerId is required",
          },
        },
        400,
      );
    }

    const projects = await projectService.listByOwner(ownerId);
    return c.json({ data: projects });
  });

  return router;
}
