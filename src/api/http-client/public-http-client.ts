// gkc_hash_code : 01HT4GHKWRNP5CZ1S2403Z32TG
import globalAxios from "axios";

import { HttpStatusCode } from "@/constants/http-status-code";
import { ErrorRoutes } from "@/constants/route";

import BaseHttpClient from "./base-http-client";
import { isHttpClientInvalidUUIDError } from "./http-client-error-utils";

import type { HttpStatusCodeType } from "@/constants/http-status-code";
import { API_URL } from "@/constants/app-config";

const publicAxios = globalAxios.create({
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

class PublicHttpClient extends BaseHttpClient {
  constructor(resource: string) {
    super({ axios: publicAxios, resource });
  }

  /**
   * handle http response error
   *
   * @param error
   * @returns
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

export { publicAxios };
export default PublicHttpClient;
