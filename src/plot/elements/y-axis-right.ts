import * as d3 from 'd3';
import { PlotItem } from '../plot.item';
import { Rect } from '../util';
import { IPlotItemOptions } from '../plot.interface';

export interface IRightYAxisOptions extends IPlotItemOptions {
	ticks?: number;
	tickValues?: number[];
	tickFormat?: (value: number) => string;
	domain?: { min: number; max: number };
}

export class RightYAxis extends PlotItem {
	private _axisElm?: d3.Selection<SVGGElement, unknown, null, undefined>;
	private _axisRight?: d3.Axis<number | { valueOf(): number }>;
	private _axisScale = d3.scaleLinear();

	private get options(): IRightYAxisOptions | undefined {
		return this._options as IRightYAxisOptions;
	}

	public constructor(options?: IRightYAxisOptions) {
		super(options);
	}

	public override initializeLayout(): void {
		super.initializeLayout();
		this._axisElm = this._rootElm?.append('g')
			.classed('axis-container y-axis y-axis-right', true);
		this._axisRight = d3.axisRight(this._axisScale);
	}

	public override updateLayout(area: Rect): void {
		super.updateLayout(area);
		const axisDomain = this.options?.domain;
		const scaleDomain = this.scale.yScale.domain();
		const min = axisDomain?.min ?? Number(scaleDomain[0]);
		const max = axisDomain?.max ?? Number(scaleDomain[1]);

		this._axisScale
			.domain([min, max])
			.range([this._area.height, this._area.top]);

		if (!this._axisRight) {
			return;
		}

		const ticks = this.options?.ticks ?? 5;
		this._axisRight.ticks(ticks);
		if (this.options?.tickValues) {
			this._axisRight.tickValues(this.options.tickValues);
		}
		if (this.options?.tickFormat) {
			this._axisRight.tickFormat(d => this.options!.tickFormat!(Number(d)) as any);
		}

		this._axisElm
			?.call(this._axisRight)
			.attr('transform', `translate(${this._area.right + 0.5}, ${-0.5})`);
	}
}