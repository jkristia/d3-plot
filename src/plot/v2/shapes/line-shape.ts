import * as d3 from "d3";
import { Point, D3Selection, Rect } from "../../util";
import { ShapeOptions, Shape } from "./shape";

export interface LineShapeOptions extends ShapeOptions {}

export class LineShape extends Shape {
	protected _points: (Point | null)[];

	private get lineType(): d3.CurveFactory {
		// return d3.curveCatmullRom.alpha(0)
		// return d3.curveMonotoneX

		// if (this.options?.curveType === 'smooth') {
		//     return d3.curveMonotoneX
		// }
		return d3.curveLinear;
	}

	constructor(points: (Point | null)[], options?: LineShapeOptions) {
		super(options)
		this._points = points
	}
	public initialize(parentElm: D3Selection): this {
		this._parentElm = parentElm;
		this._elm = this._parentElm.append('path')
		this.setOptionsToElm(this._elm);


		return this;
	}
	public override updateLayout(area: Rect): this {
		// generate line
		const line = d3.line<Point | null>()
			.x((d) => this.xPoint(d))
			.y((d) => this.yPoint(d))
			// https://d3js.org/d3-shape/line#line_defined
			.defined(d => d !== null) // allow for discontinuous line
			// https://d3js.org/d3-shape/curve
			.curve(this.lineType)
			;
		this._elm!
			.attr('d', line(this._points))

		return this;
	}

	private yPoint(point: Point | null): number {
		return this.scale?.yScale(point?.y || 0) || 0;
	}
	private xPoint(point: Point | null): number {
		return this.scale?.xScale(point?.x || 0) || 0;
	}

}

