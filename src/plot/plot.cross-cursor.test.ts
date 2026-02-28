import { describe, expect, it } from '@jest/globals';
import * as d3 from 'd3';
import { CrossCursor } from './plot.cross-cursor';
import { Scale } from './elements';
import { Rect } from './util';

describe('CrossCursor', () => {
    it('creates cursor elements and updates their positions', () => {
        const root = d3.create('svg:g');
        const cursor = new CrossCursor();
        const scale = new Scale();
        scale.updateScales(new Rect({ left: 0, top: 0, width: 100, height: 100 }));

        cursor.initialize(root as any);
        cursor.updatePosition(scale, 20, 30, new Rect({ left: 0, top: 0, width: 100, height: 100 }));

        const lines = root.selectAll('line').nodes() as SVGLineElement[];
        expect(lines.length).toBe(2);
        expect(lines[0].getAttribute('x1')).toBe('20');
        expect(lines[0].getAttribute('y2')).toBe('100');
        expect(lines[1].getAttribute('x2')).toBe('100');
        expect(lines[1].getAttribute('y1')).toBe('30');

        const text = root.select('text').text();
        expect(text).toBe('(20.00, 70.00}');
    });
});
