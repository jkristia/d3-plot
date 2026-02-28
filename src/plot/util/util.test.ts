import { describe, expect, it } from '@jest/globals';
import { Util } from './util';

describe('Util', () => {
    it('isFunction detects callable values', () => {
        expect(Util.isFunction(() => 1)).toBe(true);
        expect(Util.isFunction(function named() { return 2; })).toBe(true);
        expect(Util.isFunction(123)).toBe(false);
        expect(Util.isFunction({})).toBe(false);
    });

    it('range yields values with explicit start/end', () => {
        expect(Array.from(Util.range(2, 8, 2))).toEqual([2, 4, 6]);
    });

    it('range supports single-arg form', () => {
        expect(Array.from(Util.range(4))).toEqual([0, 1, 2, 3]);
    });
});
