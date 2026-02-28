import { describe, expect, it, jest } from '@jest/globals';

jest.mock('../elements', () => {
    const scale = jest.requireActual<typeof import('../elements/scale')>('../elements/scale');
    return { Scale: scale.Scale };
});

import { AxisAndGrid } from './axis-and-grid';
import { Scale } from './scale';
import { Rect } from '../util';

describe('AxisAndGrid', () => {
    it('renders axis and grid elements with configured visibility', () => {
        const item = new AxisAndGrid({ xTicks: 4, yTicks: 3, showXGrid: true, showYGrid: true });
        const scale = new Scale();
        scale.updateScales(new Rect({ left: 0, top: 0, width: 100, height: 100 }));
        item.setScale(scale);
        item.initializeLayout();
        item.updateLayout(new Rect({ left: 0, top: 0, width: 100, height: 100 }));

        const root = item.plotElement!;
        expect(root.selectAll('.x-axis').nodes().length).toBe(1);
        expect(root.selectAll('.y-axis').nodes().length).toBe(1);
        expect(root.selectAll('.v-line').nodes().length).toBeGreaterThan(0);
        expect(root.selectAll('.h-line').nodes().length).toBeGreaterThan(0);
    });

    it('supports hidden x-axis and rotation/tick formatting', () => {
        const item = new AxisAndGrid({
            showXAxis: false,
            xLabelRotateDeg: -45,
            yTickFormat: (v: number) => `y:${v}`,
        });
        const scale = new Scale();
        scale.updateScales(new Rect({ left: 0, top: 0, width: 80, height: 80 }));
        item.setScale(scale);
        item.initializeLayout();
        item.updateLayout(new Rect({ left: 0, top: 0, width: 80, height: 80 }));

        const root = item.plotElement!;
        expect(root.selectAll('.x-axis').nodes().length).toBe(0);
        const yTickText = root.select('.y-axis .tick text').text();
        expect(yTickText.startsWith('y:')).toBe(true);
    });
});
