export type UserAccount = {
  id: string;
  email: string;
  password: string;
  username: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
};

export type UserSession = {
  userId: string;
  email: string;
  username: string;
  displayName: string;
  createdAt: string;
};

export type RegisterInput = {
  email: string;
  password: string;
  passwordConfirm: string;
  username: string;
  displayName: string;
};

export type AuthResult =
  | { ok: true; user: UserAccount; session: UserSession }
  | { ok: false; error: string };
