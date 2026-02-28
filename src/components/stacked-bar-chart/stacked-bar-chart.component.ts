import { Component, signal, OnDestroy } from '@angular/core';
import { AxisAndGrid, AxisLabelItem, BarLegendItem, BarPlotItem, LinearScale, PlotBaseComponent, Plot, TitleItem, StackedBarPlotItem, StackedBarTooltip, BarTooltip } from '../../plot';
import { StackedBarChartStore } from './stacked-bar-chart.store';

@Component({
    selector: 'stacked-bar-chart-demo',
    standalone: true,
    imports: [
        PlotBaseComponent,
    ],
    templateUrl: './stacked-bar-chart.component.html',
    styleUrls: ['./stacked-bar-chart.component.scss', './stacked-bar-chart.plot-styles.scss'],
})
export class StackedBarChartComponent implements OnDestroy {
    public readonly stackedPlot = signal<Plot | null>(null);
    public readonly groupedPlot = signal<Plot | null>(null);
    private readonly store = new StackedBarChartStore();

    public constructor() {
        this.initializeStackedChart();
        this.initializeGroupedChart();
    }

    private initializeStackedChart(): void {
        const axisScale = new LinearScale();
        axisScale.margin = { top: 10, left: 56, right: 5, bottom: 30 };
        axisScale.xDomain(() => ({ min: 0.5, max: 4.5 }));
        axisScale.yDomain(() => ({ min: 0, max: 18000 }));

        const xTickFormat = (value: number) => this.store.quarterFromValue(value);
        const yTickFormat = (value: number) => `$${(Math.round(value / 1000)).toString()}k`;
        const stackedBarTooltip = new StackedBarTooltip();

        const plot = new Plot({
            cssClass: 'stacked-bar-chart-demo',
            titleArea: {
                height: 64,
                plots: [
                    new TitleItem('Sales per Category (Stacked)'),
                    new BarLegendItem('Category 1', 'legend-category-1', 0, 3),
                    new BarLegendItem('Category 2', 'legend-category-2', 1, 3),
                    new BarLegendItem('Category 3', 'legend-category-3', 2, 3),
                ],
            },
            leftArea: {
                width: 70,
                plots: [new AxisLabelItem('Sales ($)', -90)],
            },
            footerArea: {
                height: 54,
                plots: [new AxisLabelItem('Quarter')],
            },
            scales: [axisScale],
            plots: [
                new AxisAndGrid({
                    xTicks: 4,
                    yTicks: 11,
                    xTickFormat: xTickFormat,
                    yTickFormat: yTickFormat,
                    showXGrid: false,
                }),
                new StackedBarPlotItem(
                    {
                        categories: [
                            { id: 'cat1', label: 'Category 1', points: this.store.category1Sales },
                            { id: 'cat2', label: 'Category 2', points: this.store.category2Sales },
                            { id: 'cat3', label: 'Category 3', points: this.store.category3Sales },
                        ],
                    },
                    {
                        cssClasses: ['quarterly-stacked-sales'],
                        barWidthRatio: 0.5,
                        xTickFormatter: xTickFormat,
                        yTickFormatter: yTickFormat,
                        tooltip: stackedBarTooltip,
                    },
                ),
            ],
        });
        plot.center.setScale(axisScale);
        this.stackedPlot.set(plot);
    }

    private initializeGroupedChart(): void {
        const axisScale = new LinearScale();
        axisScale.margin = { top: 10, left: 42, right: 5, bottom: 30 };
        axisScale.xDomain(() => ({ min: 0.5, max: 4.5 }));
        axisScale.yDomain(() => ({ min: 0, max: 12000 }));

        const xTickFormat = (value: number) => this.store.quarterFromValue(value);
        const yTickFormat = (value: number) => `$${(Math.round(value / 1000)).toString()}k`;
        const barTooltip = new BarTooltip();

        const plot = new Plot({
            cssClass: 'grouped-bar-chart-demo',
            titleArea: {
                height: 64,
                plots: [
                    new TitleItem('Sales per Category (Grouped)'),
                    new BarLegendItem('Category 1', 'legend-category-1', 0, 3),
                    new BarLegendItem('Category 2', 'legend-category-2', 1, 3),
                    new BarLegendItem('Category 3', 'legend-category-3', 2, 3),
                ],
            },
            leftArea: {
                width: 58,
                plots: [new AxisLabelItem('Sales ($)', -90)],
            },
            footerArea: {
                height: 54,
                plots: [new AxisLabelItem('Quarter')],
            },
            scales: [axisScale],
            plots: [
                new AxisAndGrid({
                    xTicks: 4,
                    yTicks: 12,
                    xTickFormat: xTickFormat,
                    yTickFormat: yTickFormat,
                    showXGrid: false,
                }),
                new BarPlotItem(
                    {
                        series: [
                            { id: 'cat1', label: 'Category 1', cssClass: 'series-category-1', points: this.store.category1Sales },
                            { id: 'cat2', label: 'Category 2', cssClass: 'series-category-2', points: this.store.category2Sales },
                            { id: 'cat3', label: 'Category 3', cssClass: 'series-category-3', points: this.store.category3Sales },
                        ],
                    },
                    {
                        cssClasses: ['quarterly-grouped-sales'],
                        barWidthRatio: 0.82,
                        seriesGapRatio: 0.05,
                        xTickFormatter: xTickFormat,
                        yTickFormatter: yTickFormat,
                        tooltip: barTooltip,
                    },
                ),
            ],
        });
        plot.center.setScale(axisScale);
        this.groupedPlot.set(plot);
    }

    public ngOnDestroy(): void {
        this.stackedPlot()?.destroy();
        this.stackedPlot.set(null);
        this.groupedPlot()?.destroy();
        this.groupedPlot.set(null);
    }
}
