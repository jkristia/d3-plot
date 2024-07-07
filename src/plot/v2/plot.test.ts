import * as d3 from 'd3';
import { D3Selection } from '../util';
import { PlotV2 } from './plot';

describe('plot areas', () => {
    let root: HTMLElement;
    
    beforeEach( () => {
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
        plot.size({ width: 600, height: 400})
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
        plot.size({ width: 600, height: 400})
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
        plot.size({ width: 600, height: 400})
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
        plot.size({ width: 600, height: 400})
        expect(plot.top.rect.toString()).toEqual('[top: 0, left: 0, width: 600, height: 20]')
        expect(plot.left.rect.toString()).toEqual('[top: 20, left: 0, width: 100, height: 380]')
        expect(plot.center.rect.toString()).toEqual('[top: 20, left: 100, width: 450, height: 380]')
        expect(plot.right.rect.toString()).toEqual('[top: 20, left: 550, width: 50, height: 380]')
        expect(plot.bottom.rect.toString()).toEqual('[empty]')

    })
})