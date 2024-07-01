import * as d3 from 'd3';
import { IPlot, D3Selection, IPlotOptions, Areas, ValueFunc } from "./plot.interface";
import { PlotTypeBase } from "./plot-types/plottype";
import { Rect, Util } from './util';



export class Plot implements IPlot {

    private _root!: D3Selection;
    private _margin = { left: 10, top: 10, right: 10, bottom: 10 };
    private _size: { width: number, height: number } = { width: 0, height: 0 };
    private _plots: PlotTypeBase[] = [];
    private _initialized = false;
    private _areas: Areas = {
        labelTopHeight: 20,
        labelLeftWidth: 20,
        labelRightWidth: 20,
        labelBottomHeight: 20,
    }

    private _fullArea: Rect = new Rect();
    private _topLabelArea: Rect = new Rect();
    private _bottomLabelArea: Rect = new Rect();
    private _leftLabelArea: Rect = new Rect();
    private _rightLabelArea: Rect = new Rect();
    private _plotArea: Rect = new Rect();

    public get fullArea(): Rect {
        return this._fullArea;
    }
    public get topLabelArea(): Rect {
        return this._topLabelArea;
    }
    public get bottomLabelArea(): Rect {
        return this._bottomLabelArea;
    }
    public get leftLabelArea(): Rect {
        return this._leftLabelArea;
    }
    public get rightLabelArea(): Rect {
        return this._rightLabelArea;
    }
    public get plotArea(): Rect {
        return this._plotArea;
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
        if (a.labelTopHeight !== undefined) {
            if (Util.isFunction(a.labelTopHeight)) {
                const f = a.labelTopHeight as ValueFunc<number>;
                rect.height = f()
            } else {
                rect.height = a.labelTopHeight as number;
            }
        }
        return rect;
    }
    private calcBottomLabelArea(): Rect {
        const rect = this.calcFullArea();
        const a = this._areas;
        if (a.labelBottomHeight !== undefined) {
            if (Util.isFunction(a.labelBottomHeight)) {
                const f = a.labelBottomHeight as ValueFunc<number>;
                rect.top = rect.bottom - f()
            } else {
                rect.top = rect.bottom - (a.labelBottomHeight as number);
            }
        }
        return rect;
    }
    private calcLeftLabelArea(): Rect {
        const rect = this.calcFullArea();
        const a = this._areas;
        if (a.labelLeftWidth !== undefined) {
            if (Util.isFunction(a.labelLeftWidth)) {
                const f = a.labelLeftWidth as ValueFunc<number>;
                rect.width = f()
            } else {
                rect.width = a.labelLeftWidth as number;
            }
        }
        return rect;
    }
    private calcRightLabelArea(): Rect {
        const rect = this.calcFullArea();
        const a = this._areas;
        if (a.labelRightWidth !== undefined) {
            if (Util.isFunction(a.labelRightWidth)) {
                const f = a.labelRightWidth as ValueFunc<number>;
                rect.left = rect.right - f();
                rect.width = rect.right - f();
            } else {
                rect.left = rect.right - (a.labelRightWidth as number)
                rect.right = rect.left + (a.labelRightWidth as number);
            }
        }
        return rect;
    }

    public calculateAreas() {
        console.log('calculateAreas')
        this._fullArea = this.calcFullArea();
        this._topLabelArea = this.calcTopLabelArea();
        this._bottomLabelArea = this.calcBottomLabelArea();
        this._leftLabelArea = this.calcLeftLabelArea();
        this._rightLabelArea = this.calcRightLabelArea();
        const r = new Rect()
        r.left = this.leftLabelArea.right;
        r.right = this.rightLabelArea.left;
        r.top =this.topLabelArea.bottom;
        r.bottom = this.bottomLabelArea.top;
        this._plotArea = r;
    }

    constructor(
        private _rootElm?: HTMLElement | null,
        private _options?: IPlotOptions
    ) {
        this._root = d3.create('svg:svg');
        this._plots = _options?.plots || [];
        this._plots.forEach(p => p.setPlot(this));
        this.size({
            width: _options?.width || 600,
            height: _options?.height || 400,
        })
        if (_rootElm) {
            d3.select(_rootElm).append(() => this._root.node())
        }
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
        console.log('this plotarea ', this.plotArea, this._size)
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
}