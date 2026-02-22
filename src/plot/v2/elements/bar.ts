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
}

export class BarPlotItem extends PlotItem {
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
			.attr('height', (d) => Math.abs(this.scale.yScale(d.y) - y0));
	}
}
