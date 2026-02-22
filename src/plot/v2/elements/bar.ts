import * as d3 from 'd3';
import { Subject } from 'rxjs';
import { Point, Rect } from '../../util';
import { PlotItem } from '../plot.item';
import { IPlotItemOptions } from '../plot.interface';

export interface IBarData {
	points: Point[];
	dataChanged?: Subject<void>;
}

export interface IBarOptions extends IPlotItemOptions {
	barWidthRatio?: number;
	minBarWidth?: number;
	maxBarWidth?: number;
	xLabelFormatter?: (x: number) => string;
	yValueFormatter?: (y: number) => string;
}

export class BarPlotItem extends PlotItem {
	private tooltipElm?: d3.Selection<SVGGElement, unknown, null, undefined>;
	private tooltipRect?: d3.Selection<SVGRectElement, unknown, null, undefined>;
	private tooltipText?: d3.Selection<SVGTextElement, unknown, null, undefined>;

	private get options(): IBarOptions | undefined {
		return this._options as IBarOptions;
	}

	constructor(private _data: IBarData, options?: IBarOptions) {
		super(options);
		if (_data.dataChanged) {
			_data.dataChanged.subscribe(() => this.updateLayout(this._area));
		}
	}

	public override initializeLayout(): void {
		super.initializeLayout();
		this._rootElm?.classed('bar-plot-elm', true);
		this.tooltipElm = this._rootElm?.append('g')
			.classed('bar-tooltip hidden', true)
			.style('pointer-events', 'none') as any;
		this.tooltipRect = this.tooltipElm?.append('rect') as any;
		this.tooltipText = this.tooltipElm
			?.append('text')
			.attr('text-anchor', 'middle')
			.attr('dominant-baseline', 'middle') as any;
	}

	public override updateLayout(area: Rect): void {
		super.updateLayout(area);
		const plotArea = this.getPlotArea();
		const points = this._data.points;
		if (!this._rootElm || points.length === 0) {
			return;
		}

		const sorted = [...points].sort((a, b) => a.x - b.x);
		let minDelta = Number.POSITIVE_INFINITY;
		for (let i = 1; i < sorted.length; i++) {
			const delta = sorted[i].x - sorted[i - 1].x;
			if (delta > 0) {
				minDelta = Math.min(minDelta, delta);
			}
		}

		const ratio = this.options?.barWidthRatio ?? 0.7;
		const minBarWidth = this.options?.minBarWidth ?? 6;
		const maxBarWidth = this.options?.maxBarWidth ?? 120;
		const fallbackWidth = plotArea.width / Math.max(points.length * 1.8, 1);
		const computedWidth = Number.isFinite(minDelta)
			? Math.abs(this.scale.xScale(minDelta) - this.scale.xScale(0)) * ratio
			: fallbackWidth;
		const barWidth = Math.max(minBarWidth, Math.min(maxBarWidth, computedWidth));

		const y0 = this.scale.yScale(0);
		this._rootElm
			.selectAll('.bar-item')
			.data(points)
			.join('rect')
			.classed('bar-item', true)
			.attr('x', (d) => this.scale.xScale(d.x) - barWidth / 2)
			.attr('y', (d) => Math.min(y0, this.scale.yScale(d.y)))
			.attr('width', barWidth)
			.attr('height', (d) => Math.abs(this.scale.yScale(d.y) - y0))
			.on('mouseenter', (event: MouseEvent, d: Point) => this.showTooltip(event, d))
			.on('mousemove', (event: MouseEvent, d: Point) => this.showTooltip(event, d))
			.on('mouseleave', () => this.hideTooltip());
	}

	private formatLabel(point: Point): string {
		const xLabel = this.options?.xLabelFormatter
			? this.options.xLabelFormatter(point.x)
			: point.x.toString();
		const yLabel = this.options?.yValueFormatter
			? this.options.yValueFormatter(point.y)
			: point.y.toString();
		return `${xLabel}, ${yLabel}`;
	}

	private showTooltip(event: MouseEvent, point: Point) {
		if (!this.tooltipElm || !this.tooltipRect || !this.tooltipText) {
			return;
		}
		this.tooltipElm.raise();
		const label = this.formatLabel(point);
		this.tooltipText.text(label);
		const bbox = this.tooltipText.node()?.getBBox();
		const width = (bbox?.width || 0) + 12;
		const height = (bbox?.height || 0) + 8;
		this.tooltipText
			.attr('x', width / 2)
			.attr('y', height / 2 + 0.5);
		this.tooltipRect
			.attr('width', width)
			.attr('height', height)
			.attr('rx', 4)
			.attr('ry', 4);

		const mouse = this.currentMousePosition(event);
		const bounds = this._area;
		const gap = 10;
		let tooltipX = mouse.x - width / 2;
		let tooltipY = mouse.y - height - gap;

		tooltipX = Math.max(bounds.left + 2, Math.min(tooltipX, bounds.right - width - 2));
		if (tooltipY < bounds.top + 2) {
			tooltipY = mouse.y + gap;
		}

		this.tooltipElm
			.classed('hidden', false)
			.attr('transform', `translate(${tooltipX}, ${tooltipY})`);
	}

	private hideTooltip() {
		this.tooltipElm?.classed('hidden', true);
	}
}
