import * as d3 from "d3";
import { IPlotItemOptions } from "../plot.interface";
import { PlotItem } from "../plot.item";
import { D3Selection, Margin, Rect } from "../util";

export type TitleAlignment = 'left' | 'middle' | 'right';

export interface ITitleItemOptions extends IPlotItemOptions {
    align?: TitleAlignment;
    offset?: { x?: number; y?: number };
}

export class TitleItem extends PlotItem {

    private textElm?: D3Selection;
    private get options(): ITitleItemOptions | undefined {
        return this._options as ITitleItemOptions;
    }

    public constructor(private _text: string, options?: ITitleItemOptions) {
        super(options);
    }
    public override initializeLayout() {
        this._rootElm = d3.create('svg:g').classed('title-elm', true)
        this.textElm = this._rootElm.append('svg:text')
            .text(this._text)
            .attr('dominant-baseline', 'middle')
            .attr('text-anchor', 'start')
    }
    public override updateLayout(area: Rect) {
        const r = area.adjustMargin(this.margin)
        const align = this.options?.align ?? 'left';
        const offsetX = this.options?.offset?.x ?? 0;
        const offsetY = this.options?.offset?.y ?? 0;
        const x = align === 'right' ? r.right : (align === 'middle' ? r.center.x : r.left);
        const anchor = align === 'right' ? 'end' : (align === 'middle' ? 'middle' : 'start');

        this.textElm?.attr('text-anchor', anchor);
        this._rootElm?.attr('transform', `translate(${x + offsetX}, ${r.center.y - offsetY})`)
    }
}