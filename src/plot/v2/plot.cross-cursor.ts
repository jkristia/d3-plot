import { D3Selection, Rect } from "../util";
import { Scale } from "./elements";

export function adjust(v: number): number {
	// add 1/2 pixel to get a thin 1px line horz or vertical
	return v + 0.5;
}
export interface ICursor {
	initialize(rootElm: D3Selection): void;
	updatePosition(scale: Scale, xPos: number, yPos: number, area: Rect): void;
}

export class CrossCursor implements ICursor {
	constructor() {
	}
	private _cursorText?: D3Selection;
	private _l1?: D3Selection;
	private _l2?: D3Selection;

	initialize(rootElm: D3Selection) {
		this._cursorText = rootElm.append('text').classed('cursor-text', true);
		this._l1 = rootElm.append('line').classed('cross-hair', true);
		this._l2 = rootElm.append('line').classed('cross-hair', true);
	}
	updatePosition(scale: Scale, xPos: number, yPos: number, area: Rect) {
		this._l1!
			.attr('x1', adjust(xPos))
			.attr('x2', adjust(xPos))
			.attr('y1', area.top)
			.attr('y2', area.bottom);
		this._l2!
			.attr('x1', area.left)
			.attr('x2', area.right)
			.attr('y1', adjust(yPos))
			.attr('y2', adjust(yPos));

		const xValue = scale.xScale.invert(xPos);
		const yValue = scale.yScale.invert(yPos);
		this._cursorText!
			.attr('x', adjust(xPos + 32))
			.attr('y', adjust(yPos - 8))
			.text(d => `(${xValue.toFixed(2)}, ${yValue.toFixed(2)}}`);
	}
}
