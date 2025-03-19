import { APP_URL } from "@/constants/app-config";

const apiURL = APP_URL + "/api/auth/token";

/**
 * Save accessToken for internal server
 *
 * @param data
 * @returns
 */
export async function saveTokensForInternalServer(data: {
  accessToken: string;
  refreshToken: string;
}) {
  return fetch(apiURL, {
    method: "POST",
    mode: "same-origin",
    credentials: "include",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
    }),
  });
}

/**
 * Get accessToken from internal server
 *
 * @returns
 */
export async function getTokensFromInternalServer(): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
} | null> {
  try {
    const response = await fetch(apiURL, {
      method: "GET",
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

/**
 * Delete accessToken from internal server
 *
 * @returns
 */
export async function deleteAuthTokenFromInternalServer() {
  return fetch(apiURL, {
    method: "DELETE",
    mode: "same-origin",
    credentials: "include",
    cache: "no-store",
  });
}
