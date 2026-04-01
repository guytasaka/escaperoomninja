import { schema, withTransaction } from "@escaperoomninja/db";
import type { createDbClient } from "@escaperoomninja/db";
import { eq } from "drizzle-orm";
import type { CreateProjectInput, Project } from "./types";

export interface ProjectStore {
  create(input: CreateProjectInput): Promise<Project>;
  listByOwner(ownerId: string): Promise<Project[]>;
}

export class InMemoryProjectStore implements ProjectStore {
  private projects = new Map<string, Project>();

  async create(input: CreateProjectInput): Promise<Project> {
    const now = new Date();
    const project: Project = {
      id: crypto.randomUUID(),
      ownerId: input.ownerId,
      name: input.name,
      status: "draft",
      metadata: input.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    };

    this.projects.set(project.id, project);
    return project;
  }

  async listByOwner(ownerId: string): Promise<Project[]> {
    return [...this.projects.values()].filter((project) => project.ownerId === ownerId);
  }
}

export class DrizzleProjectStore implements ProjectStore {
  constructor(private readonly db: ReturnType<typeof createDbClient>["db"]) {}

  async create(input: CreateProjectInput): Promise<Project> {
    return withTransaction(this.db, async (tx) => {
      const now = new Date();
      const inserted = await tx
        .insert(schema.projects)
        .values({
          id: crypto.randomUUID(),
          ownerId: input.ownerId,
          name: input.name,
          status: "draft",
          metadata: input.metadata ?? {},
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      const project = inserted[0];
      return {
        id: project.id,
        ownerId: project.ownerId,
        name: project.name,
        status: project.status,
        metadata: project.metadata,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      };
    });
  }

  async listByOwner(ownerId: string): Promise<Project[]> {
    const results = await this.db
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.ownerId, ownerId));

    return results.map((project) => ({
      id: project.id,
      ownerId: project.ownerId,
      name: project.name,
      status: project.status,
      metadata: project.metadata,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }));
  }
}
