import * as d3 from "d3";
import { D3Selection, IPlotTypeOptions, LinePoint } from "../../plot/plot.interface";
import { Rect, Util } from "../../plot/util";
import { PlotTypeBase } from "../../plot/plot-types/plottype";

export interface ILineData {
    points: (LinePoint | null)[];   // null will break the line
}

export class Line extends PlotTypeBase {

    private _path?: D3Selection;
    private _points?: D3Selection<LinePoint | null>;

    constructor(private _data: ILineData, options?: IPlotTypeOptions) {
        super(options)
    }

    public override initializeLayout() {
        super.initializeLayout();
        this._path = this._plotRoot?.classed('plot-line', true)
            .append('path')
            .attr('fill', 'none')

        // prepare the points, 
        // but points are created in update as the sample count might have changed
        this._points = this._plotRoot!
            .selectAll('.plot-point')
            .data(this._data.points)
    }

    private appendPoint(points: D3Selection<LinePoint | null>): D3Selection<LinePoint | null> {
        return points.append('circle')
            .classed('plot-point', true)
            .attr('r', 4)
            .attr('cx', d => d?.x as any)
            .attr('cy', d => d?.y as any)
    }

    private yPoint(point: LinePoint | null, area: Rect): number {
        return area.bottom - (point?.y || 0);
    }
    private xPoint(point: LinePoint | null, area: Rect): number {
        return area.left + (point?.x || 0);
    }
    public override updateLayout() {
        if (!this._path || !this._points) {
            return
        }
        const area = this.getPlotArea();
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

        const line = d3.line<LinePoint | null>()
            .x((d) => this.xPoint(d, area))
            .y((d) => this.yPoint(d, area))
            // https://d3js.org/d3-shape/line#line_defined
            .defined( d => d !== null) // allow for discontinuous line
            ;

        this._path
            .attr('d', line(this._data.points))
    }

}