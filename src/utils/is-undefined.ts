/**
 * Checks if a value is undefined.
 *
 * @param value The value to be checked.
 * @returns Returns true if the value is undefined, otherwise false.
 *
 * @example
 * // Example usage:
 * console.log(isUndefined(undefined)); // Output: true
 * console.log(isUndefined(null)); // Output: false
 * console.log(isUndefined(0)); // Output: false
 * console.log(isUndefined('')); // Output: false
 */
export default function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}
