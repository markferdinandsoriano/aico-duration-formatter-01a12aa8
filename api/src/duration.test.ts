import { describe, expect, it } from 'vitest';
import * as durationModule from './duration.js';
import { formatDuration } from './duration.js';

const MAX_SAFE = Number.MAX_SAFE_INTEGER;

describe('formatDuration', () => {
  describe('examples from the spec', () => {
    it.each([
      [0, '0:00:00'],
      [1, '0:00:01'],
      [59, '0:00:59'],
      [60, '0:01:00'],
      [61, '0:01:01'],
      [3599, '0:59:59'],
      [3600, '1:00:00'],
      [86399, '23:59:59'],
      [86400, '24:00:00'],
      [90061, '25:01:01'],
      [360000, '100:00:00'],
      [360001, '100:00:01'],
      [3600000, '1000:00:00'],
      [36000000, '10000:00:00'],
    ])('formatDuration(%s) returns %s', (input, expected) => {
      expect(formatDuration(input)).toBe(expected);
    });
  });

  describe('fractional input is truncated', () => {
    it.each([
      [59.9, '0:00:59'],
      [3600.999, '1:00:00'],
      [0.5, '0:00:00'],
      [0.999, '0:00:00'],
    ])('formatDuration(%s) returns %s', (input, expected) => {
      expect(formatDuration(input)).toBe(expected);
    });

    it('never produces seconds of 60 or more', () => {
      for (const input of [59.999, 119.9999, 3599.9999, 86399.5, 0.999]) {
        const seconds = formatDuration(input).split(':')[2];
        expect(Number(seconds)).toBeGreaterThanOrEqual(0);
        expect(Number(seconds)).toBeLessThanOrEqual(59);
      }
    });
  });

  describe('format', () => {
    it('pads minutes and seconds to two digits', () => {
      const values = [0, 5, 9, 10, 59, 60, 61, 599, 600, 3599, 3600, 3605, 86399];
      for (const value of values) {
        expect(formatDuration(value)).toMatch(/^\d+:\d{2}:\d{2}$/);
      }
    });

    it('does not pad or cap the hours field', () => {
      expect(formatDuration(0).split(':')[0]).toBe('0');
      expect(formatDuration(59).split(':')[0]).toBe('0');
      expect(formatDuration(3600).split(':')[0]).toBe('1');
      expect(formatDuration(7200).split(':')[0]).toBe('2');
    });

    it('returns the same string on repeated calls', () => {
      for (let i = 0; i < 100; i++) {
        expect(formatDuration(90061)).toBe('25:01:01');
      }
    });

    it('always returns a string for valid input', () => {
      for (const value of [0, 59.9, 3600, 86400, MAX_SAFE]) {
        expect(typeof formatDuration(value)).toBe('string');
      }
    });
  });

  describe('safe integer boundary', () => {
    it('accepts Number.MAX_SAFE_INTEGER exactly', () => {
      expect(formatDuration(MAX_SAFE)).toBe('2501999792983:36:31');
    });

    it('rejects Number.MAX_SAFE_INTEGER + 1 with RangeError', () => {
      expect(() => formatDuration(MAX_SAFE + 1)).toThrow(RangeError);
    });

    it('rejects Number.MAX_SAFE_INTEGER + 2 with RangeError', () => {
      expect(() => formatDuration(MAX_SAFE + 2)).toThrow(RangeError);
    });
  });

  describe('negative zero', () => {
    it('formats -0 as zero without throwing', () => {
      expect(formatDuration(-0)).toBe('0:00:00');
    });
  });

  describe('invalid numbers throw RangeError naming the value', () => {
    it('rejects -1', () => {
      expect(() => formatDuration(-1)).toThrow(RangeError);
      expect(() => formatDuration(-1)).toThrow(/-1/);
    });

    it('rejects -0.5 instead of truncating it to zero', () => {
      expect(() => formatDuration(-0.5)).toThrow(RangeError);
    });

    it('rejects NaN', () => {
      expect(() => formatDuration(NaN)).toThrow(RangeError);
      expect(() => formatDuration(NaN)).toThrow(/NaN/);
    });

    it('rejects Infinity', () => {
      expect(() => formatDuration(Infinity)).toThrow(RangeError);
      expect(() => formatDuration(Infinity)).toThrow(/Infinity/);
    });

    it('rejects -Infinity', () => {
      expect(() => formatDuration(-Infinity)).toThrow(RangeError);
      expect(() => formatDuration(-Infinity)).toThrow(/-Infinity/);
    });

    it('never returns a value for invalid numeric input', () => {
      const inputs = [-1, -0.5, NaN, Infinity, -Infinity, MAX_SAFE + 1];
      for (const input of inputs) {
        let returned = false;
        try {
          formatDuration(input);
          returned = true;
        } catch {
          returned = false;
        }
        expect(returned).toBe(false);
      }
    });
  });

  describe('non-number runtime input throws TypeError', () => {
    it('rejects the numeric string "60"', () => {
      expect(() => formatDuration('60' as unknown as number)).toThrow(TypeError);
    });

    it('rejects undefined', () => {
      expect(() => formatDuration(undefined as unknown as number)).toThrow(TypeError);
    });

    it('rejects null', () => {
      expect(() => formatDuration(null as unknown as number)).toThrow(TypeError);
    });

    it('treats NaN as a RangeError, not a TypeError', () => {
      let caught: unknown;
      try {
        formatDuration(NaN);
      } catch (error) {
        caught = error;
      }
      expect(caught).toBeInstanceOf(RangeError);
      expect(caught).not.toBeInstanceOf(TypeError);
    });

    it('keeps RangeError and TypeError distinct', () => {
      let rangeError: unknown;
      let typeError: unknown;
      try {
        formatDuration(-1);
      } catch (error) {
        rangeError = error;
      }
      try {
        formatDuration('60' as unknown as number);
      } catch (error) {
        typeError = error;
      }
      expect(rangeError).toBeInstanceOf(RangeError);
      expect(rangeError).not.toBeInstanceOf(TypeError);
      expect(typeError).toBeInstanceOf(TypeError);
      expect(typeError).not.toBeInstanceOf(RangeError);
    });
  });

  describe('module shape', () => {
    it('exports only formatDuration as a function', () => {
      expect(Object.keys(durationModule)).toEqual(['formatDuration']);
      expect(typeof durationModule.formatDuration).toBe('function');
    });
  });
});
