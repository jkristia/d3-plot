import * as d3 from 'd3';
import { Subject } from "rxjs";
import { D3Selection, Point, Rect } from "../../util";
import { PlotItem } from "../plot.item";
import { IPlotItemOptions } from "../plot.interface";


export interface ILineData {
    points: (Point | null)[];   // null will break the line
    dataChanged?: Subject<void>;
}

export interface ILineOptions extends IPlotItemOptions {
    showPointMarkers?: boolean;
    hackMoveThis?: boolean;
}

export class LineSeries extends PlotItem {

    constructor(protected _data: ILineData, options?: ILineOptions) {
        super(options)
        // this._margin.left = 30;
        // this._margin.bottom = 40;
        this._margin = { top: 5, left: 30, right: 0, bottom: 25};
        // this._margin = { top: 5, left: 0, right: 0, bottom: 5};
        if (_data.dataChanged) {
            _data.dataChanged.subscribe(() => this.updateLayout(this._area))
        }
        this.showPointMarkers = options?.showPointMarkers || false;
    }

    private _pathElm?: D3Selection;
    private _xAxisElm?: D3Selection;
    private _yAxisElm?: D3Selection;
    private _points?: D3Selection<Point | null>;
    protected showPointMarkers = false;

    public override initializeLayout(): void {
        super.initializeLayout()
        this._pathElm = this._rootElm?.classed('line-series-elm', true)
            .append('path')
            .attr('fill', 'none')

        // prepare the points, 
        // but points are created in update as the sample count might have changed
        if (this.showPointMarkers) {
            this._points = this._rootElm!
                .selectAll('.point-marker')
                .data(this._data.points)
        }

        if ((this._options as ILineOptions)?.hackMoveThis) {
            this._xAxisElm = this._rootElm?.append('g')
                .classed('axis-container x-axis', true)
                .call(this._xAxisBottom)
            this._yAxisElm = this._rootElm?.append('g')
                .classed('axis-container y-axis', true)
                .call(this._yAxisLeft)
        }
    }
    public override updateLayout(area: Rect): void {
        super.updateLayout(area);
        if (!this._pathElm) {
            return
        }
        area = this._area;
        this.updateScales(area);

        if (this.showPointMarkers) {
            this._points = this._rootElm!
                .selectAll('.point-marker')
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

        // generate line
        const line = d3.line<Point | null>()
            .x((d) => this.xPoint(d, area))
            .y((d) => this.yPoint(d, area))
            // https://d3js.org/d3-shape/line#line_defined
            .defined(d => d !== null) // allow for discontinuous line
            // https://d3js.org/d3-shape/curve
            .curve(d3.curveMonotoneX)
            ;
        this._pathElm
            .attr('d', line(this._data.points))

    }

    private appendPoint(points: D3Selection<Point | null>): D3Selection<Point | null> {
        return points.append('circle')
            .classed('point-marker', true)
            .attr('r', 4)
            .attr('cx', d => d?.x as any)
            .attr('cy', d => d?.y as any)
    }


    protected _xScale = d3.scaleLinear()
    protected _yScale = d3.scaleLinear()
    // https://d3js.org/d3-axis
    protected _xAxisBottom = d3.axisBottom(this._xScale)
    protected _yAxisLeft = d3.axisLeft(this._yScale)

    protected updateScales(area: Rect) {
        const maxX = d3.max(this._data.points, d => d?.x) || 0;
        const maxY = d3.max(this._data.points, d => d?.y) || 0;
        // x range
        let range = [area.left, area.width]
        let domain = [1996.9, 2007.1]
        this._xScale
            .domain(domain)
            .range(range)

        // y range
        range = [area.height, area.top] // upside down, got from bottom to top 
        domain = [0, 500]
        this._yScale
            .domain(domain)
            .range(range)

        if ((this._options as ILineOptions)?.hackMoveThis) {
            const xticks = this._xScale.ticks(2)
            const yticks = this._yScale.ticks(5)
            this._xAxisBottom.tickValues([1997, 1999, 2001, 2003, 2005, 2007])
            this._xAxisElm?.call(this._xAxisBottom)
            this._xAxisElm?.attr('transform', `translate(0, ${area.height})`)

            this._yAxisLeft.ticks(5)
            this._yAxisElm?.call(this._yAxisLeft)
            this._yAxisElm?.attr('transform', `translate(${area.left}, ${0})`)

        }

    }
    private yPoint(point: Point | null, area: Rect): number {
        return this._yScale(point?.y || 0);
    }
    private xPoint(point: Point | null, area: Rect): number {
        return this._xScale(point?.x || 0);
    }

}