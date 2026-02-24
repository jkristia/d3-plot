import * as d3 from 'd3';
import { PlotItem } from '../plot.item';
import { Rect } from '../util';

export class AxisLabelItem extends PlotItem {
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
