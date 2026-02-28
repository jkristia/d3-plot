import { describe, expect, it, jest } from '@jest/globals';

jest.mock('../elements', () => {
    const scale = jest.requireActual<typeof import('../elements/scale')>('../elements/scale');
    return { Scale: scale.Scale };
});

import { Subject } from 'rxjs';
import { LineSeries } from './line';
import { Rect } from '../util';
import { Scale } from './scale';
import { MockPlotAreaOwner, MockTooltip, pointToClientEvent } from '../test/mocks';

describe('LineSeries', () => {
    it('renders path data and point markers', () => {
        const owner = new MockPlotAreaOwner();
        const scale = new Scale();
        scale.updateScales(new Rect({ left: 0, top: 0, width: 100, height: 100 }));
        const line = new LineSeries({ points: [{ x: 0, y: 0 }, { x: 10, y: 10 }] }, { showPointMarkers: 'always' });
        line.setOwner(owner);
        line.setScale(scale);
        line.initializeLayout();
        line.updateLayout(new Rect({ left: 0, top: 0, width: 100, height: 100 }));

        const path = line.plotElement!.select('path').attr('d');
        expect(path).toContain('M');
        expect(line.plotElement!.selectAll('.point-marker').nodes().length).toBe(2);
    });

    it('toggles on-hover point markers with PlotItem hover events', () => {
        const owner = new MockPlotAreaOwner();
        const scale = new Scale();
        scale.updateScales(new Rect({ left: 0, top: 0, width: 100, height: 100 }));
        const line = new LineSeries({ points: [{ x: 0, y: 0 }, { x: 10, y: 10 }] }, { showPointMarkers: 'onhover' });
        line.setOwner(owner);
        line.setScale(scale);
        line.initializeLayout();
        line.updateLayout(new Rect({ left: 0, top: 0, width: 100, height: 100 }));

        const root = line.plotElement!.node() as SVGGElement;
        const markerContainer = root.querySelector('.point-container') as SVGGElement;
        expect(markerContainer.classList.contains('hidden')).toBe(true);
        root.dispatchEvent(pointToClientEvent('mouseover', { x: 10, y: 10 }));
        expect(markerContainer.classList.contains('hidden')).toBe(false);
        root.dispatchEvent(pointToClientEvent('mouseout', { x: 10, y: 10 }));
        expect(markerContainer.classList.contains('hidden')).toBe(true);
    });

    it('shows nearest-point tooltip and hides on mouseleave', () => {
        const owner = new MockPlotAreaOwner();
        const scale = new Scale();
        scale.updateScales(new Rect({ left: 0, top: 0, width: 100, height: 100 }));
        const tooltip = new MockTooltip();
        const line = new LineSeries(
            { points: [{ x: 10, y: 10 }, { x: 50, y: 40 }, { x: 90, y: 90 }] },
            { tooltip }
        );
        line.setOwner(owner);
        line.setScale(scale);
        line.initializeLayout();
        line.updateLayout(new Rect({ left: 0, top: 0, width: 100, height: 100 }));

        const root = line.plotElement!.node() as SVGGElement;
        root.dispatchEvent(pointToClientEvent('mousemove', { x: 52, y: 30 }));
        expect(tooltip.showCalls.length).toBe(1);
        expect(tooltip.showCalls[0].data.point.x).toBe(50);
        root.dispatchEvent(pointToClientEvent('mouseleave', { x: 52, y: 30 }));
        expect(tooltip.hideCalls).toBe(1);
    });

    it('reacts to dataChanged updates and unsubscribes on destroy', () => {
        const changed = new Subject<void>();
        const owner = new MockPlotAreaOwner();
        const scale = new Scale();
        scale.updateScales(new Rect({ left: 0, top: 0, width: 100, height: 100 }));
        const line = new LineSeries({ points: [{ x: 0, y: 0 }], dataChanged: changed });
        line.setOwner(owner);
        line.setScale(scale);
        line.initializeLayout();
        line.updateLayout(new Rect({ left: 0, top: 0, width: 100, height: 100 }));
        const spy = jest.spyOn(line, 'updateLayout');
        changed.next();
        expect(spy).toHaveBeenCalled();
        line.destroy();
        const countAfterDestroy = spy.mock.calls.length;
        changed.next();
        expect(spy.mock.calls.length).toBe(countAfterDestroy);
    });
});
