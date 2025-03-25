export const CookieKey = {
  ACCESS_TOKEN: "at",
  REFRESH_TOKEN: "rt",
} as const;

export const defaultCookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  secure: true,
} as const;

export const defaultStrictCookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "strict",
  secure: true,
} as const;
