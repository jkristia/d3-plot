import * as d3 from 'd3';
import { IPlot, D3Selection, IPlotTypeOptions, Rect, Util } from "./plot.interface";

export class PlotTypeBase {
    protected _plot: IPlot | null = null;
    protected _plotRoot: D3Selection<any> | null = null;

    constructor(protected _options?: IPlotTypeOptions) { }

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


    private _area?: Rect;
    private _areaFn?: ValueFunc<Rect>;
    public area(v: Rect | ValueFunc<Rect>): PlotTypeBase {
        if (Util.isFunction(v)) {
            this._areaFn = v as any;
        }
        return this;
    }

    protected getPlotArea(): Rect {
        if (this._areaFn) {
            return this._areaFn();
        }
        if (this._area) {
            return this._area;
        }
        return this._plot!.plotArea;
    }
}

export type ValueFunc<T> = () => T;

export class Frame extends PlotTypeBase {

    private _rect?: D3Selection;
    public override area(v: Rect | ValueFunc<Rect>): Frame {
        super.area(v)
        return this;
    }
    public override initializeLayout() {
        super.initializeLayout();
        this._rect = this._plotRoot?.classed('plot-frame', true)
            .append('rect')
    }
    public override updateLayout() {
        const r = 4;
        const area = this.getPlotArea();
        if (!area || !this._rect) {
            return;
        }
        this._rect
            .attr('x', area.left).attr('y', area.top)
            .attr('rx', r).attr('ry', r)
            .attr('width', area.width)
            .attr('height', area.height)
    }
}
type T = { x: number, y: number };

export class Line extends PlotTypeBase {

    private data: T[] = []
    private _path?: D3Selection;
    private _points?: D3Selection<T>;

    constructor(options?: IPlotTypeOptions) {
        super(options)
        this.fillData();
        this.dummy();
    }
    private fillData() {
        const randomX = d3.randomInt(0, 600);
        const randomY = d3.randomInt(0, 500);
        for (let i of Util.range(1)) {
            this.data.push({
                x: randomX(),
                y: randomY()
            })
        }
    }

    private dummy() {
        setTimeout(() => {
            const randomX = d3.randomInt(0, 600);
            const randomY = d3.randomInt(0, 600);
            this.data.forEach(d => {
                d.x = randomX()
                d.y = randomY()
            })
            this.data.push({
                x: randomX(),
                y: randomY(),
            })
            this.dummy()
            this.updateLayout();
        }, 1000);
    }

    public override initializeLayout() {
        super.initializeLayout();
        this._path = this._plotRoot?.classed('plot-line', true)
            .append('path')
            .attr('fill', 'none')


        // prepare the points, 
        // but points are created in update as the sample count might have changed
        this._points = this._plotRoot!
            .selectAll('.plot-point')
            .data(this.data)
    }

    private appendPoint(points: D3Selection<T>): D3Selection<T> {
        return points.append('circle')
            .classed('plot-point', true)
            .attr('r', 4)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
    }

    public override updateLayout() {
        if (!this._path || !this._points) {
            return
        }
        this._points = this._plotRoot!
            .selectAll('.plot-point')
            .data(this.data)
            .join(
                // add new sample points
                enter => this.appendPoint(enter),
                // update remaining points
                update => update.transition()
                    .duration(1000)
                    .attr('cx', d => d.x)
                    .attr('cy', d => d.y)
                ,
            )

        const rect = this.getPlotArea();
        const maxY = 600; // d3.max(data, d => d.y);
        this._plotRoot?.attr('transform', `translate(${rect.left}, ${rect.height - maxY!})`)

        const line = d3.line<T>()
            .x((d) => d.x)
            .y((d) => d.y)
            ;

        this._path
            .transition()
            .duration(1000)
            .attr('d', line(this.data))
    }

}