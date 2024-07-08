import * as d3 from 'd3';
import { Margin, Rect } from '../../util';

export class Scale {

    protected _x_Scale = d3.scaleLinear();
    protected _y_Scale = d3.scaleLinear();

    public margin: Margin = { top: 5, left: 5, right: 5, bottom: 5 };

    // public xScale = d3.scaleLinear();
    // public yScale = d3.scaleLinear();

    public get xScale() {
        return this._x_Scale;
    }
    public get yScale() {
        return this._y_Scale;
    }

    public updateScales(area: Rect) {
    }
}
export class LinearScale extends Scale {

    constructor() {
        super()
        this._x_Scale = d3.scaleLinear();
        this._y_Scale = d3.scaleLinear();
    }
    public override updateScales(area: Rect) {
        area = area.adjustMargin(this.margin);
        // x range
        let range = [area.left, area.right]
        let domain = [1996.9, 2007.1]
        this.xScale
            .domain(domain)
            .range(range)

        // y range
        range = [area.height, area.top] // upside down, got from bottom to top 
        domain = [0, 500]
        this.yScale
            .domain(domain)
            .range(range)
    }
}
