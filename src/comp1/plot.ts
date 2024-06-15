import * as d3 from 'd3';

type D3Selection<T = any> = d3.Selection<any, T, null, undefined>;

export interface IPlotOptions {
    width?: number;
    height?: number;

}


export class Plot {

    private _root!: D3Selection;
    private _size: { width: number, height: number} = { width: 0, height: 0};


    constructor(
        private _rootElm?: HTMLElement,
        private _options?: IPlotOptions
    ) {
        this._root = d3.create('svg');
        this.size({
            width: _options?.width || 600,
            height: _options?.height || 400,
        })
    }
    public plot(): SVGSVGElement {
        return this._root.node();
    }

    public size(newSize: { width?: number, height?: number}) {
        if (newSize.width !== undefined) {
            this._size.width = newSize.width;
        }
        if (newSize.height !== undefined) {
            this._size.height = newSize.height;
        }
        this._root
            .attr('width', this._size.width)
            .attr('height', this._size.height)

        this.updateLayout();
    }

    protected initializeLayout() {
    }
    protected updateLayout() {
    }

}