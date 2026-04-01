import { Hono } from "hono";
import { z } from "zod";
import type { AuthService } from "../auth/service";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function createAuthRouter(authService: AuthService) {
  const router = new Hono();

  router.post("/register", async (c) => {
    const body = await c.req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid registration payload",
          },
        },
        400,
      );
    }

    try {
      const user = await authService.register(parsed.data.email, parsed.data.password);
      return c.json(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
        201,
      );
    } catch (error) {
      if (error instanceof Error && error.message === "User already exists") {
        return c.json(
          {
            error: {
              code: "USER_EXISTS",
              message: error.message,
            },
          },
          409,
        );
      }

      return c.json(
        {
          error: {
            code: "INTERNAL_ERROR",
            message: "Unexpected error",
          },
        },
        500,
      );
    }
  });

  return router;
}
