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

	protected _circleElms?: D3Selection<Circle | null>[]
	public override updateLayout(area: Rect): this {
		if (!this._circleElms) {
			this._circleElms = [];
			this._circles.forEach( c => {
				this._circleElms!.push(this.appendPoint(c))

			})
		}
		return this;
	}
	private appendPoint(point: Circle | null): D3Selection<Circle | null> {
		const circle = this._parentElm!.append('circle')
			.attr('r', point?.radius || 1)
			.attr('cx', this.xPoint(point?.pos || null))
			.attr('cy', this.yPoint(point?.pos || null))
		this.setOptionsToElm(circle);
		return circle;
	}
	private yPoint(point: Point | null): number {
		return this.scale?.yScale(point?.y || 0) || 0;
	}
	private xPoint(point: Point | null): number {
		return this.scale?.xScale(point?.x || 0) || 0;
	}
}
