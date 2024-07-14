import * as d3 from 'd3';
import { D3Selection, Point, Rect } from "../../util";
import { Scale } from '../elements';

export interface ShapeOptions {
	id?: string;
	cssClasses?: string[];
	offset?: Point;
}

export abstract class Shape {
	protected _parent: Shape | null = null;
	protected _parentElm: D3Selection | null = null;
	protected _elm: D3Selection | null = null;
	protected _scale?: Scale;
	protected _options: ShapeOptions;

	public get scale(): Scale | null {
		if (this._scale) {
			return this._scale;
		}
		if (!this._parent?.scale) {
			throw 'missing scale, must be set at the root level of the shape'
		}
		return this._parent?.scale || null;
	}
	public set scale(value: Scale) {
		this._scale = value;
	}
	constructor(options?: ShapeOptions) {
		this._options = options || {}
	}
	public setParent(parent: Shape) {
		this._parent = parent;
	}
	public abstract initialize(parentElm: D3Selection): this;
	public updateLayout(area: Rect): this {
		return this;
	}

	protected options<T extends ShapeOptions = ShapeOptions>(): T {
		return this._options as T;
	}
	protected setOptionsToElm(elm: D3Selection) {
		const options = this.options()
		if (options.id) {
			elm.attr('id', options.id)
		}
		if (options.cssClasses) {
			elm.classed(options.cssClasses.join(' '), true)
		}
		if (options.offset) {
			const p = options.offset;
			elm.attr('transform', `translate(${p.x}, ${-p.y})`)
		}
	}
}

export interface GroupShapeOptions extends ShapeOptions {}

export class GroupShape extends Shape {
	protected _children: Shape[];
	constructor(children?: Shape[], options?: GroupShapeOptions) {
		super(options)
		this._children = children || [];
		this._children?.forEach(c => c.setParent(this));
	}
	public initialize(parentElm: D3Selection): this {
		this._parentElm = parentElm;
		this._elm = this._parentElm.append('g')
		this.setOptionsToElm(this._elm);
		this._children?.forEach(c => c.initialize(this._elm!));
		return this;
	}
	public override updateLayout(area: Rect): this {
		this._children?.forEach(c => c.updateLayout(area));
		return this;
	}
}

export interface LineShapeOptions extends ShapeOptions {}

export class LineShape extends Shape {
	protected _points: (Point | null)[];

	private get lineType(): d3.CurveFactory {
		return d3.curveCatmullRom.alpha(0)
		// return d3.curveMonotoneX

		// if (this.options?.curveType === 'smooth') {
		//     return d3.curveMonotoneX
		// }
		// return d3.curveLinear;
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

export interface CircleShapeOptions extends ShapeOptions {}
export interface Circle {
	pos: Point;
	radius: number
}

export class CircleShape extends Shape {
	protected _circles: (Circle | null)[];
	constructor(circles: (Circle | null)[], options?: CircleShapeOptions) {
		super(options)
		this._circles = circles
	}
	public initialize(parentElm: D3Selection): this {
		this._parentElm = parentElm;
		// this._elm = this._parentElm.append('circle')
		// this.setOptionsToElm(this._elm);


		return this;
	}
	public override updateLayout(area: Rect): this {

		if (!this._elm) {
			this._elm = this._parentElm!
				.selectAll('.xyz')
				.data(this._circles)
				.join(
					// add new sample points
					enter => this.appendPoint(enter),
					// update remaining points
					update => update
						.attr('cx', d => this.xPoint(d?.pos || null))
						.attr('cy', d => this.yPoint(d?.pos || null))
					,
				)
			this.setOptionsToElm(this._elm);

		}

		return this;
	}

	private appendPoint(points: D3Selection<Circle | null>): D3Selection<Circle | null> {
		const circle = points.append('circle')
			.attr('r', d=> d?.radius || 1)
			.attr('cx', d => this.xPoint(d?.pos || null))
			.attr('cy', d => this.yPoint(d?.pos || null))
		return circle;
	}


	private yPoint(point: Point | null): number {
		return this.scale?.yScale(point?.y || 0) || 0;
	}
	private xPoint(point: Point | null): number {
		return this.scale?.xScale(point?.x || 0) || 0;
	}

}
