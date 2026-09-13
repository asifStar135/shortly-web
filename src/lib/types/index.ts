export type UrlItem = {
  id: number;
  longUrl: string;
  shortCode: string;
  expiresAt?: string | null;
  title: string;
  active: boolean;
  visit: number;
  createdAt: string;
  updatedAt?: string;
};

export type APIResponse<T> = {
  status: number;
  message: string;
  data: T;
  errorCode: string;
};

export type User = {
  userId: number;
  username: string;
  email?: string;
  createdAt: string;
  updatedAt?: string;
  totalUrls?: number;
  totalVisits?: number;
  activeUrls?: number;
};

export enum editActions {
  enable = "ENABLE",
  disable = "DISABLE",
  title = "TITLE",
  expires = "EXPIRES",
  longUrl = "LONG_URL",
}
