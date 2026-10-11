/**
 * Formats a duration given in seconds as `H:MM:SS`.
 *
 * Input domain: a finite number from 0 up to and including `Number.MAX_SAFE_INTEGER`.
 * `-0` is accepted and treated as `0`.
 *
 * Truncation: fractional seconds are truncated toward zero, never rounded.
 * For example `59.9` gives `"0:00:59"` and `3600.999` gives `"1:00:00"`.
 * Seconds in the result are therefore always between 0 and 59.
 *
 * Output format: `H:MM:SS`. Minutes and seconds are always two digits.
 * Hours are never padded and are not capped at 24, so `86400` gives `"24:00:00"`
 * and `360001` gives `"100:00:01"`.
 *
 * Errors:
 * - `TypeError` when the runtime value is not of type `number` (for example a string,
 *   `undefined` or `null` passed through a cast).
 * - `RangeError` when the number is `NaN`, infinite, negative, or greater than
 *   `Number.MAX_SAFE_INTEGER`. The message contains the offending value.
 *
 * No string is returned for invalid input.
 *
 * @example
 * formatDuration(0);      // "0:00:00"
 * formatDuration(59.9);   // "0:00:59"
 * formatDuration(90061);  // "25:01:01"
 *
 * @param seconds - The duration in seconds.
 * @returns The duration formatted as `H:MM:SS`.
 * @throws {TypeError} If `seconds` is not a number.
 * @throws {RangeError} If `seconds` is not finite, is negative, or exceeds `Number.MAX_SAFE_INTEGER`.
 */
export function formatDuration(seconds: number): string {
  if (typeof seconds !== 'number') {
    throw new TypeError(`formatDuration: seconds must be a number, got ${typeof seconds}`);
  }
  if (!Number.isFinite(seconds) || seconds < 0 || seconds > Number.MAX_SAFE_INTEGER) {
    throw new RangeError(
      `formatDuration: seconds must be finite, >= 0 and <= Number.MAX_SAFE_INTEGER, got ${String(seconds)}`,
    );
  }

  // Adding 0 turns -0 into +0. Math.trunc truncates fractional seconds toward zero.
  const total = Math.trunc(seconds) + 0;
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  return `${String(hours)}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
