import * as d3 from 'd3';
import { Component, signal } from '@angular/core';
import { AxisAndGrid, BarPlotItem, LinearScale, PlotItem, PlotBaseComponent, Plot, TitleItem } from '../../plot';
import { Rect } from '../../plot/util';
import { HistogramChartStore } from './histogram-chart.store';

class AxisLabelItem extends PlotItem {
    private textElm?: d3.Selection<SVGTextElement, unknown, null, undefined>;

    public constructor(private text: string, private rotate = 0) {
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
                    new TitleItem('Age Distribution (100k samples)'),
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
