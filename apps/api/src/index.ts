import { createDbClient } from "@escaperoomninja/db";
import { Hono } from "hono";
import { AuthService } from "./auth/service";
import { DrizzleAuthUserStore, InMemoryAuthUserStore } from "./auth/store";
import { env } from "./env";
import { ProjectService } from "./projects/service";
import { DrizzleProjectStore, InMemoryProjectStore } from "./projects/store";
import { createAuthRouter } from "./routes/auth";
import { createProjectsRouter } from "./routes/projects";

const app = new Hono();

const dbClient = env.DATABASE_URL ? createDbClient(env.DATABASE_URL) : null;

const authStore = dbClient ? new DrizzleAuthUserStore(dbClient.db) : new InMemoryAuthUserStore();
const projectStore = dbClient ? new DrizzleProjectStore(dbClient.db) : new InMemoryProjectStore();

const authService = new AuthService(authStore);
const projectService = new ProjectService(projectStore);

app.get("/health", (c) => {
  return c.json({ status: "ok", env: env.NODE_ENV, database: Boolean(dbClient) });
});

app.route("/auth", createAuthRouter(authService));
app.route("/projects", createProjectsRouter(projectService));

export default app;
