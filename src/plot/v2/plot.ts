import * as d3 from 'd3';
import { Rect, Util, Margin, D3Selection, Size } from '../util';
import { IPlotOptions } from './plot.interface';
import { PlotItem } from './plot.item';

class Area {
    rect: Rect = new Rect();
    plots?: PlotItem[];
    constructor(public root: D3Selection) {}
}

export class PlotV2 {

    private _size: Size = { width: 0, height: 0 };
    private _root!: D3Selection;
    private _rootElm?: HTMLElement | null = null;
    private _titleArea?: Area;
    private _leftArea?: Area;
    private _rightArea?: Area;
    private _footerArea?: Area;
    private _plotArea!: Area;

    constructor(
        private _options: IPlotOptions
    ) {
        this._root = d3.create('svg:svg').classed('d3-plot', true);
        if (_options.titleArea?.height) {
            this._titleArea = new Area(this._root.append('svg:svg').classed('title-area', true));
            this._titleArea.plots = _options.titleArea.plots || [];

            // this._titleArea.root.attr('viewbox', '0 0 831 20')
            this._titleArea.root.append('rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', 831)
                .attr('height', 20)


            // this._titleArea.root.append('text')
            //     .text('hey')
            //     .attr('x', 400)
            //     .attr('y', 20)
        }
        // if (_options.leftArea?.width) {
        //     this._leftArea = new Area(this._root.append('svg:svg').classed('left-area', true));
        //     this._leftArea.plots = _options.leftArea.plots || [];
        // }
        // if (_options.rightArea?.width) {
        //     this._rightArea = new Area(this._root.append('svg:svg').classed('right-area', true));
        //     this._rightArea.plots = _options.rightArea.plots || [];
        // }
        if (_options.footerArea?.height) {
            this._footerArea = new Area(this._root.append('svg:svg').classed('footer-area', true));
            this._footerArea.plots = _options.footerArea.plots || [];

            this._footerArea.root.append('rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', 831)
                .attr('height', 20)

        }
        // this._plotArea = new Area(this._root.append('svg:svg').classed('plot-area', true))
        // this._plotArea.plots = _options.plots || [];
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
        const top_a = this._titleArea;
        if (top_a && this._options.titleArea) {
            top_a.rect.width = this._size.width;
            top_a.rect.height = this._options.titleArea.height;
            top_a.root
                .attr('x', top_a.rect.left)
                .attr('y', top_a.rect.top)
                .attr('width', top_a.rect.width)
                .attr('height', top_a.rect.height)
        }
        const footer_a = this._footerArea;
        if (footer_a && this._options.footerArea) {
            footer_a.rect.width = this._size.width;
            footer_a.rect.top = this._size.height - this._options.footerArea.height;
            footer_a.rect.height = this._options.footerArea.height;
            footer_a.root
                .attr('x', footer_a.rect.left)
                .attr('y', footer_a.rect.top)
                .attr('width', footer_a.rect.width)
                .attr('height', footer_a.rect.height)
        }
    //     this._fullArea = this.calcFullArea();
    //     this._topArea = this.calcTopLabelArea();
    //     this._bottomArea = this.calcBottomLabelArea();
    //     this._leftArea = this.calcLeftLabelArea();
    //     this._rightArea = this.calcRightLabelArea();
    //     const r = new Rect()
    //     r.left = this.leftArea.right;
    //     r.right = this.rightArea.left;
    //     r.top =this.topArea.bottom;
    //     r.bottom = this.bottomArea.top;
    //     this._plotArea = r;
    }
    // private calcFullArea(): Rect {
    //     return new Rect({
    //         left: this._margin.left,
    //         top: this._margin.top,
    //         width: this._size.width - (this._margin.left + this._margin.right),
    //         height: this._size.height - (this._margin.top + this._margin.bottom),
    //     })
    // }
    // private calcTopLabelArea(): Rect {
    //     const rect = this.calcFullArea();
    //     const a = this._areas;
    //     a.topHeight = a.topHeight || 0;
    //     if (a.topHeight !== undefined) {
    //         if (Util.isFunction(a.topHeight)) {
    //             const f = a.topHeight as ValueFunc<number>;
    //             rect.height = f()
    //         } else {
    //             rect.height = a.topHeight as number;
    //         }
    //     }
    //     return rect;
    // }
    // private calcBottomLabelArea(): Rect {
    //     const rect = this.calcFullArea();
    //     const a = this._areas;
    //     a.bottomHeight = a.bottomHeight || 0;
    //     if (a.bottomHeight !== undefined) {
    //         if (Util.isFunction(a.bottomHeight)) {
    //             const f = a.bottomHeight as ValueFunc<number>;
    //             rect.top = rect.bottom - f()
    //             rect.height = f();
    //         } else {
    //             rect.top = rect.bottom - (a.bottomHeight as number);
    //             rect.height = (a.bottomHeight as number);
    //         }
    //     }
    //     return rect;
    // }
    // private calcLeftLabelArea(): Rect {
    //     const rect = this.calcFullArea();
    //     const a = this._areas;
    //     a.leftWidth = a.leftWidth || 0;
    //     if (a.leftWidth !== undefined) {
    //         rect.top = this._topArea.bottom;
    //         rect.bottom = this._bottomArea.top;
    //         if (Util.isFunction(a.leftWidth)) {
    //             const f = a.leftWidth as ValueFunc<number>;
    //             rect.width = f()
    //         } else {
    //             rect.width = a.leftWidth as number;
    //         }
    //     }
    //     return rect;
    // }
    // private calcRightLabelArea(): Rect {
    //     const rect = this.calcFullArea();
    //     const a = this._areas;
    //     a.rightWidth = a.rightWidth || 0;
    //     if (a.rightWidth !== undefined) {
    //         rect.top = this._topArea.bottom;
    //         rect.bottom = this._bottomArea.top;
    //         if (Util.isFunction(a.rightWidth)) {
    //             const f = a.rightWidth as ValueFunc<number>;
    //             rect.left = rect.right - f();
    //             rect.width = rect.right - f();
    //         } else {
    //             rect.left = rect.right - (a.rightWidth as number)
    //             rect.right = rect.left + (a.rightWidth as number);
    //         }
    //     }
    //     return rect;
    // }
}