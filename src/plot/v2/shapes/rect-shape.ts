
import * as d3 from 'd3';
import { D3Selection, Point, Rect, Size } from "../../util";
import { Scale } from '../elements';
import { ShapeOptions, Shape } from './shape';

export interface RectShapeOptions extends ShapeOptions {}
export interface RectInfo {
	x: number;
	y: number;
	width: number;
	height: number;
	rx?: number;
	ry?: number;

	// text: string;
	// alignment: 'left' | 'center' | 'right'
}

export class RectShape extends Shape {
	protected _rects: (RectInfo | null)[];
	constructor(rects: (RectInfo | null)[], options?: RectShapeOptions) {
		super(options)
		this._rects = rects
	}
	public initialize(parentElm: D3Selection): this {
		this._parentElm = parentElm;
		return this;
	}

	private _rectElms?: D3Selection[];
	public override updateLayout(area: Rect): this {
		if (!this._rectElms) {
			this._rectElms = [];
			this._rects.forEach( t => {
				this._rectElms?.push(this.appendRect(t!))
			})
		}
		return this;
	}
	private appendRect(rect: RectInfo): D3Selection<RectInfo | null> {
		// let anchor = (text: RectInfo | null): string => {
		// 	if (text?.alignment === 'center') {
		// 		return 'middle';
		// 	}
		// 	if (text?.alignment === 'right') {
		// 		return 'end';
		// 	}
		// 	return 'start';
		// }
		const rectElm = this._parentElm!.append('rect')
		// 	.text(text.text)
		// 	.attr('text-anchor', anchor(text))
		// 	.attr('dominant-baseline', 'middle')
			.attr('x', this.xPoint(rect.x))
			.attr('y', this.yPoint(rect.y + rect.height))
            .attr('rx', rect.rx || 0)
			.attr('ry', rect.rx || rect.ry || 0)
            .attr('width', rect.width)
            .attr('height', rect.height)

		this.setOptionsToElm(rectElm);
		return rectElm;
	}
	private yPoint(y: number): number {
		return this.scale?.yScale(y) || 0;
	}
	private xPoint(x: number): number {
		return this.scale?.xScale(x) || 0;
	}
}
