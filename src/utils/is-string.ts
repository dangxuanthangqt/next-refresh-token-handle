/**
 * Checks if a value is a string.
 *
 * @param value The value to be checked.
 * @returns Returns true if the value is a string, otherwise false.
 *
 * @example
 * // Example usage:
 * console.log(isString('Hello')); // Output: true
 * console.log(isString(42)); // Output: false
 * console.log(isString(true)); // Output: false
 */
export default function isString(value: unknown): value is string {
  return typeof value === "string";
}
