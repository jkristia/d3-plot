import * as d3 from 'd3';
import { D3Selection, Point, Rect } from "../../util";
import { Scale } from '../elements';
import { ShapeOptions, Shape } from './shape';

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
		return this;
	}
	public override updateLayout(area: Rect): this {

		if (!this._elm) {
			this._elm = this._parentElm!
				.selectAll('circle')
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
