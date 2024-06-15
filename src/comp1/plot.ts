import * as d3 from 'd3';

type D3Selection<T = any> = d3.Selection<any, T, null, undefined>;

export interface Size {
    width: number;
    height: number;
}
export interface Rect extends Size {
    left: number;
    top: number;
}

export interface IPlotOptions {
    width?: number;
    height?: number;
    plots?: PlotTypeBase[]
}

export interface IPlot {
    readonly plotArea: Rect;
}

export interface IPlotTypeOptions {
    cssClasses?: string[]
}

export class PlotTypeBase {
    protected _plot: IPlot | null = null;
    protected _plotRoot: D3Selection<any> | null = null;

    constructor(protected _options?: IPlotTypeOptions) {}
    
    public get plotRoot(): D3Selection<any> | null {
        return this._plotRoot;
    }
    public setPlot(plot: IPlot) {
        this._plot = plot;
    }
    public initializeLayout() {
        this._plotRoot = d3.create('svg:g')
            .classed('plot-base', true)
        if (this._options?.cssClasses) {
            this._plotRoot.classed(this._options?.cssClasses.join(' '), true)
        }
    }
    public updateLayout() {
    }
}

export class Frame extends PlotTypeBase {

    private _rect?: D3Selection
    public override initializeLayout() {
        super.initializeLayout();
        this._rect = this._plotRoot?.classed('plot-frame', true)
            .append('rect')
    }
    public override updateLayout() {
        const r = 4;
        const area = this._plot?.plotArea;
        if (!area || !this._rect) {
            return;
        }
        this._rect
            .attr('x', area.left).attr('y', area.top)
            .attr('rx', r).attr('ry', r)
            .attr('width', area.width).attr('height', area.height)
    }
}

export class Plot implements IPlot {

    private _root!: D3Selection;
    private _margin = { left: 10, top: 10, right: 10, bottom: 10 };
    private _size: { width: number, height: number } = { width: 0, height: 0 };
    private _plots: PlotTypeBase[] = [];
    private _initialized = false

    public get plotArea(): Rect {
        return {
            left: this._margin.left,
            top: this._margin.top,
            width: this._size.width - (this._margin.left + this._margin.right),
            height: this._size.height - (this._margin.top + this._margin.bottom),
        }
    }

    constructor(
        private _rootElm?: HTMLElement,
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