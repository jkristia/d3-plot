import * as d3 from "d3";
import { PlotItem } from "../plot.item";
import { Margin, Rect } from "../../util";
import { Shape } from "./shape";

export class ShapePlot extends PlotItem {

	constructor(private _shapes: Shape[]) {
		super();
	}
	public override initializeLayout() {
		this._rootElm = d3.create('svg:g').classed('shapes-elm', true)
		this._shapes.forEach(s => s.initialize(this._rootElm!))
	}
	public override updateLayout(area: Rect) {
		const r = area.adjustMargin(this.margin)
		this._shapes.forEach(s => {
			s.scale = this.scale;
			s.updateLayout(area)
		})
	}
}