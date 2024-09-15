import * as d3 from 'd3';
import { Rect, D3Selection, Point } from '../util';
import { IPlotItem, IPlotOwner } from './plot.interface';
import { Scale } from './elements';
import { ICursor } from './plot.cross-cursor';
import { IPlotArea } from './plot.area';


export class PlotMouseHandler implements IPlotOwner {

	private _container?: D3Selection;
	private _rootElm?: D3Selection;
	private _cursor?: ICursor;
	private _owner?: IPlotArea;
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
		this._owner = owner;
		this._rootElm = owner.rootElm;
		this._container = this._rootElm?.append('g').classed('cursor', true)
		this._cursor?.initialize(this._container);
		// this._container!
		// https://stackoverflow.com/questions/33106742/d3-add-more-than-one-functions-to-an-eventlistener
		// add name space to listener, allows for multiple listeners on the same event
		owner.rootElm
			.on('pointermove.mousehandler', e => this.handleMouseMove(e))
	}
	public updateLayout(area: Rect): void {
	}
	public setHoverItem(item: IPlotItem): void {
		// console.log(`set hover id-${item.id}`);
	}
	public clearHoverItem(item: IPlotItem): void {
		// console.log(`clear hover id-${item.id}`);
	}
    private currentMousePosition(event: Event): Point {
		const elm = this._rootElm!;
		const coordinates = d3.pointer(event, elm.node())
		return { x: coordinates[0], y: coordinates[1] };
	}
	private handleMouseMove(e: any) {
		const point = this.currentMousePosition(e)
		const visible = this._owner?.contentAreaRect.inRect(point.x, point.y);
		this._container?.classed('hidden', !visible);
		this._cursor?.updatePosition(this._scale, point.x, point.y, this._scale.area);
	}
}
