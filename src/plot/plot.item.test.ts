import { describe, expect, it, jest } from '@jest/globals';

jest.mock('./elements', () => {
    const scale = jest.requireActual<typeof import('./elements/scale')>('./elements/scale');
    return { Scale: scale.Scale };
});

import { PlotItem } from './plot.item';
import { Scale } from './elements';
import { Rect } from './util';
import { MockPlotAreaOwner, pointToClientEvent } from './test/mocks';

class UnitPlotItem extends PlotItem {
    public currentArea(): Rect {
        return this.getPlotArea();
    }
    public xValue(v: number): number {
        return this.x(v);
    }
    public yValue(v: number): number {
        return this.y(v);
    }
}

describe('PlotItem', () => {
    it('initializeLayout applies id/classes and hover handlers', () => {
        const owner = new MockPlotAreaOwner();
        const item = new UnitPlotItem({ id: 'item-1', cssClasses: ['a', 'b'] });
        item.setOwner(owner);
        item.initializeLayout();

        const elm = item.plotElement!.node() as SVGGElement;
        expect(elm.id).toBe('item-1');
        expect(elm.classList.contains('plot-elm')).toBe(true);
        expect(elm.classList.contains('a')).toBe(true);
        expect(elm.classList.contains('b')).toBe(true);

        elm.dispatchEvent(pointToClientEvent('mouseover', { x: 5, y: 5 }));
        expect(owner.hoverItem).toBe(item);
        expect(elm.classList.contains('mouse-hover')).toBe(true);

        elm.dispatchEvent(pointToClientEvent('mouseout', { x: 5, y: 5 }));
        expect(owner.hoverItem).toBeNull();
        expect(owner.clearHoverItemCalls).toBe(1);
        expect(elm.classList.contains('mouse-hover')).toBe(false);
    });

    it('updateLayout applies margin from explicit scale and area override function', () => {
        const item = new UnitPlotItem();
        const scale = new Scale().setMargin({ left: 2, top: 3, right: 4, bottom: 5 });
        item.setScale(scale);
        item.updateLayout(new Rect({ left: 0, top: 0, width: 30, height: 20 }));

        expect(item.currentArea().toString()).toBe('[top: 3, left: 2, width: 24, height: 12]');
        item.area(r => r.inflate(-1));
        expect(item.currentArea().toString()).toBe('[top: 4, left: 3, width: 22, height: 10]');
    });

    it('x and y use active scale mapping', () => {
        const item = new UnitPlotItem();
        const scale = new Scale();
        scale.updateScales(new Rect({ left: 0, top: 0, width: 100, height: 100 }));
        item.setScale(scale);
        expect(item.xValue(25)).toBe(25);
        expect(item.yValue(25)).toBe(75);
    });

    it('destroy removes root element and listeners', () => {
        const item = new UnitPlotItem();
        item.initializeLayout();
        const root = item.plotElement;
        expect(root).not.toBeNull();
        item.destroy();
        expect(item.plotElement).toBeNull();
    });
});
