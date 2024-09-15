import * as d3 from 'd3';
import { Rect, D3Selection } from '../util';
import { PlotItem } from './plot.item';
import { IPlotItem, IPlotOwner } from './plot.interface';
import { Scale } from './elements';
import { PlotMouseHandler } from './plot.mousehandler';

export interface IPlotArea extends IPlotOwner {
	readonly rootElm: D3Selection;
	readonly contentAreaElm: D3Selection;
	readonly contentAreaRect: Rect;
}

export class PlotArea implements IPlotOwner {

	protected _mouseHandler?: PlotMouseHandler;
	protected _scale: Scale = new Scale();

	private _rootElm?: D3Selection;
	private _background: D3Selection;
	private _contentArea: D3Selection;

	public get rootElm(): D3Selection {
		return this._rootElm!;
	}
	public get contentAreaElm(): D3Selection {
		return this._contentArea!;
	}

	public rect: Rect = new Rect();
	public plots: PlotItem[] = [];
	// allow initialize even if rect is empty, this is for the center / main plot area
	public forceInitialize = false;
	public get scale(): Scale {
		return this._scale;
	}
	public get contentAreaRect(): Rect {
		return new Rect({
			left: this.scale.margin.left,
			top: this.scale.margin.top,
			width: this.rect.width - this.scale.margin.left - this.scale.margin.right,
			height: this.rect.height - this.scale.margin.top - this.scale.margin.bottom,
		});


	}
	constructor(root?: D3Selection) {
		this._rootElm = root;
		this._background = d3.create('svg:rect')
		this._contentArea = d3.create('svg:rect')
		if (root) {
			root.append(() => this._background.node())
				.classed('plot-background', true)
			root.append(() => this._contentArea.node())
				.classed('plot-content-area', true)
		}
	}
	public applyRect(): D3Selection {
		this._rootElm!
			.attr('x', this.rect.left)
			.attr('y', this.rect.top)
			.attr('width', this.rect.width)
			.attr('height', this.rect.height)

		this._background
			.attr('x', 0)
			.attr('y', 0)
			.attr('width', this.rect.width)
			.attr('height', this.rect.height)

		const r = this.contentAreaRect;
		this._contentArea
			.attr('x', r.left)
			.attr('y', r.top)
			.attr('width', r.width)
			.attr('height', r.height)
		return this._rootElm!;
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
				this._rootElm?.append(() => p.plotElement!.node())
			}
		});
		this._mouseHandler?.initializeLayout(this);
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
