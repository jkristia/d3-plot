import * as d3 from 'd3';
import { D3Selection, Rect } from '../util';
import { PlotV2 } from './plot';
import { PlotItem } from './plot.item';
import { LineSeries, Scale, TitleItem } from './elements';

class UnitItem extends PlotItem {
    get r(): Rect {
        return this.getPlotArea();
    }

    initcount = 0;
    updatecount = 0;
    public override initializeLayout() {
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
    test('item initialize - size', () => {
        const scale = new Scale().setMargin({ top: 5, left: 5, right: 5, bottom: 5 }) 
        let plot = new PlotV2({
            // check the item is using the adjusted area rect, set by the callbacl
            leftArea: { width: 300, plots: [new UnitItem().area(d => d.inflate(-1))] },
            // this item will use the rect passed in update layout
            scales: [scale],
            plots: [
                new UnitItem(), // item uses owner scale
                new UnitItem().setScale(new Scale().setMargin({ left: 2, top: 2, right: 2, bottom: 2})), // item uses own scale
            ]
        })
        plot.left.setScale(scale)
        plot.center.setScale(scale)
        plot.attach(root);
        plot.size({ width: 600, height: 400 })
        expect((plot.left.plots[0] as UnitItem).r.toString()).toBe('[top: 6, left: 6, width: 288, height: 388]')
        expect((plot.center.plots[0] as UnitItem).r.toString()).toBe('[top: 5, left: 5, width: 290, height: 390]')
        expect((plot.center.plots[1] as UnitItem).r.toString()).toBe('[top: 2, left: 2, width: 296, height: 396]')
    })
})

describe('plot options', () => {
    let root: HTMLElement;
    beforeEach(() => {
        root = d3.create('div').node()!
    })

    test('root level css class', () => {
        let p = new PlotV2({}).attach(root);
        let svg = root.firstChild as SVGSVGElement;
        expect(svg.classList.toString()).toBe('d3-plot')
        p = new PlotV2({ cssClass: 'custom-css' }).attach(root);
        svg = root.firstChild as SVGSVGElement;
        expect(svg.classList.toString()).toBe('d3-plot custom-css')
    })
    test('add title elm', () => {
        let p = new PlotV2({
            title: 'use default title',
            titleArea: { height: 20, plots: [new TitleItem('title text')] },
        }).attach(root);
        let elm = root.querySelector('.title-elm text');
        expect(elm?.innerHTML).toBe('title text')
        expect(p.top.rect.toString()).toEqual('[top: 0, left: 0, width: 0, height: 20]')

        // now use default value
        p = new PlotV2({
            title: 'use default title',
        }).attach(root);
        elm = root.querySelector('.title-elm text');
        expect(elm?.innerHTML).toBe('use default title')
        expect(p.top.rect.toString()).toEqual('[top: 0, left: 0, width: 0, height: 40]')
    })
    test('scale update size', () => {
        let scale = new Scale();
        scale.margin = { top: 5, left: 5, right: 5, bottom: 5 };
        expect(scale.area.toString()).toBe('[empty]')
        let p = new PlotV2({ scales: [ scale ], })
        .attach(root)
        .size({ width: 100, height: 100 });
        expect(scale.area.toString()).toBe('[top: 5, left: 5, width: 90, height: 90]')
    })
    test('single line elm', () => {
        let scale = new Scale();
        let p = new PlotV2({
            scales: [ scale ],
            plots: [new LineSeries({ points: [{ x: 0, y: 0 }, { x: 10, y: 10 }] })]
        })
        .attach(root)
        .size({ width: 100, height: 100 });
        let elm = root.querySelector('.line-series-elm');
        expect(elm?.innerHTML).toBe('<path fill="none" d="M0,0L10,10"></path>');
    })
})