/**
 * Checks if a given value is a Promise.
 *
 * @param {unknown} value - The value to check.
 * @returns {boolean} `true` if the value is a Promise, `false` otherwise.
 *
 * @example
 * isPromise(Promise.resolve()); // => true
 * isPromise('not a promise'); // => false
 */
export default function isPromise(value: unknown): value is Promise<unknown> {
  return (
    !!value &&
    (typeof value === "object" || typeof value === "function") &&
    typeof (value as Promise<unknown>).then === "function"
  );
}
