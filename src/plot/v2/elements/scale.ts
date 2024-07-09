import * as d3 from 'd3';
import { DomainFunc, Margin, Rect } from '../../util';

/*
    Scale is a default Linear Scale with a 1-to-1 mapping, point value of 10 = 10px using the d3 scale object,
    Range is always set to area width or height, adjusted for margin
    Domain (the viewing area of the data set) is set to same as range, this can be overridden in the callback x/yDomain
*/
export class Scale {

    protected _x_Scale = d3.scaleLinear();
    protected _y_Scale = d3.scaleLinear();
    protected _fnXDomain: DomainFunc | null = null;
    protected _fnYDomain: DomainFunc | null = null;
    protected _area: Rect = new Rect();

    public margin: Margin = { top: 0, left: 0, right: 0, bottom: 0 };

    public get area(): Rect {
        return this._area;

    }
    public get xScale() {
        return this._x_Scale;
    }
    public get yScale() {
        return this._y_Scale;
    }
    public xDomain(fn: DomainFunc): this {
        this._fnXDomain = fn;
        return this;
    }
    public yDomain(fn: DomainFunc): this {
        this._fnYDomain = fn;
        return this;
    }

    public updateScales(area: Rect) {
        area = area.adjustMargin(this.margin);
        this._area = area;
        // x range
        let range = [area.left, area.right]
        let domain = [area.left, area.right];
        if (this._fnXDomain) {
            const d = this._fnXDomain(area);
            domain = [d.min, d.max];
        }
        this.xScale
            .domain(domain)
            .range(range)

        // y range
        range = [area.height, area.top] // upside down, got from bottom to top 
        domain = [area.top, area.height]
        if (this._fnYDomain) {
            const d = this._fnYDomain(area);
            domain = [d.min, d.max];
        }
        this.yScale
            .domain(domain)
            .range(range)
    }
}
export class LinearScale extends Scale {
    constructor() {
        super()
        this._x_Scale = d3.scaleLinear();
        this._y_Scale = d3.scaleLinear();
    }
    public override updateScales(area: Rect) {
        super.updateScales(area);
    }
}
