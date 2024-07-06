import * as d3 from 'd3';
import { IPlotV1, IPlotTypeOptionsV1 } from "../plot.interface";
import { D3Selection, Rect, Util, ValueFunc } from '../../util';

export class PlotTypeBase {
    protected _plot: IPlotV1 | null = null;
    protected _plotRoot: D3Selection<any> | null = null;

    constructor(protected _options?: IPlotTypeOptionsV1) { }

    public get plotRoot(): D3Selection<any> | null {
        return this._plotRoot;
    }
    public setPlot(plot: IPlotV1) {
        this._plot = plot;
    }
    public initializeLayout() {
        this._plotRoot = d3.create('svg:g')
            .classed('plot-v1-base', true)
        if (this._options?.cssClasses) {
            this._plotRoot.classed(this._options?.cssClasses.join(' '), true)
        }
    }
    public updateLayout() {
    }


    private _area?: Rect;
    private _areaFn?: ValueFunc<Rect>;
    public area(v: Rect | ValueFunc<Rect>): PlotTypeBase {
        if (Util.isFunction(v)) {
            this._areaFn = v as any;
        }
        return this;
    }

    protected getPlotArea(): Rect {
        if (this._areaFn) {
            return this._areaFn();
        }
        if (this._area) {
            return this._area;
        }
        return this._plot?.plotArea || new Rect();
    }
}
