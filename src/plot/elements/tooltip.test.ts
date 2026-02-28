import { describe, expect, it } from '@jest/globals';
import * as d3 from 'd3';
import { TooltipBase } from './tooltip';
import { Rect } from '../util';

class UnitTooltip extends TooltipBase<{ a: string; b: string }> {
    protected formatData(data: { a: string; b: string }): string[] {
        return [data.a, data.b];
    }
}

describe('TooltipBase', () => {
    it('initialize/show/hide lifecycle toggles visibility and transform', () => {
        const root = d3.create('svg:g');
        const tooltip = new UnitTooltip();
        tooltip.initialize(root as any);

        const textNode = root.select('text').node() as any;
        textNode.getBBox = () => ({ width: 40, height: 20 });

        const event = new MouseEvent('mousemove', { clientX: 20, clientY: 30 });
        tooltip.show(event, { a: 'A', b: 'B' }, new Rect({ left: 0, top: 0, width: 80, height: 80 }));

        const elm = root.select('.plot-tooltip');
        expect(elm.classed('hidden')).toBe(false);
        expect(elm.attr('transform')).toBeTruthy();
        expect(root.selectAll('tspan').nodes().length).toBe(2);

        tooltip.hide();
        expect(elm.classed('hidden')).toBe(true);

        tooltip.destroy();
        expect(root.select('.plot-tooltip').node()).toBeNull();
    });
});
