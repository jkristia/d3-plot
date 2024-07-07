import * as d3 from 'd3';
import { Rect, Util, Margin, D3Selection, Size } from '../util';
import { IPlotOptions } from './plot.interface';
import { PlotItem } from './plot.item';

class Area {
    public root?: D3Selection;
    public background: D3Selection;
    public rect: Rect = new Rect();
    public plots?: PlotItem[];
    constructor(root?: D3Selection) {
        this.root = root;
        this.background = d3.create('svg:rect')
        if (root) {
            root.append(() => this.background.node())
                .classed('plot-background', true)
        }
    }

    public applyRect(): D3Selection {
        this.root!
            .attr('x', this.rect.left)
            .attr('y', this.rect.top)
            .attr('width', this.rect.width)
            .attr('height', this.rect.height)

        this.background
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', this.rect.width)
            .attr('height', this.rect.height)

        return this.root!;
    }
}

export class PlotV2 {

    private _size: Size = { width: 0, height: 0 };
    private _root!: D3Selection;
    private _rootElm?: HTMLElement | null = null;
    private _titleArea: Area = new Area();
    private _leftArea: Area = new Area();
    private _rightArea: Area = new Area();
    private _footerArea: Area = new Area();
    private _plotArea: Area = new Area();

    constructor(
        private _options: IPlotOptions
    ) {
        this._root = d3.create('svg:svg').classed('d3-plot', true);
        if (_options.titleArea?.height) {
            this._titleArea = new Area(this._root.append('svg:svg').classed('title-area', true));
            this._titleArea.plots = _options.titleArea.plots || [];
        }
        if (_options.leftArea?.width) {
            this._leftArea = new Area(this._root.append('svg:svg').classed('left-area', true));
            this._leftArea.plots = _options.leftArea.plots || [];
        }
        if (_options.rightArea?.width) {
            this._rightArea = new Area(this._root.append('svg:svg').classed('right-area', true));
            this._rightArea.plots = _options.rightArea.plots || [];
        }
        if (_options.footerArea?.height) {
            this._footerArea = new Area(this._root.append('svg:svg').classed('footer-area', true));
            this._footerArea.plots = _options.footerArea.plots || [];
        }
        this._plotArea = new Area(this._root.append('svg:svg').classed('plot-area', true))
        this._plotArea.plots = _options.plots || [];
    }

    public attach(rootElm: HTMLElement) {
        if (this._rootElm) {
            // remove existing nodes
            this._rootElm.innerHTML = ''
        }
        this._rootElm = rootElm;
        d3.select(rootElm).append(() => this.plot())
    }
    private plot(): SVGSVGElement {
        // if (!this._initialized) {
        //     this._initialized = true;
        //     this.initializeLayout();
        //     this.updateLayout();
        // }
        return this._root.node();
        // return null as any;
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
        // this.updateLayout();
    }

    protected initializeLayout() {
        // this._plots.forEach(p => {
        //     p.initializeLayout()
        //     if (p.plotRoot) {
        //         this._root.append(() => p.plotRoot!.node())
        //     }
        // });
    }
    protected updateLayout() {
        // this._plots.forEach(p => {
        //     p.updateLayout()
        // });
    }
    protected calculateAreas() {
        const top = this._titleArea;
        const left = this._leftArea;
        const right = this._rightArea;
        const bottom = this._footerArea;
        const plot = this._plotArea;

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