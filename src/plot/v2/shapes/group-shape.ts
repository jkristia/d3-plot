import { D3Selection, Rect } from "../../util";
import { ShapeOptions, Shape } from "./shape";

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

