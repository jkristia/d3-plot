import { Component, signal } from '@angular/core';
import { AxisAndGrid, AxisLabelItem, BarLegendItem, BarPlotItem, LinearScale, PlotBaseComponent, Plot, TitleItem } from '../../plot';
import { BarChartStore } from './bar-chart.store';

@Component({
	selector: 'bar-chart-demo',
	standalone: true,
	imports: [
		PlotBaseComponent,
	],
	templateUrl: './bar-chart.component.html',
	styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent {
	public readonly plot = signal<Plot | null>(null);
	private readonly store = new BarChartStore();

	public constructor() {
		const axisScale = new LinearScale();
		axisScale.margin = { top: 10, left: 42, right: 5, bottom: 30 };
		axisScale.xDomain(() => ({ min: 0.5, max: 12.5 }));
		axisScale.yDomain(() => ({ min: 0, max: 95 }));

		const plot = new Plot({
			cssClass: 'bar-chart-demo',
			titleArea: {
				height: 64,
				plots: [
					new TitleItem('Monthly Sales'),
					new BarLegendItem('Sales 2025', 'legend-2025', 0, 2),
					new BarLegendItem('Sales 2026', 'legend-2026', 1, 2),
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
					xTickFormat: (value) => this.store.monthFromValue(value),
					yTickFormat: (value) => Math.round(value).toString(),
					xLabelRotateDeg: -20,
				}),
				new BarPlotItem(
					{
						series: [
							{ id: '2025', label: '2025', cssClass: 'series-2025', points: this.store.monthlySales25 },
							{ id: '2026', label: '2026', cssClass: 'series-2026', points: this.store.monthlySales26 },
						],
					},
					{
						cssClasses: ['monthly-sales'],
						barWidthRatio: 0.82,
						seriesGapRatio: 0.05,
						xLabelFormatter: (value) => this.store.monthFromValue(value),
						yValueFormatter: (value) => `${Math.round(value)}k`,
					},
				),
			],
		});
		plot.center.setScale(axisScale);
		this.plot.set(plot);
	}
}
