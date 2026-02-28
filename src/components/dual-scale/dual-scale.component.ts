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
			{ x: 1, y: 95 },
			{ x: 2, y: 130 },
			{ x: 3, y: 170 },
			{ x: 4, y: 210 },
			{ x: 5, y: 195 },
			{ x: 6, y: 240 },
			{ x: 7, y: 248},
			{ x: 8, y: 320 },
			{ x: 9, y: 260 },
			{ x: 10, y: 405 },
			{ x: 11, y: 450 },
			{ x: 12, y: 430 },
		],
	};

	public constructor() {
		const axisScale = new LinearScale();
		axisScale.margin = { top: 10, left: 42, right: 42, bottom: 30 };
		axisScale.xDomain(() => ({ min: 0.5, max: 12.5 }));
		axisScale.yDomain(() => ({ min: 0, max: 95 }));

		const rightScale = new LinearScale();
		rightScale.margin = { top: 10, left: 42, right: 42, bottom: 30 };
		rightScale.xDomain(() => ({ min: 0.5, max: 12.5 }));
		rightScale.yDomain(() => ({ min: 0, max: 500 }));

		const xTickFormat = (value: number) => this.store.monthFromValue(value);
		const yTickFormat = (value: number) => `${Math.round(value).toString()}k`;
		const rightAxisTicks = Array.from({ length: 21 }, (_, index) => index * 25);
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
				plots: [new AxisLabelItem('Scale 0-500', 90)],
			},
			footerArea: {
				height: 54,
				plots: [new AxisLabelItem('Month')],
			},
			scales: [axisScale, rightScale],
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
					ticks: 20,
					tickValues: rightAxisTicks,
					domain: { min: 0, max: 500 },
					tickFormat: value => Math.round(value).toString(),
				}).setScale(rightScale),
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
					curveType: 'smooth',
					xTickFormatter: xTickFormat,
					yTooltipFormatter: value => Math.round(value).toString(),
					tooltip: lineTooltip,
				}).setScale(rightScale),
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