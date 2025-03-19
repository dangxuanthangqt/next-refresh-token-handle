/**
 * Checks if a value is a number.
 *
 * @param value The value to be checked.
 * @returns Returns true if the value is a number, otherwise false.
 *
 * @example
 * // Example usage:
 * console.log(isNumber(42)); // Output: true
 * console.log(isNumber(42.1)); // Output: true
 * console.log(isNumber('42')); // Output: false
 */
export default function isNumber(value: unknown): value is number {
  return typeof value === "number";
}
