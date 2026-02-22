import * as d3 from 'd3';
import { Component, signal } from '@angular/core';
import { PlotBaseComponent, PlotItem, PlotV2 } from '../../../plot';
import { Rect } from '../../../plot/util';

class AreaFrame extends PlotItem {
	private frameElm?: d3.Selection<SVGRectElement, unknown, null, undefined>;

	public override initializeLayout(): void {
		super.initializeLayout();
		this._rootElm?.classed('area-frame', true);
		this.frameElm = this._rootElm?.append('rect') as any;
	}

	public override updateLayout(area: Rect): void {
		super.updateLayout(area);
		const r = this.getPlotArea().inflate(-2);
		this.frameElm
			?.attr('x', r.left)
			.attr('y', r.top)
			.attr('width', Math.max(0, r.width))
			.attr('height', Math.max(0, r.height));
	}
}

class AreaLabel extends PlotItem {
	private textElm?: d3.Selection<SVGTextElement, unknown, null, undefined>;

	constructor(private text: string, private rotate = 0) {
		super();
	}

	public override initializeLayout(): void {
		super.initializeLayout();
		this._rootElm?.classed('area-label', true);
		this.textElm = this._rootElm
			?.append('text')
			.text(this.text)
			.attr('text-anchor', 'middle')
			.attr('dominant-baseline', 'middle') as any;
	}

	public override updateLayout(area: Rect): void {
		super.updateLayout(area);
		const r = this.getPlotArea();
		const center = r.center;
		this.textElm
			?.attr('x', center.x)
			.attr('y', center.y)
			.attr('transform', this.rotate === 0 ? null : `rotate(${this.rotate}, ${center.x}, ${center.y})`);
	}
}

@Component({
	selector: 'plot-area-demo',
	standalone: true,
	imports: [
		PlotBaseComponent,
	],
	templateUrl: './plot-area.component.html',
	styleUrl: './plot-area.component.scss',
})
export class PlotAreaComponent {
	readonly plot = signal<PlotV2 | null>(null);

	constructor() {
		const plot = new PlotV2({
			cssClass: 'plot-area-v2',
			titleArea: {
				height: 20,
				plots: [
					new AreaFrame({ cssClasses: ['top-label'] }),
					new AreaLabel('top area'),
				],
			},
			leftArea: {
				width: 30,
				plots: [
					new AreaFrame({ cssClasses: ['left-label'] }),
					new AreaLabel('left area', -90),
				],
			},
			rightArea: {
				width: 40,
				plots: [
					new AreaFrame({ cssClasses: ['right-label'] }),
					new AreaLabel('right area', 90),
				],
			},
			footerArea: {
				height: 30,
				plots: [
					new AreaFrame({ cssClasses: ['bottom-label'] }),
					new AreaLabel('bottom area'),
				],
			},
			plots: [
				new AreaFrame({ cssClasses: ['plot-area'] }),
				new AreaLabel('plot area'),
			],
		});
		this.plot.set(plot);
	}
}
