import { Point } from '../util';
import { TooltipBase } from './tooltip';
import * as d3 from 'd3';
import { StackedBarTooltipData } from './stacked-bar';

/**
 * Tooltip implementation for stacked bar charts
 */
export class StackedBarTooltip extends TooltipBase<StackedBarTooltipData> {
    protected override formatData(data: StackedBarTooltipData): string[] {
        const xFormatter = data.xTooltipFormatter ?? data.xTickFormatter;
        const xLabel = xFormatter ? xFormatter(data.point.x) : data.point.x.toString();

        const yFormatter = data.yTooltipFormatter ?? data.yTickFormatter;
        const yLabel = yFormatter ? yFormatter(data.point.y) : data.point.y.toString();
        return [xLabel, `${data.category}: ${yLabel}`];
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
