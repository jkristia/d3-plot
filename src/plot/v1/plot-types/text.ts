
import { Point } from "../../util";
import { D3Selection, IPlotTypeOptionsV1 } from "../plot.interface";
import { PlotTypeBase } from "./plottype";

export interface TextOptions extends IPlotTypeOptionsV1 {
    text?: string;
    rotate?: number;
    position?: 'center' | 'right';
    offset?: Point;

}
export class Text extends PlotTypeBase {

    private _text?: D3Selection;
    private _textOptions?: TextOptions;

    constructor(options?: TextOptions) {
        super(options)
        this._textOptions = options;
    }
    public override initializeLayout() {
        super.initializeLayout();
        if (this._textOptions?.text) {
            this._text = this._plotRoot?.append('text')
            this._text?.text(this._textOptions?.text)
        }
    }
    public override updateLayout() {
        const area = this.getPlotArea()?.offset();
        if (this._text) {
            let xPos = area.center.x;
            let yPos = area.center.y;
            let anchor = 'middle';
            if (this._textOptions?.position === 'right') {
                xPos = area.right;
                anchor = 'end'
            }
            const offset = this._textOptions?.offset;
            if (offset) {
                xPos += offset.x;
                yPos += offset.y;
            }
            this._text
                .attr('text-anchor', anchor)
                .attr('dominant-baseline', 'middle')
                .attr('transform', `translate(${xPos}, ${yPos}) rotate(${ this._textOptions?.rotate || 0})`)
        }
    }
}
