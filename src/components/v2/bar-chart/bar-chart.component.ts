import * as d3 from 'd3';
import { Component, signal } from '@angular/core';
import { AxisAndGrid, BarPlotItem, LinearScale, PlotItem, PlotBaseComponent, PlotV2, TitleItem } from '../../../plot';
import { Point, Rect } from '../../../plot/util';

class AxisLabelItem extends PlotItem {
	private textElm?: d3.Selection<SVGTextElement, unknown, null, undefined>;

	constructor(private text: string, private rotate = 0) {
		super();
	}

	public override initializeLayout(): void {
		super.initializeLayout();
		this._rootElm?.classed('axis-label-item', true);
		this.textElm = this._rootElm
			?.append('text')
			.text(this.text)
			.attr('text-anchor', 'middle')
			.attr('dominant-baseline', 'middle') as any;
	}

	public override updateLayout(area: Rect): void {
		super.updateLayout(area);
		const center = area.center;
		this.textElm
			?.attr('x', center.x)
			.attr('y', center.y)
			.attr('transform', this.rotate === 0 ? null : `rotate(${this.rotate}, ${center.x}, ${center.y})`);
	}
}

class LegendItem extends PlotItem {
	private marker?: d3.Selection<SVGRectElement, unknown, null, undefined>;
	private label?: d3.Selection<SVGTextElement, unknown, null, undefined>;

	constructor(
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

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

@Component({
	selector: 'bar-chart-demo',
	standalone: true,
	imports: [
		PlotBaseComponent,
	],
	templateUrl: './bar-chart.component.html',
	styleUrl: './bar-chart.component.scss',
})
export class BarChartComponent {
	readonly plot = signal<PlotV2 | null>(null);

	constructor() {
		const monthlySales_25: Point[] = [
			{ x: 1, y: 65 },
			{ x: 2, y: 60 },
			{ x: 3, y: 80 },
			{ x: 4, y: 81 },
			{ x: 5, y: 56 },
			{ x: 6, y: 55 },
			{ x: 7, y: 72 },
			{ x: 8, y: 89 },
			{ x: 9, y: 86 },
			{ x: 10, y: 78 },
			{ x: 11, y: 83 },
			{ x: 12, y: 79 },
		];
		const monthlySales_26: Point[] = [
			{ x: 1, y: 68 },
			{ x: 2, y: 64 },
			{ x: 3, y: 76 },
			{ x: 4, y: 85 },
			{ x: 5, y: 61 },
			{ x: 6, y: 53 },
			{ x: 7, y: 70 },
			{ x: 8, y: 92 },
			{ x: 9, y: 82 },
			{ x: 10, y: 82 },
			{ x: 11, y: 88 },
			{ x: 12, y: 74 },
		];

		const axisScale = new LinearScale();
		axisScale.margin = { top: 10, left: 42, right: 5, bottom: 30 };
		axisScale.xDomain(() => ({ min: 0.5, max: 12.5 }));
		axisScale.yDomain(() => ({ min: 0, max: 95 }));

		const monthFromValue = (value: number) => {
			const index = Math.round(value) - 1;
			return months[index] || '';
		};

		const plot = new PlotV2({
			cssClass: 'bar-chart-demo',
			titleArea: {
				height: 64,
				plots: [
					new TitleItem('Monthly Sales'),
					new LegendItem('Sales 2025', 'legend-2025', 0, 2),
					new LegendItem('Sales 2026', 'legend-2026', 1, 2),
				],
			},
			leftArea: {
				width: 58,
				plots: [new AxisLabelItem('Sales (thousands)', -90)],
			},
			footerArea: {
				height: 54,
				plots: [new AxisLabelItem('Month')],
			},
			scales: [axisScale],
			plots: [
				new AxisAndGrid({
					xTicks: 12,
					yTicks: 10,
					xTickFormat: monthFromValue,
					yTickFormat: (value) => Math.round(value).toString(),
					xLabelRotateDeg: -20,
				}),
				new BarPlotItem(
					{
						series: [
							{ id: '2025', label: '2025', cssClass: 'series-2025', points: monthlySales_25 },
							{ id: '2026', label: '2026', cssClass: 'series-2026', points: monthlySales_26 },
						],
					},
					{
						cssClasses: ['monthly-sales'],
						barWidthRatio: 0.82,
						seriesGapRatio: 0.05,
						xLabelFormatter: monthFromValue,
						yValueFormatter: (value) => `${Math.round(value)}k`,
					},
				),
			],
		});
		plot.center.setScale(axisScale);
		this.plot.set(plot);
	}
}
