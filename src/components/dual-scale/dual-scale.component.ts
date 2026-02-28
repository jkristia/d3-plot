import { Component, OnDestroy, signal } from '@angular/core';
import { AxisAndGrid, AxisLabelItem, BarPlotItem, BarTooltip, ILineData, LineSeries, LineTooltip, LinearScale, Plot, PlotBaseComponent, RightYAxis, TitleItem } from '../../plot';
import { BarChartStore } from '../bar-chart/bar-chart.store';

@Component({
	selector: 'dual-scale-demo',
	standalone: true,
	imports: [
		PlotBaseComponent,
	],
	templateUrl: './dual-scale.component.html',
	styleUrls: ['./dual-scale.component.scss'],
})
export class DualScaleComponent implements OnDestroy {
	public readonly plot = signal<Plot | null>(null);
	private readonly store = new BarChartStore();
	private readonly lineData: ILineData = {
		points: [
			{ x: 1, y: 18 },
			{ x: 2, y: 26 },
			{ x: 3, y: 34 },
			{ x: 4, y: 45},
			{ x: 5, y: 42},
			{ x: 6, y: 55},
			{ x: 7, y: 66 },
			{ x: 8, y: 74 },
			{ x: 9, y: 82 },
			{ x: 10, y: 89 },
			{ x: 11, y: 93 },
			{ x: 12, y: 90 },
		],
	};

	public constructor() {
		const axisScale = new LinearScale();
		axisScale.margin = { top: 10, left: 42, right: 42, bottom: 30 };
		axisScale.xDomain(() => ({ min: 0.5, max: 12.5 }));
		axisScale.yDomain(() => ({ min: 0, max: 95 }));

		const xTickFormat = (value: number) => this.store.monthFromValue(value);
		const yTickFormat = (value: number) => `${Math.round(value).toString()}k`;
		const rightAxisTicks = Array.from({ length: 11 }, (_, index) => index * 10);
		const barTooltip = new BarTooltip();
		const lineTooltip = new LineTooltip();

		const plot = new Plot({
			cssClass: 'dual-scale-demo',
			titleArea: {
				height: 64,
				plots: [
					new TitleItem('Dual Scale'),
				],
			},
			leftArea: {
				width: 58,
				plots: [new AxisLabelItem('Sales (thousands)', -90)],
			},
			rightArea: {
				width: 58,
				plots: [new AxisLabelItem('Scale 0-100', 90)],
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
					xTickFormat: xTickFormat,
					yTickFormat: yTickFormat,
					xLabelRotateDeg: -20,
					showXGrid: false,
				}),
				new RightYAxis({
					ticks: 10,
					tickValues: rightAxisTicks,
					domain: { min: 0, max: 100 },
					tickFormat: value => Math.round(value).toString(),
				}),
				new BarPlotItem(
					{
						series: [
							{ id: '2025', label: '2025', cssClass: 'series-2025', points: this.store.monthlySales25 },
						],
					},
					{
						cssClasses: ['monthly-sales'],
						barWidthRatio: 0.82,
						seriesGapRatio: 0.05,
						xTickFormatter: xTickFormat,
						yTickFormatter: yTickFormat,
						tooltip: barTooltip, // tooltip does not work for dynamic updated data, todo at later point
					}
				),
				new LineSeries(this.lineData, {
					id: 'trend',
					cssClasses: ['dual-scale-line'],
					showPointMarkers: 'always',
					xTickFormatter: xTickFormat,
					yTooltipFormatter: value => Math.round(value).toString(),
					tooltip: lineTooltip,
				}),
			]
		});
		plot.center.setScale(axisScale);
		this.plot.set(plot);
	}

	public ngOnDestroy(): void {
		this.plot()?.destroy();
		this.plot.set(null);
	}
}