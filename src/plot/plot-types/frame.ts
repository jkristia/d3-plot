import { D3Selection, ValueFunc } from "../plot.interface";
import { Rect } from "../util";
import { PlotTypeBase } from "./plottype";

export class Frame extends PlotTypeBase {

    private _rect?: D3Selection;
    private _d3Text?: D3Selection;
    private _text?: string;
    private _textOptions?: { rotate: number };
    public text(text: string, options?: { rotate: number }): Frame {
        this._text = text;
        this._textOptions = options;
        return this;
    }
    public override area(v: Rect | ValueFunc<Rect>): Frame {
        super.area(v)
        return this;
    }
    public override initializeLayout() {
        super.initializeLayout();
        this._rect = this._plotRoot?.classed('plot-frame', true)
            .append('rect')
        if (this._text) {
            this._d3Text = this._plotRoot?.append('text')
            this._d3Text?.text(this._text)



        }
    }
    public override updateLayout() {
        const r = 2;
        const area = this.getPlotArea()?.offset(); // render thinner line by offsetting 
        if (!area || !this._rect) {
            return;
        }
        this._rect
            .attr('x', area.left)
            .attr('y', area.top)
            .attr('rx', r).attr('ry', r)
            .attr('width', area.width)
            .attr('height', area.height)
        if (this._d3Text) {
            // center and rotate
            this._d3Text
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .attr('transform', `translate(${area.center.x}, ${area.center.y}) rotate(${ this._textOptions?.rotate || 0})`)
        }
    }
}
