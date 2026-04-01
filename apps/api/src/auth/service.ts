import type { AuthUserStore } from "./store";
import type { AuthUser } from "./types";

export class AuthService {
  constructor(private readonly store: AuthUserStore) {}

  async register(email: string, password: string): Promise<AuthUser> {
    const existing = await this.store.findByEmail(email);
    if (existing) {
      throw new Error("User already exists");
    }

    return this.store.create({
      email,
      passwordHash: `plain:${password}`,
    });
  }
}
