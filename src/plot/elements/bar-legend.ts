import * as d3 from 'd3';
import { PlotItem } from '../plot.item';
import { Rect } from '../util';

export class BarLegendItem extends PlotItem {
	private marker?: d3.Selection<SVGRectElement, unknown, null, undefined>;
	private label?: d3.Selection<SVGTextElement, unknown, null, undefined>;

	public constructor(
		private legendText: string,
		private markerCssClass: string,
		private slot: number,
		private total: number,
	) {
		super();
	}

	public override initializeLayout(): void {
		super.initializeLayout();
		this._rootElm?.classed('bar-legend-item', true).classed(this.markerCssClass, true);
		this.marker = this._rootElm?.append('rect') as any;
		this.label = this._rootElm
			?.append('text')
			.text(this.legendText)
			.attr('dominant-baseline', 'middle') as any;
	}

	public override updateLayout(area: Rect): void {
		super.updateLayout(area);
		const markerWidth = 34;
		const markerHeight = 12;
		const itemWidth = 140;
		const startX = area.center.x - (this.total * itemWidth) / 2;
		const markerX = startX + this.slot * itemWidth;
		const markerY = area.center.y + 10;
		this.marker
			?.attr('x', markerX)
			.attr('y', markerY)
			.attr('width', markerWidth)
			.attr('height', markerHeight);
		this.label
			?.attr('x', markerX + markerWidth + 6)
			.attr('y', markerY + markerHeight / 2 + 0.5)
			.attr('font-weight', 600);
	}
}