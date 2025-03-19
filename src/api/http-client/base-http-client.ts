import isUndefined from "@/utils/is-undefined";
import globalAxios, { AxiosError } from "axios";

import type { AxiosRequestConfig, AxiosInstance } from "axios";

type BaseHttpClientOptions = {
  axios: AxiosInstance;
  resource: string;
};

type HttpClientRequestConfig = Omit<AxiosRequestConfig, "method">;

/**
 * Base HTTP client class.
 *
 * @example
 * const client = new BaseHttpClient({ axios: globalAxios, resource: '/api' });
 * client.get({ url: '/users' });
 */
class BaseHttpClient {
  protected axios: BaseHttpClientOptions["axios"];
  protected resource: BaseHttpClientOptions["resource"];

  /**
   * Constructs a new BaseHttpClient instance.
   *
   * @param options - The options for the HTTP client.
   */
  constructor({ axios, resource }: BaseHttpClientOptions) {
    this.axios = axios;
    this.resource = resource;
  }

  /**
   * Sends a GET request.
   *
   * @param config - The request configuration.
   * @returns The response data and status.
   */
  public get<T = unknown>(config: HttpClientRequestConfig) {
    return this.request<T>({ method: "get", ...config });
  }

  /**
   * Sends a POST request.
   *
   * @param config - The request configuration.
   * @returns The response data and status.
   */
  public post<T = unknown>(config: HttpClientRequestConfig) {
    return this.request<T>({ method: "post", ...config });
  }

  /**
   * Sends a PUT request.
   *
   * @param config - The request configuration.
   * @returns The response data and status.
   */
  public put<T = unknown>(config: HttpClientRequestConfig) {
    return this.request<T>({ method: "put", ...config });
  }

  /**
   * Sends a PATCH request.
   *
   * @param config - The request configuration.
   * @returns The response data and status.
   */
  public patch<T = unknown>(config: HttpClientRequestConfig) {
    return this.request<T>({ method: "patch", ...config });
  }

  /**
   * Sends a DELETE request.
   *
   * @param config - The request configuration.
   * @returns The response data and status.
   */
  public delete<T = unknown>(config: HttpClientRequestConfig) {
    return this.request<T>({ method: "delete", ...config });
  }

  /**
   * Normalizes the request URL.
   *
   * @param url - The URL to normalize.
   * @returns The normalized URL.
   */
  private normalizeUrl(url: AxiosRequestConfig["url"]) {
    const resource = this.resource.startsWith("/")
      ? this.resource
      : `/${this.resource}`;

    if (isUndefined(url)) return resource;
    if (url.startsWith(`${resource}/`)) return url;
    if (url.startsWith("/")) return resource + url;
    return `${resource}/${url}`;
  }

  /**
   * Sends an HTTP request.
   *
   * @param config - The request configuration.
   * @returns The response data and status.
   */
  protected async request<T = unknown>(config: AxiosRequestConfig) {
    try {
      const response = await this.axios<T>({
        ...config,
        url: this.normalizeUrl(config.url),
      });

      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: unknown) {
      const normalizedError = this.handleError(error);
      return Promise.reject(normalizedError);
    }
  }

  /**
   * Handles HTTP response errors.
   *
   * @param error - The error to handle.
   * @returns The handled error.
   */
  protected handleError(error: unknown) {
    // handle axios error
    if (globalAxios.isAxiosError(error)) {
      console.error(error.toJSON());

      // check if error is a request timed out
      if (error.code === AxiosError.ECONNABORTED) {
        console.error("The request has timed out.");
      }
    }

    return error;
  }
}

export default BaseHttpClient;
