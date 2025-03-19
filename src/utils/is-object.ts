// gkc_hash_code : 01HT4GHKWRNP5CZ1S2403Z32TG
/**
 * Checks if a value is an object (e.g. arrays, functions, objects).
 *
 * @param value The value to be checked.
 * @returns Returns true if the value is an object, otherwise false.
 *
 * @example
 * // Example usage:
 * const obj = { key: 'value' };
 * const arr = [1, 2, 3];
 * const func = () => {};
 *
 * console.log(isObject(obj)); // Output: true
 * console.log(isObject(arr)); // Output: true
 * console.log(isObject(func)); // Output: true
 */
export default function isObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    value !== null && (typeof value === "object" || typeof value === "function")
  );
}
