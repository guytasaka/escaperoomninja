import type { ProjectStore } from "./store";
import type { Project } from "./types";

export class ProjectService {
  constructor(private readonly store: ProjectStore) {}

  async createProject(input: {
    ownerId: string;
    name: string;
    metadata?: Record<string, unknown>;
  }): Promise<Project> {
    return this.store.create({
      ownerId: input.ownerId,
      name: input.name,
      metadata: input.metadata,
    });
  }

  async listByOwner(ownerId: string): Promise<Project[]> {
    return this.store.listByOwner(ownerId);
  }
}
