import { schema } from "@escaperoomninja/db";
import type { createDbClient } from "@escaperoomninja/db";
import { eq } from "drizzle-orm";
import type { AuthUser, RegisterInput } from "./types";

export interface AuthUserStore {
  findByEmail(email: string): Promise<AuthUser | null>;
  create(input: RegisterInput): Promise<AuthUser>;
}

export class InMemoryAuthUserStore implements AuthUserStore {
  private users = new Map<string, AuthUser>();

  async findByEmail(email: string): Promise<AuthUser | null> {
    return this.users.get(email) ?? null;
  }

  async create(input: RegisterInput): Promise<AuthUser> {
    const now = new Date();
    const user: AuthUser = {
      id: crypto.randomUUID(),
      email: input.email,
      passwordHash: input.passwordHash,
      role: "user",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    this.users.set(user.email, user);
    return user;
  }
}

export class DrizzleAuthUserStore implements AuthUserStore {
  constructor(private readonly db: ReturnType<typeof createDbClient>["db"]) {}

  async findByEmail(email: string): Promise<AuthUser | null> {
    const result = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    const user = result[0];
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async create(input: RegisterInput): Promise<AuthUser> {
    const now = new Date();
    const inserted = await this.db
      .insert(schema.users)
      .values({
        id: crypto.randomUUID(),
        email: input.email,
        passwordHash: input.passwordHash,
        role: "user",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    const user = inserted[0];

    return {
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
