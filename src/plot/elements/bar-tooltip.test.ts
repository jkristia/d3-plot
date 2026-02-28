import { describe, expect, it } from '@jest/globals';
import * as d3 from 'd3';
import { BarTooltip } from './bar-tooltip';

describe('BarTooltip', () => {
    it('formats labels using tooltip formatter fallback chain', () => {
        const tooltip = new BarTooltip() as any;
        const lines = tooltip.formatData({
            point: { x: 3, y: 5 },
            seriesLabel: 'Series A',
            xTickFormatter: (x: number) => `x:${x}`,
            yTickFormatter: (y: number) => `y:${y}`,
        });
        expect(lines).toEqual(['x:3', 'Series A: y:5']);
    });

    it('returns zero coordinates when container is unavailable', () => {
        const tooltip = new BarTooltip() as any;
        const pos = tooltip.getMousePosition(new MouseEvent('mousemove', { clientX: 10, clientY: 20 }));
        expect(pos).toEqual({ x: 0, y: 0 });
    });

    it('uses d3 pointer relative to container when initialized', () => {
        const root = d3.create('svg:g');
        const tooltip = new BarTooltip();
        tooltip.initialize(root as any);
        const pos = (tooltip as any).getMousePosition(new MouseEvent('mousemove', { clientX: 10, clientY: 20 }));
        expect(typeof pos.x).toBe('number');
        expect(typeof pos.y).toBe('number');
    });
});
