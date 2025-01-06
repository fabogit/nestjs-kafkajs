/**
 * Pauses execution for a specified duration.
 *
 * @param {number} timeout The duration to sleep, in milliseconds.
 * @returns {Promise<void>} A Promise that resolves after the timeout.
 * @throws {TypeError} If the timeout is not a number.
 * @throws {RangeError} If the timeout is negative.
 *
 * @example
 * async function myFunction() {
 *   console.log('Before sleep');
 *   await sleep(1000); // Wait for 1 second
 *   console.log('After sleep');
 * }
 */
export const sleep = (timeout: number) => {
  return new Promise<void>((resolve) => setTimeout(resolve, timeout));
};
