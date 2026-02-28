import { describe, expect, it, jest } from '@jest/globals';

jest.mock('./elements', () => {
    const scale = jest.requireActual<typeof import('./elements/scale')>('./elements/scale');
    return { Scale: scale.Scale };
});

import * as d3 from 'd3';
import { PlotArea } from './plot.area';
import { PlotItem } from './plot.item';
import { PlotMouseHandler } from './plot.mousehandler';
import { Rect } from './util';
import { Scale } from './elements';

class SpyItem extends PlotItem {
    public initCount = 0;
    public updateRects: Rect[] = [];
    public destroyCount = 0;
    public override initializeLayout(): void {
        super.initializeLayout();
        this.initCount++;
    }
    public override updateLayout(area: Rect): void {
        super.updateLayout(area);
        this.updateRects.push(area);
    }
    public override destroy(): void {
        this.destroyCount++;
        super.destroy();
    }
}

class SpyMouseHandler extends PlotMouseHandler {
    public initCount = 0;
    public updateCount = 0;
    public destroyCount = 0;
    public override initializeLayout(owner: any): void {
        super.initializeLayout(owner);
        this.initCount++;
    }
    public override updateLayout(_area: Rect): void {
        this.updateCount++;
    }
    public override destroy(): void {
        this.destroyCount++;
        super.destroy();
    }
}

describe('PlotArea', () => {
    it('tooltip layer is always on top after initialization', () => {
        const root = d3.create('svg:svg');
        const area = new PlotArea(root);
        area.rect = new Rect({ left: 0, top: 0, width: 100, height: 40 });
        area.forceInitialize = true;
        const item1 = new SpyItem();
        const item2 = new SpyItem();
        area.setPlots([item1, item2]);

        const children = (root.node() as SVGSVGElement).children;
        const tooltipLayer = root.select('.tooltip-layer').node();
        const lastChild = children[children.length - 1];
        expect(tooltipLayer).toBe(lastChild);
    });

    it('tooltip layer remains on top after mouse handler initialization', () => {
        const root = d3.create('svg:svg');
        const area = new PlotArea(root);
        area.rect = new Rect({ left: 0, top: 0, width: 100, height: 40 });
        area.forceInitialize = true;
        const handler = new SpyMouseHandler();
        area.setMouseHandler(handler);
        area.plots = [new SpyItem()];
        area.initializeLayout();

        const children = (root.node() as SVGSVGElement).children;
        const tooltipLayer = root.select('.tooltip-layer').node();
        const lastChild = children[children.length - 1];
        expect(tooltipLayer).toBe(lastChild);
        expect(handler.initCount).toBe(1);
    });
    it('setPlots initializes and updates when rect is available', () => {
        const root = d3.create('svg:svg');
        const area = new PlotArea(root);
        area.rect = new Rect({ left: 0, top: 0, width: 100, height: 40 });
        const item = new SpyItem();
        area.setPlots([item]);
        expect(item.initCount).toBe(1);
        expect(item.updateRects.length).toBe(1);
    });

    it('setPlots does not initialize when rect is empty and forceInitialize is false', () => {
        const area = new PlotArea(d3.create('svg:svg'));
        const item = new SpyItem();
        area.setPlots([item]);
        expect(item.initCount).toBe(0);
        expect(item.updateRects.length).toBe(0);
    });

    it('initializeLayout honors forceInitialize', () => {
        const area = new PlotArea(d3.create('svg:svg'));
        const item = new SpyItem();
        area.plots = [item];
        area.initializeLayout();
        expect(item.initCount).toBe(0);
        area.forceInitialize = true;
        area.initializeLayout();
        expect(item.initCount).toBe(1);
    });

    it('setMouseHandler and setScale keep handler scale in sync', () => {
        const area = new PlotArea(d3.create('svg:svg'));
        const handler = new SpyMouseHandler();
        const scale = new Scale().setMargin({ left: 1, top: 2, right: 3, bottom: 4 });
        area.setMouseHandler(handler);
        area.setScale(scale);
        expect(handler.scale).toBe(scale);
    });

    it('destroy clears plots and destroys mouse handler', () => {
        const area = new PlotArea(d3.create('svg:svg'));
        area.rect = new Rect({ left: 0, top: 0, width: 100, height: 40 });
        const handler = new SpyMouseHandler();
        const item = new SpyItem();
        area.setMouseHandler(handler);
        area.setPlots([item]);
        area.destroy();
        expect(item.destroyCount).toBe(1);
        expect(handler.destroyCount).toBe(1);
        expect(area.plots.length).toBe(0);
    });
});
