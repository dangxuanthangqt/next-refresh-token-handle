/**
 * Checks if the given value is null or undefined.
 *
 * @param value The value to be checked.
 * @returns Returns true if the value is null or undefined, otherwise false.
 *
 * @example
 * // Example usage:
 * console.log(isNil(null)); // Output: true
 * console.log(isNil(undefined)); // Output: true
 * console.log(isNil(42)); // Output: false
 * console.log(isNil('Hello')); // Output: false
 */
export default function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}
