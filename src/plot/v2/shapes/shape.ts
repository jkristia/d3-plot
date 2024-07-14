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

