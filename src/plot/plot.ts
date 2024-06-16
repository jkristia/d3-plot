import * as d3 from 'd3';
import { IPlot, D3Selection, IPlotOptions } from "./plot.interface";
import { PlotTypeBase } from "./plot-types/plottype";
import { Rect } from './util';

export class Plot implements IPlot {

    private _root!: D3Selection;
    private _margin = { left: 10, top: 10, right: 10, bottom: 10 };
    private _size: { width: number, height: number } = { width: 0, height: 0 };
    private _plots: PlotTypeBase[] = [];
    private _initialized = false

    public get plotArea(): Rect {
        return new Rect({
            left: this._margin.left,
            top: this._margin.top,
            width: this._size.width - (this._margin.left + this._margin.right),
            height: this._size.height - (this._margin.top + this._margin.bottom),
        })
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
        d3.select(rootElm).append(() => this._root.node())
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