import * as d3 from "d3";
import { Subject } from "rxjs";
import { PlotTypeBase } from "./plottype";
import { IPlotTypeOptionsV1 } from "../plot.interface";
import { D3Selection, Point, Rect } from "../../util";

export interface ILineDataV1 {
    points: (Point | null)[];   // null will break the line
    dataChanged?: Subject<void>;
}

export class LineV1 extends PlotTypeBase {

    private _path?: D3Selection;
    private _points?: D3Selection<Point | null>;
    protected _xScale = d3.scaleLinear()

    protected get showPoint(): boolean {
        if (this._options?.showPoint === false) {
            return false;
        }
        return true;
    }

    constructor(protected _data: ILineDataV1, options?: IPlotTypeOptionsV1) {
        super(options)
        if (_data.dataChanged) {
            _data.dataChanged.subscribe(() => this.updateLayout())
        }
    }

    public override initializeLayout() {
        super.initializeLayout();
        this._path = this._plotRoot?.classed('plot-line', true)
            .append('path')
            .attr('fill', 'none')

        // prepare the points, 
        // but points are created in update as the sample count might have changed
        if (this.showPoint) {
            this._points = this._plotRoot!
                .selectAll('.plot-point')
                .data(this._data.points)
        }
    }

    private appendPoint(points: D3Selection<Point | null>): D3Selection<Point | null> {
        return points.append('circle')
            .classed('plot-point', true)
            .attr('r', 4)
            .attr('cx', d => d?.x as any)
            .attr('cy', d => d?.y as any)
    }
    public override updateLayout() {
        if (!this._path) {
            return
        }
        const area = this.getPlotArea().offset();
        this.updateScales(area);
        if (this.showPoint) {
            this._points = this._plotRoot!
                .selectAll('.plot-point')
                .data(this._data.points)
                .join(
                    // add new sample points
                    enter => this.appendPoint(enter),
                    // update remaining points
                    update => update
                        .attr('cx', d => this.xPoint(d, area))
                        .attr('cy', d => this.yPoint(d, area))
                    ,
                )
        }

        const line = d3.line<Point | null>()
            .x((d) => this.xPoint(d, area))
            .y((d) => this.yPoint(d, area))
            // https://d3js.org/d3-shape/line#line_defined
            .defined(d => d !== null) // allow for discontinuous line
            ;
        this._path
            .attr('d', line(this._data.points))
    }

    private _fnRange?: () => [number, number]
    public getRange(fn: () => [number, number]): LineV1 {
        this._fnRange = fn;
        return this;
    }
    private _fnDomain?: () => [number, number]
    public getDomain(fn: () => [number, number]): LineV1 {
        this._fnDomain = fn;
        return this;
    }

    protected updateScales(area: Rect) {
        const max = d3.max(this._data.points, d => d?.x) || 0
        let range = (this._fnRange && this._fnRange()) || [0, area.width]
        let domain = (this._fnDomain && this._fnDomain()) || [0, max]
        this._xScale
            .domain(domain)
            .range(range)
    }
    private yPoint(point: Point | null, area: Rect): number {
        return area.bottom - (point?.y || 0);
    }
    private xPoint(point: Point | null, area: Rect): number {
        return area.left + this._xScale(point?.x || 0);
    }
}