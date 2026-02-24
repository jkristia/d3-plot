import { Component, signal } from '@angular/core';
import { AxisAndGrid, AxisLabelItem, BarPlotItem, LinearScale, PlotBaseComponent, Plot, TitleItem } from '../../plot';
import { HistogramChartStore } from './histogram-chart.store';

@Component({
    selector: 'histogram-chart-demo',
    standalone: true,
    imports: [
        PlotBaseComponent,
    ],
    templateUrl: './histogram-chart.component.html',
    styleUrls: ['./histogram-chart.component.scss'],
})
export class HistogramChartComponent {
    public readonly plot = signal<Plot | null>(null);
    private readonly store = new HistogramChartStore();

    public constructor() {
        const axisScale = new LinearScale();
        axisScale.margin = { top: 10, left: 52, right: 5, bottom: 40 };
        axisScale.xDomain(() => ({ min: 0.5, max: this.store.ageData.length + 0.5 }));
        axisScale.yDomain(() => ({ min: 0, max: 14000 }));

        const plot = new Plot({
            cssClass: 'histogram-chart-demo',
            titleArea: {
                height: 64,
                plots: [
                    new TitleItem('Age Distribution (100k samples)', { align: 'middle' }),
                ],
            },
            leftArea: {
                width: 68,
                plots: [new AxisLabelItem('Count', -90)],
            },
            footerArea: {
                height: 64,
                plots: [new AxisLabelItem('Age Range')],
            },
            scales: [axisScale],
            plots: [
                new AxisAndGrid({
                    xTicks: this.store.ageData.length,
                    yTicks: 10,
                    xTickFormat: (value) => this.store.ageLabelFromValue(value),
                    yTickFormat: (value) => Math.round(value).toString(),
                    xLabelRotateDeg: -45,
                    showXGrid: false,
                }),
                new BarPlotItem(
                    {
                        series: [
                            { id: 'age-count', label: 'Age Count', cssClass: 'series-age-count', points: this.store.ageData },
                        ],
                    },
                    {
                        cssClasses: ['age-histogram'],
                        barWidthRatio: 0.75,
                        seriesGapRatio: 0,
                        xLabelFormatter: (value) => this.store.ageLabelFromValue(value),
                        yValueFormatter: (value) => `${Math.round(value).toLocaleString()}`,
                    },
                ),
            ],
        });
        plot.center.setScale(axisScale);
        this.plot.set(plot);
    }
}
