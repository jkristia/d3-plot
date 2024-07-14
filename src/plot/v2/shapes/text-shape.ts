
import * as d3 from 'd3';
import { D3Selection, Point, Rect } from "../../util";
import { Scale } from '../elements';
import { ShapeOptions, Shape } from './shape';

export interface TextShapeOptions extends ShapeOptions {}
export interface Text {
	pos: Point;
	text: string;
	alignment: 'left' | 'center' | 'right'
}

export class TextShape extends Shape {
	protected _texts: (Text | null)[];
	constructor(Texts: (Text | null)[], options?: TextShapeOptions) {
		super(options)
		this._texts = Texts
	}
	public initialize(parentElm: D3Selection): this {
		this._parentElm = parentElm;
		return this;
	}

	private _textElms?: D3Selection[];
	public override updateLayout(area: Rect): this {
		if (!this._textElms) {
			this._textElms = [];
			this._texts.forEach( t => {
				this._textElms?.push(this.appendText(t!))
			})
		}
		return this;
	}
	private appendText(text: Text): D3Selection<Text | null> {
		let anchor = (text: Text | null): string => {
			if (text?.alignment === 'center') {
				return 'middle';
			}
			if (text?.alignment === 'right') {
				return 'end';
			}
			return 'start';
		}
		const textElm = this._parentElm!.append('text')
			.text(text.text)
			.attr('text-anchor', anchor(text))
			.attr('dominant-baseline', 'middle')
			.attr('x', this.xPoint(text?.pos || null))
			.attr('y', this.yPoint(text?.pos || null))
		this.setOptionsToElm(textElm);
		return textElm;
	}
	private yPoint(point: Point | null): number {
		return this.scale?.yScale(point?.y || 0) || 0;
	}
	private xPoint(point: Point | null): number {
		return this.scale?.xScale(point?.x || 0) || 0;
	}
}
