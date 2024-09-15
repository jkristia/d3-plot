import * as d3 from 'd3';
import { Rect, D3Selection } from '../util';
import { IPlotItem, IPlotOwner } from './plot.interface';
import { Scale } from './elements';
import { ICursor } from './plot.cross-cursor';
import { IPlotArea } from './plot.area';


export class PlotMouseHandler implements IPlotOwner {

	private _container?: D3Selection;
	private _rootElm?: D3Selection;
	private _cursor?: ICursor;
	protected _scale: Scale = new Scale();

    public get scale(): Scale {
        return this._scale;
    }
	public setScale(scale: Scale): this {
		this._scale = scale;
		return this;
	}
	public setCursor(cursor: ICursor): this {
		this._cursor = cursor;
		return this;
	}
	public initializeLayout(owner: IPlotArea) {
		// ---
		this._rootElm = owner.rootElm;
		this._container = this._rootElm?.append('g').classed('cursor', true)
		this._cursor?.initialize(this._container);
		// this._container!
		owner.contentAreaElm
			.on('pointerenter', e => this.showCursor())
			.on('pointerleave', e => this.hideCursor())
			.on('pointermove', e => this.handleMouseMove(e))
	}
	public updateLayout(area: Rect): void {
	}
	public setHoverItem(item: IPlotItem): void {
		// console.log(`set hover id-${item.id}`);
	}
	public clearHoverItem(item: IPlotItem): void {
		// console.log(`clear hover id-${item.id}`);
	}
	private hideCursor() {
		this._container?.classed('hidden', true);
	}
	private showCursor() {
		this._container?.classed('hidden', false)
	}

	private currentMousePosition(anyEvent: any): [number, number] {
		const elm = this._rootElm!;
		const coordinates = d3.pointer(anyEvent, elm.node())
		return coordinates;
	}
	private handleMouseMove(e: any) {
		const coordinates = this.currentMousePosition(e)
		const xPos = coordinates[0];
		const yPos = coordinates[1];
		this._cursor?.updatePosition(this._scale, xPos, yPos, this._scale.area);
	}
}
