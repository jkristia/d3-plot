import * as d3 from 'd3';
import { Point } from '../util';
import { TooltipBase } from './tooltip';

export interface LineTooltipData {
	point: Point;
	seriesLabel: string;
	xTooltipFormatter?: (x: number) => string;
	xTickFormatter?: (x: number) => string;
	yTooltipFormatter?: (y: number) => string;
	yTickFormatter?: (y: number) => string;
}

export class LineTooltip extends TooltipBase<LineTooltipData> {
	protected override formatData(data: LineTooltipData): string[] {
		const xFormatter = data.xTooltipFormatter ?? data.xTickFormatter;
		const xLabel = xFormatter ? xFormatter(data.point.x) : data.point.x.toString();

		const yFormatter = data.yTooltipFormatter ?? data.yTickFormatter;
		const yLabel = yFormatter ? yFormatter(data.point.y) : data.point.y.toString();
		return [xLabel, `${data.seriesLabel}: ${yLabel}`];
	}

	protected override getMousePosition(event: MouseEvent): Point {
		if (!this.containerElm) {
			return { x: 0, y: 0 };
		}
		const coordinates = d3.pointer(event, this.containerElm.node());
		return { x: coordinates[0], y: coordinates[1] };
	}
}
