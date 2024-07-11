import * as d3 from 'd3';
import { Rect, D3Selection, Size } from '../util';
import { IPlotOptions } from './plot.interface';
import { TitleItem } from './elements';
import { PlotArea } from './plot.area';

export class PlotV2 {

    private _size: Size = { width: 0, height: 0 };
    private _root!: D3Selection;
    private _rootElm?: HTMLElement | null = null;
    private _topArea: PlotArea = new PlotArea();
    private _leftArea: PlotArea = new PlotArea();
    private _rightArea: PlotArea = new PlotArea();
    private _bottomArea: PlotArea = new PlotArea();
    private _centerArea: PlotArea = new PlotArea();

    public get top(): PlotArea { return this._topArea; }
    public get left(): PlotArea { return this._leftArea; }
    public get right(): PlotArea { return this._rightArea; }
    public get bottom(): PlotArea { return this._bottomArea; }
    public get center(): PlotArea { return this._centerArea; }

    constructor(
        private _options: IPlotOptions
    ) {
        this._root = d3.create('svg:svg')
            // https://stackoverflow.com/questions/34229483/why-is-my-svg-line-blurry-or-2px-in-height-when-i-specified-1px?newreg=4c09f0fa159d4550a88d8f189870e6e3
            .attr('transform', 'translate(-0.5 -0.5)')
            .classed(`d3-plot ${_options.cssClass || ''}`, true);
        // use default title if not set
        if (_options.title && !_options.titleArea?.height) {
            _options.titleArea = {
                height: 40,
                plots: [new TitleItem(_options.title)]
            }
        }
        if (_options.titleArea?.height) {
            this._topArea = new PlotArea(this._root.append('svg:svg').classed('title-area', true));
            this._topArea.plots = _options.titleArea.plots || [];
        }
        if (_options.leftArea?.width) {
            this._leftArea = new PlotArea(this._root.append('svg:svg').classed('left-area', true));
            this._leftArea.plots = _options.leftArea.plots || [];
        }
        if (_options.rightArea?.width) {
            this._rightArea = new PlotArea(this._root.append('svg:svg').classed('right-area', true));
            this._rightArea.plots = _options.rightArea.plots || [];
        }
        if (_options.footerArea?.height) {
            this._bottomArea = new PlotArea(this._root.append('svg:svg').classed('footer-area', true));
            this._bottomArea.plots = _options.footerArea.plots || [];
        }
        this._centerArea = new PlotArea(this._root.append('svg:svg').classed('plot-area', true));
        this._centerArea.forceInitialize = true;
        this._centerArea.plots = _options.plots || [];
    }

    public attach(rootElm: HTMLElement): PlotV2 {
        // remove any existing nodes
        rootElm.innerHTML = ''
        this._rootElm = rootElm;
        d3.select(rootElm).append(() => this.plot())
        return this;
    }
    private plot(): SVGSVGElement {
        this.calculateAreas()
        this.initializeLayout();
        this.updateLayout();
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
        this._topArea.initializeLayout();
        this._leftArea.initializeLayout();
        this._centerArea.initializeLayout();
        this._rightArea.initializeLayout();
        this._bottomArea.initializeLayout();
    }
    protected updateLayout() {
        const r = new Rect({ left: 0, top: 0, width: this._centerArea.rect.width, height: this._centerArea.rect.height });
        this._options.scales?.forEach(s => s.updateScales(r));
        this._topArea.updateLayout();
        this._leftArea.updateLayout();
        this._centerArea.updateLayout();
        this._rightArea.updateLayout();
        this._bottomArea.updateLayout();
    }
    protected calculateAreas() {
        const top = this._topArea;
        const left = this._leftArea;
        const right = this._rightArea;
        const bottom = this._bottomArea;
        const plot = this._centerArea;

        if (this._options.titleArea?.height) {
            top.rect.width = this._size.width;
            top.rect.height = this._options.titleArea.height;
            top.applyRect();
        }
        if (this._options.footerArea?.height) {
            bottom.rect.width = this._size.width;
            bottom.rect.top = this._size.height - this._options.footerArea.height;
            bottom.rect.height = this._options.footerArea.height;
            bottom.applyRect();
        }
        if (this._options.leftArea?.width) {
            left.rect.top = top.rect.bottom;
            left.rect.width = this._options.leftArea.width;
            left.rect.height = this._size.height - (top.rect.height + bottom.rect.height);
            left.applyRect();
        }
        if (this._options.rightArea?.width) {
            right.rect.top = top.rect.bottom;
            right.rect.left = this._size.width - this._options.rightArea.width;
            right.rect.width = this._options.rightArea.width;
            right.rect.height = this._size.height - (top.rect.height + bottom.rect.height);
            right.applyRect();
        }
        plot.rect.top = top.rect.bottom;
        plot.rect.left = left.rect.width;
        plot.rect.width = this._size.width - (left.rect.width + right.rect.width);
        plot.rect.height = this._size.height - (top.rect.height + bottom.rect.height);
        plot.applyRect();
    }
}