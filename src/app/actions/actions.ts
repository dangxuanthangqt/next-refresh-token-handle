"use server";

import { CookieKey, defaultCookieOptions } from "@/constants/cookie";
import isNumber from "@/utils/is-number";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { z } from "zod";

const tokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export async function saveTokensToCookies(tokens: {
  accessToken: string;
  refreshToken: string;
}) {
  try {
    const { accessToken, refreshToken } = await tokensSchema.parseAsync(tokens);

    const decodedRefreshToken = jwtDecode(refreshToken);
    const expiresRefreshToken = isNumber(decodedRefreshToken.exp)
      ? decodedRefreshToken.exp * 1000
      : undefined;

    const cookieStore = await cookies();

    cookieStore.set({
      ...defaultCookieOptions,
      name: CookieKey.ACCESS_TOKEN,
      value: accessToken,
      expires: expiresRefreshToken,
    });

    cookieStore.set({
      ...defaultCookieOptions,
      name: CookieKey.REFRESH_TOKEN,
      value: refreshToken,
      expires: expiresRefreshToken,
    });
  } catch (error) {
    console.error("Error saving tokens to cookies:", error);
  }
}
