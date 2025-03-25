import serverFetch from "@/api/http-client/server-fetch";
import { CookieKey } from "@/constants/cookie";
import { cookies } from "next/headers";
import { defaultCookieOptions } from "../token/route";
import { jwtDecode } from "jwt-decode";
import isNumber from "@/utils/is-number";

/**
 * Refresh token
 *
 * @param request
 * @returns
 */
export async function POST(request: Request) {
  console.info({
    method: request.method,
    userAgent: request.headers.get("user-agent"),
  });

  const now = performance.now();
  const cookieStore = await cookies();

  try {
    const refreshTokenFromCookie =
      cookieStore.get(CookieKey.REFRESH_TOKEN)?.value ?? null;

    console.log("refreshTokenFromCookie", refreshTokenFromCookie);
    const response = await serverFetch<{
      accessToken: string;
      refreshToken: string;
    }>(`/auth/refresh-token`, {
      method: "POST",
      body: JSON.stringify({ refreshToken: refreshTokenFromCookie }),
    });

    const { accessToken, refreshToken } = response.data;

    const decodedRefreshToken = jwtDecode(refreshToken);
    const expiresRefreshToken = isNumber(decodedRefreshToken.exp)
      ? decodedRefreshToken.exp * 1000
      : undefined;

    cookieStore.set({
      ...defaultCookieOptions,
      name: CookieKey.ACCESS_TOKEN,
      value: accessToken,
      expires: expiresRefreshToken, // expires cookie same as refresh token
    });

    cookieStore.set({
      ...defaultCookieOptions,
      name: CookieKey.REFRESH_TOKEN,
      value: refreshToken,
      expires: expiresRefreshToken,
    });

    return Response.json({ message: "ok", accessToken, refreshToken });
  } catch (error) {
    console.error({ method: request.method, error });
    return Response.json({ message: "failed" }, { status: 400 });
  } finally {
    console.info({
      method: request.method,
      responseTime: performance.now() - now,
    });
  }
}
