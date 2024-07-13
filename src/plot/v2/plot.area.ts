import * as d3 from 'd3';
import { Rect, D3Selection } from '../util';
import { PlotItem } from './plot.item';
import { IPlotItem, IPlotOwner } from './plot.interface';
import { Scale } from './elements';
import { PlotMouseHandler } from './plot.mousehandler';


export class PlotArea implements IPlotOwner {

	protected _mouseHandler?: PlotMouseHandler;
	protected _scale: Scale = new Scale();

	public rootElm?: D3Selection;
	public background: D3Selection;
	public rect: Rect = new Rect();
	public plots: PlotItem[] = [];
	// allow initialize even if rect is empty, this is for the center / main plot area
	public forceInitialize = false;
	public get scale(): Scale {
		return this._scale;
	}
	constructor(root?: D3Selection) {
		this.rootElm = root;
		this.background = d3.create('svg:rect')
		if (root) {
			root.append(() => this.background.node())
				.classed('plot-background', true)
		}
	}
	public applyRect(): D3Selection {
		this.rootElm!
			.attr('x', this.rect.left)
			.attr('y', this.rect.top)
			.attr('width', this.rect.width)
			.attr('height', this.rect.height)

		this.background
			.attr('x', 0)
			.attr('y', 0)
			.attr('width', this.rect.width)
			.attr('height', this.rect.height)

		return this.rootElm!;
	}
	public initializeLayout() {
		if (this.forceInitialize === false && this.rect.isEmpty) {
			return;
		}
		// this._mouseHandler?.initializeLayout(this.rootElm!);
		this.plots.forEach(p => {
			p.setOwner(this);
			p.initializeLayout();
			if (p.plotElement) {
				this.rootElm?.append(() => p.plotElement!.node())
			}
		});
		this._mouseHandler?.initializeLayout(this.rootElm!);
	}

	public updateLayout() {
		if (this.rect.isEmpty) {
			return;
		}
		// area passed to plot is the area of canvas, meaning sarts at (0,0)
		const r = new Rect({ left: 0, top: 0, width: this.rect.width, height: this.rect.height });
		(this.plots || []).forEach(p => {
			p.updateLayout(r);
		});
		this._mouseHandler?.updateLayout(r);
	}
	public setHoverItem(item: IPlotItem): void {
		this._mouseHandler?.setHoverItem(item);
	}
	public clearHoverItem(item: IPlotItem): void {
		this._mouseHandler?.clearHoverItem(item);
	}

	public setMouseHandler(handler: PlotMouseHandler): this {
		this._mouseHandler = handler;
		this._mouseHandler.setScale(this._scale);
		return this;
	}
	public setScale(scale: Scale): this {
		this._scale = scale;
		this._mouseHandler?.setScale(scale);
		return this;
	}
}
