import * as d3 from 'd3';
import { Subject } from 'rxjs';
import { Point, Rect } from '../../util';
import { PlotItem } from '../plot.item';
import { IPlotItemOptions } from '../plot.interface';

/**
 * Input payload for a bar chart.
 */
export interface IBarChartData {
	series: IBarChartSeries[];
	dataChanged?: Subject<void>;
}

/**
 * One logical bar series in a grouped bar chart (e.g. "2025", "2026").
 */
export interface IBarChartSeries {
	id?: string;
	label?: string;
	cssClass?: string;
	points: Point[];
	dataChanged?: Subject<void>;
}

/**
 * Visual/behavior options for bar rendering.
 */
export interface IBarOptions extends IPlotItemOptions {
	barWidthRatio?: number;
	minBarWidth?: number;
	maxBarWidth?: number;
	seriesGapRatio?: number;
	xLabelFormatter?: (x: number) => string;
	yValueFormatter?: (y: number) => string;
}

/**
 * Internal per-bar data container used during layout and hover handling.
 */
interface BarSeriesDataItem {
	point: Point;
	seriesIndex: number;
	seriesLabel: string;
	seriesCssClass?: string;
}

export class BarPlotItem extends PlotItem {
	private tooltipElm?: d3.Selection<SVGGElement, unknown, null, undefined>;
	private tooltipRect?: d3.Selection<SVGRectElement, unknown, null, undefined>;
	private tooltipText?: d3.Selection<SVGTextElement, unknown, null, undefined>;

	private get options(): IBarOptions | undefined {
		return this._options as IBarOptions;
	}

	constructor(private _data: IBarChartData, options?: IBarOptions) {
		super(options);
		if (_data.dataChanged) {
			_data.dataChanged.subscribe(() => this.updateLayout(this._area));
		}
		(_data.series || []).forEach((series) => {
			series.dataChanged?.subscribe(() => this.updateLayout(this._area));
		});
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
		const series = this.getSeries();
		const points = series.flatMap((s) => s.points);
		if (!this._rootElm || points.length === 0 || series.length === 0) {
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
		const seriesGapRatio = this.options?.seriesGapRatio ?? 0.12;
		const fallbackWidth = plotArea.width / Math.max(points.length * 1.8, 1);
		const computedWidth = Number.isFinite(minDelta)
			? Math.abs(this.scale.xScale(minDelta) - this.scale.xScale(0)) * ratio
			: fallbackWidth;
		const groupWidth = Math.max(minBarWidth, Math.min(maxBarWidth, computedWidth));
		const slotWidth = groupWidth / series.length;
		const barWidth = Math.max(minBarWidth, slotWidth * (1 - seriesGapRatio));
		const slotPadding = (slotWidth - barWidth) / 2;

		const renderData: BarSeriesDataItem[] = [];
		series.forEach((serie, seriesIndex) => {
			serie.points.forEach((point) => {
				renderData.push({
					point,
					seriesIndex,
					seriesLabel: serie.label,
					seriesCssClass: serie.cssClass,
				});
			});
		});

		const y0 = this.scale.yScale(0);
		this._rootElm
			.selectAll('.bar-item')
			.data(renderData, (d: any) => `${d.seriesIndex}-${d.point.x}`)
			.join('rect')
			.attr('class', (d) => {
				const classes = ['bar-item', `series-${d.seriesIndex}`];
				if (d.seriesCssClass) {
					classes.push(d.seriesCssClass);
				}
				return classes.join(' ');
			})
			.attr('x', (d) => {
				const xCenter = this.scale.xScale(d.point.x);
				const groupStart = xCenter - groupWidth / 2;
				return groupStart + d.seriesIndex * slotWidth + slotPadding;
			})
			.attr('y', (d) => Math.min(y0, this.scale.yScale(d.point.y)))
			.attr('width', barWidth)
			.attr('height', (d) => Math.abs(this.scale.yScale(d.point.y) - y0))
			.on('mouseenter', (event: MouseEvent, d: BarSeriesDataItem) => this.showTooltip(event, d))
			.on('mousemove', (event: MouseEvent, d: BarSeriesDataItem) => this.showTooltip(event, d))
			.on('mouseleave', () => this.hideTooltip());
	}

	private getSeries(): Array<{ points: Point[]; label: string; cssClass?: string }> {
		return this._data.series.map((s, i) => ({
			points: s.points,
			label: s.label || s.id || `Series ${i + 1}`,
			cssClass: s.cssClass,
		}));
	}

	private formatLines(datum: BarSeriesDataItem): [string, string] {
		const xLabel = this.options?.xLabelFormatter
			? this.options.xLabelFormatter(datum.point.x)
			: datum.point.x.toString();
		const yLabel = this.options?.yValueFormatter
			? this.options.yValueFormatter(datum.point.y)
			: datum.point.y.toString();
		return [xLabel, `${datum.seriesLabel}: ${yLabel}`];
	}

	private showTooltip(event: MouseEvent, point: BarSeriesDataItem) {
		if (!this.tooltipElm || !this.tooltipRect || !this.tooltipText) {
			return;
		}
		this.tooltipElm.raise();
		const lines = this.formatLines(point);
		this.tooltipText
			.selectAll('tspan')
			.data(lines)
			.join('tspan')
			.attr('x', 0)
			.attr('dy', (_d, i) => (i === 0 ? '0.9em' : '1.2em'))
			.text((d) => d);
		this.tooltipText.attr('x', 0).attr('y', 0);
		const bbox = this.tooltipText.node()?.getBBox();
		const width = (bbox?.width || 0) + 12;
		const height = (bbox?.height || 0) + 8;
		this.tooltipText
			.attr('x', width / 2)
			.attr('y', 3);
		this.tooltipText
			.selectAll('tspan')
			.attr('x', width / 2);
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
