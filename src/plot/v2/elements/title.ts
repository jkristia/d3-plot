import * as d3 from "d3";
import { PlotItem } from "../plot.item";
import { Margin, Rect } from "../../util";

export class TitleItem extends PlotItem {

    private margin: Margin = { left: 5, top: 0, right: 0, bottom: 0 }
    constructor(private _text: string) {
        super();
    }
    public override initializeLayout() {
        this._rootElm = d3.create('svg:g').classed('title-elm', true)
        this._rootElm.append('svg:text')
            .text(this._text)
            .attr('dominant-baseline', 'middle')
            .attr('text-anchor', 'start')
    }
    public override updateLayout(area: Rect) {
        const r = area.adjustMargin(this.margin)
        this._rootElm?.attr('transform', `translate(${r.left}, ${r.center.y})`)
    }
}