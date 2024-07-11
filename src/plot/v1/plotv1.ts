import * as d3 from 'd3';
import { IPlotV1, IPlotOptionsV1, AreasV1 } from "./plot.interface";
import { PlotTypeBase } from "./plot-types/plottype";
import { Rect, Util, Margin, D3Selection, ValueFunc } from '../util';



export class PlotV1 implements IPlotV1 {

    private _root!: D3Selection;
    private _margin: Margin = { left: 0, top: 0, right: 0, bottom: 0 };
    private _size: { width: number, height: number } = { width: 0, height: 0 };
    private _plots: PlotTypeBase[] = [];
    private _initialized = false;
    private _areas: AreasV1 = {
        topHeight: 0,
        leftWidth: 0,
        rightWidth: 0,
        bottomHeight: 0,
    }

    private _fullArea: Rect = new Rect();
    private _topArea: Rect = new Rect();
    private _bottomArea: Rect = new Rect();
    private _leftArea: Rect = new Rect();
    private _rightArea: Rect = new Rect();
    private _plotArea: Rect = new Rect();

    public get fullArea(): Rect {
        return this._fullArea;
    }
    public get topArea(): Rect {
        return this._topArea;
    }
    public get bottomArea(): Rect {
        return this._bottomArea;
    }
    public get leftArea(): Rect {
        return this._leftArea;
    }
    public get rightArea(): Rect {
        return this._rightArea;
    }
    public get plotArea(): Rect {
        return this._plotArea;
    }

    constructor(
        private _rootElm?: HTMLElement | null,
        private _options?: IPlotOptionsV1
    ) {
        this._root = d3.create('svg:svg')
            // https://stackoverflow.com/questions/34229483/why-is-my-svg-line-blurry-or-2px-in-height-when-i-specified-1px?newreg=4c09f0fa159d4550a88d8f189870e6e3
            .attr('transform', 'translate(-0.5 -0.5)')
            // .attr('shape-rendering', 'crispEdges')
            ;
        this._plots = _options?.plots || [];
        this._plots.forEach(p => p.setPlot(this));
        this.size({
            width: _options?.width || 600,
            height: _options?.height || 400,
        })
        if (_rootElm) {
            d3.select(_rootElm).append(() => this._root.node())
        }
        this._areas = _options?.areas || this._areas;
        this._margin = _options?.margin || this._margin;
    }
    public attach(rootElm: HTMLElement) {
        if (this._rootElm) {
            // remove existing nodes
            this._rootElm.innerHTML = ''
        }
        this._rootElm = rootElm;
        d3.select(rootElm).append(() => this.plot())
    }
    public plot(): SVGSVGElement {
        if (!this._initialized) {
            this._initialized = true;
            this.initializeLayout();
            this.updateLayout();
        }
        return this._root.node();
    }

    public size(newSize: { width?: number, height?: number }) {
        if (newSize.width !== undefined) {
            this._size.width = newSize.width;
        }
        if (newSize.height !== undefined) {
            this._size.height = newSize.height;
        }
        this._root
            .attr('width', this._size.width)
            .attr('height', this._size.height)

        this.calculateAreas()
        this.updateLayout();
    }

    protected initializeLayout() {
        this._plots.forEach(p => {
            p.initializeLayout()
            if (p.plotRoot) {
                this._root.append(() => p.plotRoot!.node())
            }
        });
    }
    protected updateLayout() {
        this._plots.forEach(p => {
            p.updateLayout()
        });
    }
    protected calculateAreas() {
        this._fullArea = this.calcFullArea();
        this._topArea = this.calcTopLabelArea();
        this._bottomArea = this.calcBottomLabelArea();
        this._leftArea = this.calcLeftLabelArea();
        this._rightArea = this.calcRightLabelArea();
        const r = new Rect()
        r.left = this.leftArea.right;
        r.right = this.rightArea.left;
        r.top =this.topArea.bottom;
        r.bottom = this.bottomArea.top;
        this._plotArea = r;
    }
    private calcFullArea(): Rect {
        return new Rect({
            left: this._margin.left,
            top: this._margin.top,
            width: this._size.width - (this._margin.left + this._margin.right),
            height: this._size.height - (this._margin.top + this._margin.bottom),
        })
    }
    private calcTopLabelArea(): Rect {
        const rect = this.calcFullArea();
        const a = this._areas;
        a.topHeight = a.topHeight || 0;
        if (a.topHeight !== undefined) {
            if (Util.isFunction(a.topHeight)) {
                const f = a.topHeight as ValueFunc<number>;
                rect.height = f()
            } else {
                rect.height = a.topHeight as number;
            }
        }
        return rect;
    }
    private calcBottomLabelArea(): Rect {
        const rect = this.calcFullArea();
        const a = this._areas;
        a.bottomHeight = a.bottomHeight || 0;
        if (a.bottomHeight !== undefined) {
            if (Util.isFunction(a.bottomHeight)) {
                const f = a.bottomHeight as ValueFunc<number>;
                rect.top = rect.bottom - f()
                rect.height = f();
            } else {
                rect.top = rect.bottom - (a.bottomHeight as number);
                rect.height = (a.bottomHeight as number);
            }
        }
        return rect;
    }
    private calcLeftLabelArea(): Rect {
        const rect = this.calcFullArea();
        const a = this._areas;
        a.leftWidth = a.leftWidth || 0;
        if (a.leftWidth !== undefined) {
            rect.top = this._topArea.bottom;
            rect.bottom = this._bottomArea.top;
            if (Util.isFunction(a.leftWidth)) {
                const f = a.leftWidth as ValueFunc<number>;
                rect.width = f()
            } else {
                rect.width = a.leftWidth as number;
            }
        }
        return rect;
    }
    private calcRightLabelArea(): Rect {
        const rect = this.calcFullArea();
        const a = this._areas;
        a.rightWidth = a.rightWidth || 0;
        if (a.rightWidth !== undefined) {
            rect.top = this._topArea.bottom;
            rect.bottom = this._bottomArea.top;
            if (Util.isFunction(a.rightWidth)) {
                const f = a.rightWidth as ValueFunc<number>;
                rect.left = rect.right - f();
                rect.width = rect.right - f();
            } else {
                rect.left = rect.right - (a.rightWidth as number)
                rect.right = rect.left + (a.rightWidth as number);
            }
        }
        return rect;
    }
}