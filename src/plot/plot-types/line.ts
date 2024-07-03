import * as d3 from "d3";
import { D3Selection, IPlotTypeOptions, LinePoint } from "../../plot/plot.interface";
import { Rect, Util } from "../../plot/util";
import { PlotTypeBase } from "../../plot/plot-types/plottype";
import { Subject } from "rxjs";

export interface ILineData {
    points: (LinePoint | null)[];   // null will break the line
    dataChanged?: Subject<void>;
}

export class Line extends PlotTypeBase {

    private _path?: D3Selection;
    private _points?: D3Selection<LinePoint | null>;
    protected _xScale = d3.scaleLinear()

    protected get showPoint(): boolean {
        if (this._options?.showPoint === false) {
            return false;
        }
        return true;
    }

    constructor(protected _data: ILineData, options?: IPlotTypeOptions) {
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

    private appendPoint(points: D3Selection<LinePoint | null>): D3Selection<LinePoint | null> {
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

        const line = d3.line<LinePoint | null>()
            .x((d) => this.xPoint(d, area))
            .y((d) => this.yPoint(d, area))
            // https://d3js.org/d3-shape/line#line_defined
            .defined(d => d !== null) // allow for discontinuous line
            ;

            // console.log('JKJKJK', this._data.points)
            // console.log(line(this._data.points))
        this._path
            .attr('d', line(this._data.points))
    }

    private _fnRange?: () => [number, number]
    public getRange(fn: () => [number, number]): Line {
        this._fnRange = fn;
        return this;
    }
    private _fnDomain?: () => [number, number]
    public getDomain(fn: () => [number, number]): Line {
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
    private yPoint(point: LinePoint | null, area: Rect): number {
        return area.bottom - (point?.y || 0);
    }
    private xPoint(point: LinePoint | null, area: Rect): number {
        return area.left + this._xScale(point?.x || 0);
    }
}