import * as d3 from 'd3';
import { Subject } from "rxjs";
import { D3Selection, Point, Rect } from "../../util";
import { PlotItem } from "../plot.item";
import { IPlotItemOptions } from "../plot.interface";
import { Scale } from './scale';

export interface ILineData {
    points: (Point | null)[];   // null will break the line
    dataChanged?: Subject<void>;
}

export interface IAxisAndGridOptions extends IPlotItemOptions {
}

export class AxisAndGrid extends PlotItem {

    private _xAxisElm?: D3Selection;
    private _yAxisElm?: D3Selection;
    private _gridElm?: D3Selection;
    private _scale: Scale = new Scale();
    // https://d3js.org/d3-axis
    protected _xAxisBottom: d3.Axis<any> | null = null;
    protected _yAxisLeft: d3.Axis<any> | null = null;

    constructor(protected _data: ILineData, options?: IAxisAndGridOptions) {
        super(options)
        if (_data.dataChanged) {
            _data.dataChanged.subscribe(() => this.updateLayout(this._area))
        }
    }

    public setScale(scale: Scale): AxisAndGrid {
        this._scale = scale;
        this._margin = scale.margin;
        this._xAxisBottom = d3.axisBottom(this._scale.xScale);
        this._yAxisLeft = d3.axisLeft(this._scale.yScale);
        return this;
    }

    public override initializeLayout(): void {
        super.initializeLayout()

        this._xAxisElm = this._rootElm?.append('g')
            .classed('axis-container x-axis', true)
        if (this._xAxisElm && this._xAxisBottom) {
            this._xAxisElm.call(this._xAxisBottom);
        }
        this._yAxisElm = this._rootElm?.append('g')
            .classed('axis-container y-axis', true)
        if (this._yAxisElm && this._yAxisLeft) {
            this._yAxisElm.call(this._yAxisLeft);
        }
        this._gridElm = this._rootElm?.append('g')
            .classed('grid-container', true)
    }
    public override updateLayout(area: Rect): void {
        super.updateLayout(area);
        area = this._area;
        this.updateScales(area);
        if (this._gridElm) {
            this._gridElm.selectAll('.v-line')
                .data(this._scale.xScale.ticks())
                .join('line')
                .classed('v-line grid-line', true)
                .attr('x1', d => this._scale.xScale(d))
                .attr('x2', d => this._scale.xScale(d))
                .attr('y1', area.top)
                .attr('y2', area.height)

            this._gridElm.selectAll('.h-line')
                .data(this._scale.yScale.ticks(5).slice(1))
                .join('line')
                .classed('y-line grid-line', true)
                .attr('x1', area.left)
                .attr('x2', area.right)
                .attr('y1', d => this._scale.yScale(d) + 0.5)
                .attr('y2', d => this._scale.yScale(d) + 0.5)
        }
    }

    protected updateScales(area: Rect) {
        if (this._xAxisBottom) {
            this._xAxisBottom.ticks(10).tickFormat( d => d.toString())
            this._xAxisElm?.call(this._xAxisBottom)
            this._xAxisElm?.attr('transform', `translate(0, ${area.height})`)
        }
        if (this._yAxisLeft) {
            this._yAxisLeft.ticks(5)
            this._yAxisElm?.call(this._yAxisLeft)
            this._yAxisElm?.attr('transform', `translate(${area.left}, ${0})`)
        }
    }
    private yPoint(point: Point | null, area: Rect): number {
        return this._scale.yScale(point?.y || 0);
    }
    private xPoint(point: Point | null, area: Rect): number {
        return this._scale.xScale(point?.x || 0);
    }

}