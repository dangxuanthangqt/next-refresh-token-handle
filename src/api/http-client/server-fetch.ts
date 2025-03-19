// gkc_hash_code : 01HT4GHKWRNP5CZ1S2403Z32TG

import { API_URL } from "@/constants/app-config";

const BASE_URL = API_URL;
const TIMEOUT = 60_000; // 60 seconds
const DEFAULT_OPTIONS: RequestInit = {
  mode: "cors",
  credentials: "omit",
  cache: "no-store",
};

type Options = RequestInit & { params?: URLSearchParams };

async function serverFetch<TData = unknown>(
  endpoint: string,
  options: Options
): Promise<{
  status: number;
  data: TData;
}> {
  const url = new URL(endpoint, BASE_URL);

  if (options.params) {
    url.search = options.params.toString();
  }

  const headers = new Headers(options.headers);

  if (options.method === "POST" || options.method === "PUT") {
    headers.set("Content-Type", "application/json");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      ...DEFAULT_OPTIONS,
      ...options,
      headers,
    });

    if (!response.ok) {
      const isResponseJson = response.headers
        .get("content-type")
        ?.includes("application/json");

      if (isResponseJson) {
        const json = await response.json();

        return Promise.reject(json);
      }

      return Promise.reject({
        status: response.status,
        statusText: response.statusText,
      });
    }

    const json = await response.json();

    return {
      status: response.status,
      data: json as TData,
    };
  } catch (error) {
    const _error =
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
          }
        : {
            name: "unknown error",
            message: JSON.stringify(error),
          };

    console.error({
      requestURL: url.toString(),
      error: _error,
    });

    return Promise.reject({ reason: _error });
    /* v8 ignore next */
  } finally {
    clearTimeout(timeoutId);
  }
}

export default serverFetch;
