import { Subject, Subscription } from 'rxjs';
import { Point, Rect } from '../util';
import { PlotItem } from '../plot.item';
import { IPlotItemOptions } from '../plot.interface';
import { ITooltip } from './tooltip';
import { BarTooltipData } from './bar-tooltip';

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
	xTooltipFormatter?: (x: number) => string;
	xTickFormatter?: (x: number) => string;
	yTooltipFormatter?: (y: number) => string;
	yTickFormatter?: (y: number) => string;
	tooltip?: ITooltip<BarTooltipData>;
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
	private tooltip?: ITooltip<BarTooltipData>;
	private subscriptions: Subscription[] = [];

	private get options(): IBarOptions | undefined {
		return this._options as IBarOptions;
	}

	public constructor(private _data: IBarChartData, options?: IBarOptions) {
		super(options);
		this.tooltip = options?.tooltip;
		if (_data.dataChanged) {
			this.subscriptions.push(
				_data.dataChanged.subscribe(() => this.updateLayout(this._area))
			);
		}
		(_data.series || []).forEach((series) => {
			if (series.dataChanged) {
				this.subscriptions.push(
					series.dataChanged.subscribe(() => this.updateLayout(this._area))
				);
			}
		});
	}

	protected override onDestroy(): void {
		// Unsubscribe from all data change subscriptions to prevent memory leaks
		this.subscriptions.forEach(sub => sub.unsubscribe());
		this.subscriptions = [];
		// Remove event listeners from bar elements
		this._rootElm?.selectAll('.bar-item')
			.on('mouseenter', null)
			.on('mousemove', null)
			.on('mouseleave', null);
		// Clean up tooltip
		this.tooltip?.destroy();
	}

	public override initializeLayout(): void {
		super.initializeLayout();
		this._rootElm?.classed('bar-plot-elm', true);
		if (this.tooltip && this._rootElm) {
			this.tooltip.initialize(this._rootElm);
		}
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

	private showTooltip(event: MouseEvent, datum: BarSeriesDataItem) {
		if (!this.tooltip) {
			return;
		}
		const tooltipData: BarTooltipData = {
			point: datum.point,
			seriesLabel: datum.seriesLabel,
			xTooltipFormatter: this.options?.xTooltipFormatter,
			xTickFormatter: this.options?.xTickFormatter,
			yTooltipFormatter: this.options?.yTooltipFormatter,
			yTickFormatter: this.options?.yTickFormatter,
		};
		this.tooltip.show(event, tooltipData, this._area);
	}

	private hideTooltip() {
		this.tooltip?.hide();
	}
}
