import { Point } from '../util';
import { TooltipBase } from './tooltip';
import * as d3 from 'd3';

/**
 * Data structure for bar chart tooltip
 */
export interface BarTooltipData {
    point: Point;
    seriesLabel: string;
    xLabelFormatter?: (x: number) => string;
    yValueFormatter?: (y: number) => string;
}

/**
 * Tooltip implementation for bar charts
 */
export class BarTooltip extends TooltipBase<BarTooltipData> {
    protected override formatData(data: BarTooltipData): string[] {
        const xLabel = data.xLabelFormatter
            ? data.xLabelFormatter(data.point.x)
            : data.point.x.toString();
        const yLabel = data.yValueFormatter
            ? data.yValueFormatter(data.point.y)
            : data.point.y.toString();
        return [xLabel, `${data.seriesLabel}: ${yLabel}`];
    }

    protected override getMousePosition(event: MouseEvent): Point {
        // Use D3 pointer to get SVG-relative coordinates
        if (!this.containerElm) {
            return { x: 0, y: 0 };
        }
        const coordinates = d3.pointer(event, this.containerElm.node());
        return { x: coordinates[0], y: coordinates[1] };
    }
}
