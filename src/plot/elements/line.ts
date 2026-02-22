import * as d3 from 'd3';
import { Subject } from "rxjs";
import { D3Selection, Point, Rect } from "../util";
import { PlotItem } from "../plot.item";
import { IPlotItemOptions } from "../plot.interface";

export interface ILineData {
    points: (Point | null)[];   // null will break the line
    dataChanged?: Subject<void>;
}

export interface ILineOptions extends IPlotItemOptions {
    showPointMarkers?: 'always' | 'onhover';
    curveType?: 'linear' | 'smooth';
    transitionDurationMs?: number;
}

export class LineSeries extends PlotItem {

    private _pathElm?: D3Selection;
    private _pointContainer?: D3Selection
    private _hasRendered = false;
    private get options(): ILineOptions | undefined {
        return this._options as ILineOptions;
    }
    private get createPointMarkers(): boolean {
        return this.options?.showPointMarkers !== undefined;
    }
    private get lineType(): d3.CurveFactory {
        if (this.options?.curveType === 'smooth') {
            return d3.curveMonotoneX
        }
        return d3.curveLinear;
    }
    private get transitionDurationMs(): number {
        return this.options?.transitionDurationMs || 0;
    }

    public constructor(protected _data: ILineData, options?: ILineOptions) {
        super(options)
        if (_data.dataChanged) {
            _data.dataChanged.subscribe(() => this.updateLayout(this._area))
        }
    }

    public override initializeLayout(): void {
        super.initializeLayout()
        this._pathElm = this._rootElm?.classed('line-series-elm', true)
            .append('path')
            .attr('fill', 'none')
    }
    public override updateLayout(area: Rect): void {
        super.updateLayout(area);
        if (!this._pathElm) {
            return
        }
        area = this._area;
        const animate = this.transitionDurationMs > 0 && this._hasRendered;
        if (this.createPointMarkers) {
            if (!this._pointContainer) {
                this._pointContainer = this._rootElm!.append('g')
                    .classed('point-container', true)
                if (this.options?.showPointMarkers === 'onhover') {
                    this._pointContainer.classed('hidden', true)
                }
            }
            this._pointContainer
            // this._points = this._rootElm!
                .selectAll('.point-marker')
                .data(this._data.points)
                .join(
                    // add new sample points
                    enter => this.appendPoint(enter, area),
                    // update remaining points
                    update => {
                        if (animate) {
                            return update
                                .transition()
                                .duration(this.transitionDurationMs)
                                .attr('cx', d => this.xPoint(d, area))
                                .attr('cy', d => this.yPoint(d, area));
                        }
                        return update
                            .attr('cx', d => this.xPoint(d, area))
                            .attr('cy', d => this.yPoint(d, area));
                    }
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
            .curve(this.lineType)
            ;
        if (animate) {
            this._pathElm
                .transition()
                .duration(this.transitionDurationMs)
                .attr('d', line(this._data.points))
            this._hasRendered = true;
            return;
        }
        this._pathElm
            .attr('d', line(this._data.points))
        this._hasRendered = true;
    }

    private appendPoint(points: D3Selection<Point | null>, area: Rect): D3Selection<Point | null> {
        return points.append('circle')
            .classed('point-marker', true)
            .attr('r', 4)
            .attr('cx', d => this.xPoint(d, area))
            .attr('cy', d => this.yPoint(d, area))
    }
    private yPoint(point: Point | null, area: Rect): number {
        return this.scale.yScale(point?.y || 0);
    }
    private xPoint(point: Point | null, area: Rect): number {
        return this.scale.xScale(point?.x || 0);
    }
    protected override onMouseHover(hover: boolean) {
        if (this.options?.showPointMarkers === 'onhover') {
            this._pointContainer?.classed('hidden', !hover);
        }
   }

}