export type AuthUser = {
  id: string;
  email: string;
  passwordHash: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type RegisterInput = {
  email: string;
  passwordHash: string;
};
