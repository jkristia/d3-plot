import { describe, expect, it } from '@jest/globals';
import * as d3 from 'd3';
import { LineTooltip } from './line-tooltip';

describe('LineTooltip', () => {
    it('formats labels with formatter preference order', () => {
        const tooltip = new LineTooltip() as any;
        const lines = tooltip.formatData({
            point: { x: 1, y: 2 },
            seriesLabel: 'Line-1',
            xTooltipFormatter: (x: number) => `x=${x}`,
            yTooltipFormatter: (y: number) => `y=${y}`,
        });
        expect(lines).toEqual(['x=1', 'Line-1: y=2']);
    });

    it('returns zero position without initialized container', () => {
        const tooltip = new LineTooltip() as any;
        expect(tooltip.getMousePosition(new MouseEvent('mousemove', { clientX: 8, clientY: 9 }))).toEqual({ x: 0, y: 0 });
    });

    it('reads pointer coordinates relative to container', () => {
        const root = d3.create('svg:g');
        const tooltip = new LineTooltip();
        tooltip.initialize(root as any);
        const pos = (tooltip as any).getMousePosition(new MouseEvent('mousemove', { clientX: 8, clientY: 9 }));
        expect(typeof pos.x).toBe('number');
        expect(typeof pos.y).toBe('number');
    });
});
