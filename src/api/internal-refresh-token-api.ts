import { APP_URL } from "@/constants/app-config";

const apiURL = APP_URL + "/api/auth/refresh-token";

/**
 * Refresh token from internal server
 *
 * @returns
 */
export async function refreshTokenFromInternalServer(): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
} | null> {
  try {
    const response = await fetch(apiURL, {
      method: "POST",
      mode: "same-origin",
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data: { accessToken: string | null; refreshToken: string | null } =
      await response.json();

    return data;
  } catch {
    return null;
  }
}
