import * as d3 from 'd3';
import { D3Selection, Rect } from '../util';
import { PlotV2 } from './plot';
import { PlotItem } from './plot.item';

class UnitItem extends PlotItem {
    get r(): Rect {
        return this.getPlotArea();
    }

    initcount = 0;
    updatecount = 0;
    public override initializeLayout() {
        super.initializeLayout();
        this.initcount++;
    }
    public override updateLayout(area: Rect) {
        super.updateLayout(area);
        this.updatecount++;
    }
}

describe('plot areas', () => {
    let root: HTMLElement;

    beforeEach(() => {
        root = d3.create('div').node()!
    })
    test('create areas', () => {
        let plot = new PlotV2({
            titleArea: { height: 20, plots: [] },
            leftArea: { width: 100, plots: [] },
            rightArea: { width: 50, plots: [] },
            footerArea: { height: 80, plots: [] },
        })
        plot.attach(root);
        plot.size({ width: 600, height: 400 })
        expect(plot.top.rect.toString()).toEqual('[top: 0, left: 0, width: 600, height: 20]')
        expect(plot.left.rect.toString()).toEqual('[top: 20, left: 0, width: 100, height: 300]')
        expect(plot.center.rect.toString()).toEqual('[top: 20, left: 100, width: 450, height: 300]')
        expect(plot.right.rect.toString()).toEqual('[top: 20, left: 550, width: 50, height: 300]')
        expect(plot.bottom.rect.toString()).toEqual('[top: 320, left: 0, width: 600, height: 80]')

        plot = new PlotV2({
            titleArea: { height: 20, plots: [] },
            // leftArea: { width: 100, plots: [] },
            // rightArea: { width: 50, plots: [] },
            // footerArea: { height: 80, plots: [] },
        })
        plot.attach(root);
        plot.size({ width: 600, height: 400 })
        expect(plot.top.rect.toString()).toEqual('[top: 0, left: 0, width: 600, height: 20]')
        expect(plot.left.rect.toString()).toEqual('[empty]')
        expect(plot.center.rect.toString()).toEqual('[top: 20, left: 0, width: 600, height: 380]')
        expect(plot.right.rect.toString()).toEqual('[empty]')
        expect(plot.bottom.rect.toString()).toEqual('[empty]')

        plot = new PlotV2({
            titleArea: { height: 20, plots: [] },
            leftArea: { width: 100, plots: [] },
            // rightArea: { width: 50, plots: [] },
            // footerArea: { height: 80, plots: [] },
        })
        plot.attach(root);
        plot.size({ width: 600, height: 400 })
        expect(plot.top.rect.toString()).toEqual('[top: 0, left: 0, width: 600, height: 20]')
        expect(plot.left.rect.toString()).toEqual('[top: 20, left: 0, width: 100, height: 380]')
        expect(plot.center.rect.toString()).toEqual('[top: 20, left: 100, width: 500, height: 380]')
        expect(plot.right.rect.toString()).toEqual('[empty]')
        expect(plot.bottom.rect.toString()).toEqual('[empty]')

        plot = new PlotV2({
            titleArea: { height: 20, plots: [] },
            leftArea: { width: 100, plots: [] },
            rightArea: { width: 50, plots: [] },
            // footerArea: { height: 80, plots: [] },
        })
        plot.attach(root);
        plot.size({ width: 600, height: 400 })
        expect(plot.top.rect.toString()).toEqual('[top: 0, left: 0, width: 600, height: 20]')
        expect(plot.left.rect.toString()).toEqual('[top: 20, left: 0, width: 100, height: 380]')
        expect(plot.center.rect.toString()).toEqual('[top: 20, left: 100, width: 450, height: 380]')
        expect(plot.right.rect.toString()).toEqual('[top: 20, left: 550, width: 50, height: 380]')
        expect(plot.bottom.rect.toString()).toEqual('[empty]')

    })
    test('item initialize', () => {
        let plot = new PlotV2({
            titleArea: { height: 20, plots: [new UnitItem()] },
            leftArea: { width: 100, plots: [new UnitItem()] },
            rightArea: { width: 50, plots: [new UnitItem()] },
            footerArea: { height: 80, plots: [new UnitItem()] },
            plots: [new UnitItem()]
        })
        plot.attach(root);
        plot.size({ width: 600, height: 400 })
        expect((plot.top.plots[0] as UnitItem).initcount).toBe(1)
        expect((plot.top.plots[0] as UnitItem).updatecount).toBe(2)
        expect((plot.left.plots[0] as UnitItem).initcount).toBe(1)
        expect((plot.center.plots[0] as UnitItem).initcount).toBe(1)
        expect((plot.right.plots[0] as UnitItem).initcount).toBe(1)
        expect((plot.bottom.plots[0] as UnitItem).initcount).toBe(1)

        plot = new PlotV2({
            footerArea: { height: 80, plots: [new UnitItem()] },
            plots: [new UnitItem()]
        })
        plot.attach(root);
        plot.size({ width: 600, height: 400 })
        expect(plot.top.plots).toEqual([])
        expect(plot.left.plots).toEqual([])
        expect((plot.center.plots[0] as UnitItem).initcount).toBe(1)
        expect(plot.right.plots).toEqual([])
        expect((plot.bottom.plots[0] as UnitItem).initcount).toBe(1)
    })
})