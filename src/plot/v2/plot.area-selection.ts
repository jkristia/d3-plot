import * as d3 from 'd3';
import { D3Selection, Point } from "../util";
import { PlotItem } from "./plot.item"

export class PlotAreaSelection extends PlotItem {

    private _rangeElm: D3Selection | null = null;

    public override initializeLayout(): void {
        super.initializeLayout();
		// https://stackoverflow.com/questions/33106742/d3-add-more-than-one-functions-to-an-eventlistener
		// add name space to listener, allows for multiple listeners on the same event
		this._owner?.contentAreaElm
			.on('pointerdown.selection', e => this.onPointerDown(e))
			.on('pointerup.selection', e => this.onPointerUp(e))
			.on('pointermove.selection', e => this.onPointerMove(e))
    }
    private onPointerDown(e: PointerEvent) {
        this.cleanup();
        const root = this._owner?.rootElm!;
        const child = this._owner?.contentAreaElm!;
        (child.node() as SVGElement).setPointerCapture(e.pointerId);
        this._rangeElm = root.insert('svg:rect', () => child.node().nextSibling)
        this._startRange = this.currentMousePosition(e);
        this._endRange = this.currentMousePosition(e);
        this.updateSelectionRange();
    }
    private onPointerUp(e: PointerEvent) {
        this._endRange = null;
        const child = this._owner?.contentAreaElm!;
        (child.node() as SVGElement).releasePointerCapture(e.pointerId);
        this.cleanup();
    }
    private onPointerMove(e: PointerEvent) {
        if (this._endRange) {
            this._endRange = this.currentMousePosition(e);
            this.updateSelectionRange();
        }
    }
    private _startRange: Point | null = null;
    private _endRange: Point | null = null;

	private updateSelectionRange() {
        if (!this._rangeElm) {
            return;
        }
        if (this._startRange && this._endRange) {
            const rArea = this._owner?.contentAreaRect!;
            const left = Math.min(this._startRange.x, this._endRange.x);
            const right = Math.max(this._startRange.x, this._endRange.x);
            const top = Math.min(this._startRange.y, this._endRange.y);
            const bottom = Math.max(this._startRange.y, this._endRange.y);
            const r = rArea.clamp(left, top, right, bottom)
            this._rangeElm
                .classed('range-selection', true)
                .attr('x', r.left)
                .attr('y', r.top)
                .attr('width', r.width)
                .attr('height', r.height)
        }
    }
    private currentMousePosition(anyEvent: any): Point {
		const elm = this._rootElm!;
		const coordinates = d3.pointer(anyEvent, elm.node())
		return { x: coordinates[0], y: coordinates[1] };
	}
    private cleanup() {
        if (this._rangeElm) {
            this._rangeElm.remove()
        }
        this._rangeElm = null;
        this._startRange = null;
        this._endRange = null;
    }
}