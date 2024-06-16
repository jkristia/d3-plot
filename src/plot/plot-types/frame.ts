import { D3Selection, ValueFunc } from "../plot.interface";
import { Rect } from "../util";
import { PlotTypeBase } from "./plottype";

export class Frame extends PlotTypeBase {

    private _rect?: D3Selection;
    public override area(v: Rect | ValueFunc<Rect>): Frame {
        super.area(v)
        return this;
    }
    public override initializeLayout() {
        super.initializeLayout();
        this._rect = this._plotRoot?.classed('plot-frame', true)
            .append('rect')
    }
    public override updateLayout() {
        const r = 4;
        const area = this.getPlotArea();
        if (!area || !this._rect) {
            return;
        }
        this._rect
            .attr('x', area.left)
            .attr('y', area.top)
            .attr('rx', r).attr('ry', r)
            .attr('width', area.width)
            .attr('height', area.height)
    }
}
