import { describe, expect, it, jest } from '@jest/globals';

jest.mock('../elements', () => {
    const scale = jest.requireActual<typeof import('../elements/scale')>('../elements/scale');
    return { Scale: scale.Scale };
});

import { Subject } from 'rxjs';
import { BarPlotItem } from './bar';
import { Rect } from '../util';
import { Scale } from './scale';
import { MockPlotAreaOwner, MockTooltip, pointToClientEvent } from '../test/mocks';

describe('BarPlotItem', () => {
    it('renders grouped bar items with css class and geometry', () => {
        const owner = new MockPlotAreaOwner();
        const scale = new Scale();
        scale.updateScales(new Rect({ left: 0, top: 0, width: 100, height: 100 }));
        const item = new BarPlotItem({
            series: [
                { label: 'A', cssClass: 'series-a', points: [{ x: 10, y: 20 }] },
                { label: 'B', points: [{ x: 10, y: 40 }] },
            ],
        });
        item.setOwner(owner);
        item.setScale(scale);
        item.initializeLayout();
        item.updateLayout(new Rect({ left: 0, top: 0, width: 100, height: 100 }));

        const bars = item.plotElement!.selectAll('.bar-item').nodes() as SVGRectElement[];
        expect(bars.length).toBe(2);
        expect(bars[0].getAttribute('class')).toContain('series-a');
        expect(Number(bars[0].getAttribute('width'))).toBeGreaterThan(0);
        expect(Number(bars[0].getAttribute('height'))).toBeGreaterThan(0);
    });

    it('shows and hides tooltip during bar hover interactions', () => {
        const owner = new MockPlotAreaOwner();
        const scale = new Scale();
        scale.updateScales(new Rect({ left: 0, top: 0, width: 100, height: 100 }));
        const tooltip = new MockTooltip();
        const item = new BarPlotItem(
            { series: [{ label: 'A', points: [{ x: 10, y: 20 }] }] },
            { tooltip, xTooltipFormatter: (x: number) => `x:${x}` }
        );
        item.setOwner(owner);
        item.setScale(scale);
        item.initializeLayout();
        item.updateLayout(new Rect({ left: 0, top: 0, width: 100, height: 100 }));

        const bar = item.plotElement!.select('.bar-item').node() as SVGRectElement;
        bar.dispatchEvent(pointToClientEvent('mouseenter', { x: 10, y: 10 }));
        expect(tooltip.showCalls.length).toBe(1);
        expect(tooltip.showCalls[0].data.seriesLabel).toBe('A');
        bar.dispatchEvent(pointToClientEvent('mouseleave', { x: 10, y: 10 }));
        expect(tooltip.hideCalls).toBe(1);
    });

    it('responds to global and series-level dataChanged and unsubscribes on destroy', () => {
        const changed = new Subject<void>();
        const seriesChanged = new Subject<void>();
        const owner = new MockPlotAreaOwner();
        const scale = new Scale();
        scale.updateScales(new Rect({ left: 0, top: 0, width: 100, height: 100 }));
        const item = new BarPlotItem({
            dataChanged: changed,
            series: [{ points: [{ x: 1, y: 1 }], dataChanged: seriesChanged }],
        });
        item.setOwner(owner);
        item.setScale(scale);
        item.initializeLayout();
        item.updateLayout(new Rect({ left: 0, top: 0, width: 100, height: 100 }));
        const spy = jest.spyOn(item, 'updateLayout');

        changed.next();
        seriesChanged.next();
        expect(spy.mock.calls.length).toBeGreaterThanOrEqual(2);

        item.destroy();
        const after = spy.mock.calls.length;
        changed.next();
        seriesChanged.next();
        expect(spy.mock.calls.length).toBe(after);
    });
});
