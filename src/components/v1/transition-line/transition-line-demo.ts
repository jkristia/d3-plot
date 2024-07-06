import * as d3 from "d3";
import { PlotTypeBase } from "../../../plot/v1/plot-types/plottype";
import { IPlotTypeOptionsV1 } from "../../../plot";
import { D3Selection, Util } from "../../../plot/util";

type Point = { x: number, y: number };

export class TransitionLineDemo extends PlotTypeBase {

    private data: Point[] = []
    private _path?: D3Selection;
    private _points?: D3Selection<Point>;
    private _delay = 1000;

    constructor(options?: IPlotTypeOptionsV1) {
        super(options)
    }
    private fillData() {
        const area = this.getPlotArea();
        const randomX = d3.randomInt(area.left, area.right);
        const randomY = d3.randomInt(area.top, area.bottom);
        for (let i of Util.range(20)) {
            this.data.push({
                x: randomX(),
                y: randomY()
            })
        }
    }

    private dummy() {
        const area = this.getPlotArea()
        setTimeout(() => {
            const randomX = d3.randomInt(area.left, area.right);
            const randomY = d3.randomInt(area.top, area.bottom);
            this.data.forEach(d => {
                d.x = randomX()
                d.y = randomY()
            })
            // clamp a few lines to see boundary
            this.data[0].x = area.left
            this.data[0].y = area.top
            this.data[1].x = area.right
            this.data[1].y = area.bottom

            this.data[2].x = area.right
            this.data[2].y = area.top

            this.data[3].x = area.left
            this.data[3].y = area.bottom

            this.dummy()
            this.updateLayout();
        }, this._delay);
    }

    public override initializeLayout() {
        super.initializeLayout();
        this.fillData();
        this.dummy();
        this._path = this._plotRoot?.classed('plot-line', true)
            .append('path')
            .attr('fill', 'none')

        // prepare the points, 
        // but points are created in update as the sample count might have changed
        this._points = this._plotRoot!
            .selectAll('.plot-point')
            .data(this.data)
    }

    private appendPoint(points: D3Selection<Point>): D3Selection<Point> {
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
                    .duration(this._delay)
                    .attr('cx', d => d.x)
                    .attr('cy', d => d.y)
                ,
            )

        // const rect = this.getPlotArea();
        // const maxY = 0;//600; // d3.max(data, d => d.y);
        // this._plotRoot?.attr('transform', `translate(${rect.left}, ${rect.height - maxY!})`)

        const line = d3.line<Point>()
            .x((d) => d.x)
            .y((d) => d.y)
            ;

        this._path
            .transition()
            .duration(this._delay)
            .attr('d', line(this.data))
    }

}