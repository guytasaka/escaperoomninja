export type Project = {
  id: string;
  ownerId: string;
  name: string;
  status: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateProjectInput = {
  ownerId: string;
  name: string;
  metadata?: Record<string, unknown>;
};
