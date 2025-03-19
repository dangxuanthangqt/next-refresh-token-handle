/**
 * Checks if the given value is null.
 *
 * @param value The value to be checked.
 * @returns Returns true if the value is null, otherwise false.
 *
 * @example
 * // Example usage:
 * console.log(isNull(null)); // Output: true
 * console.log(isNull(undefined)); // Output: false
 * console.log(isNull(42)); // Output: false
 * console.log(isNull('Hello')); // Output: false
 */
export default function isNull(value: unknown): value is null {
  return value === null;
}
