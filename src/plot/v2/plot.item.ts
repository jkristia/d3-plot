import * as d3 from 'd3'
import { AreaFunc, D3Selection, Margin, Rect, Util, ValueFunc } from "../util";
import { IPlotItem, IPlotItemOptions, IPlotOwner } from "./plot.interface";
import { Scale } from './elements';

export class PlotItem implements IPlotItem {

    protected _margin: Margin = { left: 5, top: 5, right: 5, bottom: 5 };
    protected _area: Rect = new Rect();
    private _areaFn?: AreaFunc;
    protected _rootElm: D3Selection | null = null;
    protected _scale: Scale = new Scale();
    protected _owner?: IPlotOwner;

    public get id(): string | undefined {
        return this._options?.id;
    }
    public get plotElement(): D3Selection | null {
        return this._rootElm;
    }
    constructor(protected _options?: IPlotItemOptions) {
    }
    public setOwner(owner: IPlotOwner) {
        this._owner = owner;
    }
    public setScale(scale: Scale): this {
        this._scale = scale;
        this._margin = scale.margin;
        return this;
    }
    public initializeLayout(): void {
        this._rootElm = d3.create('svg:g')
            .classed('plot-elm', true)
        if (this._options?.id) {
            this._rootElm.attr('id', this._options.id);
        }
        if (this._options?.cssClasses) {
            this._rootElm.classed(this._options?.cssClasses.join(' '), true)
        }
        this._rootElm
            .on('mouseover', (e: MouseEvent) => {
                this._rootElm?.classed('mouse-hover', true);
                this._owner?.setHoverItem(this);
            })
            .on('mouseout', (e: MouseEvent) => {
                this._rootElm?.classed('mouse-hover', false);
                this._owner?.clearHoverItem(this)
            })
    }
    public updateLayout(area: Rect): void {
        this._area = area.adjustMargin(this._margin);
    }

    public area(v: AreaFunc): PlotItem {
        this._areaFn = v;
        return this;
    }
    protected getPlotArea(): Rect {
        if (this._areaFn) {
            return this._areaFn(this._area);
        }
        return this._area;
    }
}