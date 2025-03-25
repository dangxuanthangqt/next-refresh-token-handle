import { CookieKey, defaultCookieOptions } from "@/constants/cookie";
import isNumber from "@/utils/is-number";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { z } from "zod";

const postRequestBodySchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

/**
 * Store token into the server cookie
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

  try {
    const json = await request.json();
    const body = postRequestBodySchema.parse(json);

    const decodedRefreshToken = jwtDecode(body.refreshToken);
    const expiresRefreshToken = isNumber(decodedRefreshToken.exp)
      ? decodedRefreshToken.exp * 1000
      : undefined;

    const cookieStore = await cookies();

    cookieStore.set({
      ...defaultCookieOptions,
      name: CookieKey.ACCESS_TOKEN,
      value: body.accessToken,
      expires: expiresRefreshToken, // expires cookie same as refresh token
    });

    cookieStore.set({
      ...defaultCookieOptions,
      name: CookieKey.REFRESH_TOKEN,
      value: body.refreshToken,
      expires: expiresRefreshToken,
    });

    return Response.json({ message: "saved" });
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

/**
 * Get token from the server cookie
 *
 * @param request
 * @returns
 */
export async function GET(request: Request) {
  console.info({
    method: request.method,
    userAgent: request.headers.get("user-agent"),
  });

  const now = performance.now();
  const cookieStore = await cookies();

  try {
    const accessToken = cookieStore.get(CookieKey.ACCESS_TOKEN)?.value ?? null;

    const refreshToken =
      cookieStore.get(CookieKey.REFRESH_TOKEN)?.value ?? null;

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

/**
 * Delete token from the server cookie
 *
 * @param request
 * @returns
 */
export async function DELETE(request: Request) {
  console.info({
    method: request.method,
    userAgent: request.headers.get("user-agent"),
  });

  const cookieStore = await cookies();

  const now = performance.now();

  try {
    cookieStore.delete({
      ...defaultCookieOptions,
      name: CookieKey.ACCESS_TOKEN,
    });
    cookieStore.delete({
      ...defaultCookieOptions,
      name: CookieKey.REFRESH_TOKEN,
    });

    return Response.json({ message: "deleted" });
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
