import globalAxios, { AxiosError, AxiosRequestConfig } from "axios";
import BaseHttpClient from "./base-http-client";
import isNil from "@/utils/is-nil";
import {
  deleteAuthTokenFromInternalServer,
  getTokensFromInternalServer,
} from "../internal-auth-token-api";
import isString from "@/utils/is-string";
import {
  HttpStatusCode,
  HttpStatusCodeType,
} from "@/constants/http-status-code";
import { isHttpClientInvalidUUIDError } from "./http-client-error-utils";
import { ErrorRoutes, Routes } from "@/constants/route";
import isPromise from "@/utils/is-promise";
import { API_URL } from "@/constants/app-config";
import { refreshTokenFromInternalServer } from "../internal-refresh-token-api";
import isNull from "@/utils/is-null";

const privateAxios = globalAxios.create({
  baseURL: API_URL,

  // `timeout` specifies the number of milliseconds before the request times out.
  // If the request takes longer than `timeout`, the request will be aborted.
  timeout: 60_000, // 60 seconds

  // `paramsSerializer` is a config in charge of serializing `params`
  paramsSerializer: {
    // array indexes format (true - leads to brackets with indexes).
    // example: { a: ['b', 'c'] } => 'a[0]=b&a[1]=c'
    indexes: true,
    // override https://github.com/axios/axios/blob/v1.6.8/lib/helpers/buildURL.js#L14
    // need to encode `:`, `$`, `,`, `+`, `[`, and `]`
    encode: encodeURIComponent,
  },

  withCredentials: false,
});

// Define a manager for the HTTP headers
const privateHttpClientHeaderManager = {
  setAuthorization(token: string) {
    privateAxios.defaults.headers.common.Authorization = `Bearer ${token}`;
  },
  getAuthorization() {
    return privateAxios.defaults.headers.common.Authorization?.toString();
  },
};

// Define variables for handling unauthorized requests
let isProcessingUnauthorizedRequest = false;
let waitForAuthTokenToBeFetched: Promise<true> | false = false;

// let isProcessingRefreshToken = false;
let waitForRefreshTokenToBeFetched: Promise<true> | false = false;

privateAxios.interceptors.response.use(
  (response) => response,
  async (
    error: AxiosError<{
      message: string;
      statusCode: HttpStatusCodeType;
    }>
  ) => {
    const originalRequest = error.config;

    if (
      error.response?.status === HttpStatusCode.UNAUTHORIZED &&
      originalRequest &&
      error.response.data?.message.includes("expired") // check data error response from api
    ) {
      if (waitForRefreshTokenToBeFetched === false) {
        waitForRefreshTokenToBeFetched = new Promise((resolve, reject) => {
          (async () => {
            const responseData = await refreshTokenFromInternalServer();
            // can return only access token
            if (isNull(responseData)) {
              reject("Refresh token error.");
            }

            if (isString(responseData?.accessToken)) {
              privateHttpClientHeaderManager.setAuthorization(
                responseData.accessToken
              );
            }

            resolve(true);
          })();
        });
      }

      if (isPromise(waitForRefreshTokenToBeFetched)) {
        try {
          await waitForRefreshTokenToBeFetched;

          // Modify the original request's headers before retrying
          if (originalRequest.headers) {
            originalRequest.headers.Authorization =
              privateHttpClientHeaderManager.getAuthorization();
          }

          // Comprehensive cache busting for retry request
          const cacheBuster = `_retry=${Date.now()}`;
          if (originalRequest.url) {
            const separator = originalRequest.url.includes("?") ? "&" : "?";
            originalRequest.url += `${separator}${cacheBuster}`;
          }

          return privateAxios(originalRequest);
        } catch {
          return Promise.reject(error);
        } finally {
          waitForRefreshTokenToBeFetched = false;
        }
      }
    }

    return Promise.reject(error);
  }
);

class PrivateHttpClient extends BaseHttpClient {
  constructor(resource: string) {
    super({ axios: privateAxios, resource });
  }

  /**
   * Process authorization
   * get auth token if needed
   */
  private async processAuthorization() {
    // no authorization
    if (isNil(privateHttpClientHeaderManager.getAuthorization())) {
      if (waitForAuthTokenToBeFetched === false) {
        waitForAuthTokenToBeFetched = new Promise((resolve) => {
          (async () => {
            const tokens = await getTokensFromInternalServer();
            // return only access token

            if (isString(tokens?.accessToken)) {
              privateHttpClientHeaderManager.setAuthorization(
                tokens.accessToken
              );
            }

            // always resolve promise
            resolve(true);
          })();
        });
      }

      // ensure that the token is only fetched once, even if multiple requests are made at the same time
      // avoid multiple requests on the first page load
      if (isPromise(waitForAuthTokenToBeFetched)) {
        await waitForAuthTokenToBeFetched;

        waitForAuthTokenToBeFetched = false;
      }
    }
  }

  /**
   * Sends an HTTP request.
   *
   * @param config - The request configuration.
   * @returns The response data and status.
   */
  protected async request<T = unknown>(config: AxiosRequestConfig) {
    await this.processAuthorization();
    return super.request<T>(config);
  }

  /**
   * Handles HTTP response errors.
   *
   * @param error - The error to handle.
   * @returns The handled error.
   */
  protected handleError(error: unknown) {
    const targetError = super.handleError(error);

    // handle axios error
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (globalAxios.isAxiosError(error) && error.response) {
      const reason = error.response.data;

      /**
       * handle http error status code
       */
      switch (error.response.status as HttpStatusCodeType) {
        case HttpStatusCode.BAD_REQUEST: {
          if (isHttpClientInvalidUUIDError(reason)) {
            window.location.replace(ErrorRoutes.NOT_FOUND.PATH);
          }

          return reason;
        }
        case HttpStatusCode.UNAUTHORIZED: {
          if (isProcessingUnauthorizedRequest === false) {
            isProcessingUnauthorizedRequest = true;

            (async () => {
              const response = await deleteAuthTokenFromInternalServer();

              if (!response.ok) {
                console.error("Internal server error.");
                return;
              }

              const searchParams = new URLSearchParams({
                redirectUrl: window.location.pathname + window.location.search,
              });

              window.location.replace(
                Routes.LOGIN.PATH + `?${searchParams.toString()}`
              );
            })();
          }

          return { statusCode: HttpStatusCode.UNAUTHORIZED };
        }
        case HttpStatusCode.FORBIDDEN: {
          window.location.replace(ErrorRoutes.FORBIDDEN.PATH);
          return { statusCode: HttpStatusCode.FORBIDDEN };
        }
        case HttpStatusCode.NOT_FOUND: {
          window.location.replace(ErrorRoutes.NOT_FOUND.PATH);
          return { statusCode: HttpStatusCode.NOT_FOUND };
        }
        case HttpStatusCode.SYSTEM_ERROR: {
          // TODO: update later
          break;
        }
        case HttpStatusCode.MAINTENANCE_ERROR: {
          // TODO: update later
          break;
        }
      }

      return reason;
    }

    // unhandled error
    if (error instanceof Error) {
      // TODO: update later
    }

    return targetError;
  }
}

export { privateHttpClientHeaderManager };
export default PrivateHttpClient;
