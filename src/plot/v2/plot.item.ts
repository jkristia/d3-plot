import { AreaFunc, D3Selection, Rect, Util, ValueFunc } from "../util";

export class PlotItem {

    protected _plotRoot: D3Selection | null = null;
    public get plotRoot(): D3Selection | null {
        return this._plotRoot;
    }

    public initializeLayout() {
    }
    public updateLayout(area: Rect) {
        this._area = area;
    }

    private _area: Rect = new Rect();
    private _areaFn?: AreaFunc;
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