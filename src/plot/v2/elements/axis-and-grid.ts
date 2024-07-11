import * as d3 from 'd3';
import { D3Selection, Point, Rect } from "../../util";
import { PlotItem } from "../plot.item";
import { IPlotItemOptions } from "../plot.interface";
import { Scale } from './scale';

export interface IAxisAndGridOptions extends IPlotItemOptions {
}

export class AxisAndGrid extends PlotItem {

    private _xAxisElm?: D3Selection;
    private _yAxisElm?: D3Selection;
    private _gridElm?: D3Selection;
    // https://d3js.org/d3-axis
    protected _xAxisBottom: d3.Axis<any> | null = null;
    protected _yAxisLeft: d3.Axis<any> | null = null;

    constructor(options?: IAxisAndGridOptions) {
        super(options)
    }

    public override setScale(scale: Scale): this {
        super.setScale(scale);
        this._xAxisBottom = d3.axisBottom(this._scale.xScale);
        this._yAxisLeft = d3.axisLeft(this._scale.yScale);
        return this;
    }

    public override initializeLayout(): void {
        super.initializeLayout()

        this._xAxisElm = this._rootElm?.append('g')
            .classed('axis-container x-axis', true)
            .call(this._xAxisBottom!)

        this._yAxisElm = this._rootElm?.append('g')
            .classed('axis-container y-axis', true)
            .call(this._yAxisLeft!);

        this._gridElm = this._rootElm?.append('g')
            .classed('grid-container', true)
    }
    public override updateLayout(area: Rect): void {
        super.updateLayout(area);
        area = this._area;
        this.renderGrid(area);
        this.renderAxis(area);
    }
    protected renderGrid(area: Rect) {
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
                .attr('y1', d => this._scale.yScale(d))
                .attr('y2', d => this._scale.yScale(d))
        }
    }

    protected renderAxis(area: Rect) {
        if (this._xAxisBottom) {
            this._xAxisBottom.ticks(10).tickFormat(d => d.toString())
            this._xAxisElm?.call(this._xAxisBottom)
            this._xAxisElm?.attr('transform', `translate(-0.5, ${area.height + 0.5})`)
        }
        if (this._yAxisLeft) {
            this._yAxisLeft.ticks(5)
            this._yAxisElm?.call(this._yAxisLeft)
            this._yAxisElm?.attr('transform', `translate(${area.left - 0.5}, ${-0.5})`)
        }
    }
}