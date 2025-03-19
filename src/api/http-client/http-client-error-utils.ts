// gkc_hash_code : 01HT4GHKWRNP5CZ1S2403Z32TG
import { HttpStatusCode } from "@/constants/http-status-code";
import isNumber from "@/utils/is-number";
import isObject from "@/utils/is-object";
import isString from "@/utils/is-string";

type DefaultExceptionDto = {
  statusCode: number;
  message: string;
};

function isHttpClientError(error: unknown): error is DefaultExceptionDto {
  return (
    isObject(error) &&
    isNumber((error as DefaultExceptionDto).statusCode) &&
    isString((error as DefaultExceptionDto).message)
  );
}

/**
 * Checks if error is http client forbidden error
 *
 * @param error
 * @returns
 */
export function isHttpClientForbiddenError(
  error: unknown
): error is DefaultExceptionDto {
  return (
    isHttpClientError(error) && error.statusCode === HttpStatusCode.FORBIDDEN
  );
}

/**
 * Checks if error is http client not found error
 *
 * @param error
 * @returns
 */
export function isHttpClientNotFoundError(
  error: unknown
): error is DefaultExceptionDto {
  return (
    isHttpClientError(error) && error.statusCode === HttpStatusCode.NOT_FOUND
  );
}

/**
 * Checks if error is http client invalid uuid error
 *
 * @param error
 * @returns
 */
export function isHttpClientInvalidUUIDError(error: unknown) {
  return (
    isHttpClientError(error) &&
    error.statusCode === HttpStatusCode.BAD_REQUEST &&
    error.message.includes("failed") &&
    error.message.includes("uuid")
  );
}
