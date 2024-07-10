import * as d3 from 'd3';
import { Rect, D3Selection } from '../util';
import { PlotItem } from './plot.item';
import { IPlotItem, IPlotOwner } from './plot.interface';
import { Scale } from './elements';

export class PlotArea implements IPlotOwner {
	public root?: D3Selection;
	public background: D3Selection;
	public rect: Rect = new Rect();
	public plots: PlotItem[] = [];
	// allow initialize even if rect is empty, this is for the center / main plot area
	public forceInitialize = false;
	constructor(root?: D3Selection) {
		this.root = root;
		this.background = d3.create('svg:rect')
		if (root) {
			root.append(() => this.background.node())
				.classed('plot-background', true)
		}
	}
	public applyRect(): D3Selection {
		this.root!
			.attr('x', this.rect.left)
			.attr('y', this.rect.top)
			.attr('width', this.rect.width)
			.attr('height', this.rect.height)

		this.background
			.attr('x', 0)
			.attr('y', 0)
			.attr('width', this.rect.width)
			.attr('height', this.rect.height)

		return this.root!;
	}
	public initializeLayout() {
		if (this.forceInitialize === false && this.rect.isEmpty) {
			return;
		}
		this.plots.forEach(p => {
			p.setOwner(this);
			p.initializeLayout();
			if (p.plotElement) {
				this.root?.append(() => p.plotElement!.node())
			}
		});
		// ---
		this.cursorText = this.root?.append('text').classed('cursor-text', true)
		this.root?.call(this.d3zoom)
			.on('mouseenter', e => this.showCursor())
			.on('mouseleave', e => this.hideCursor())
			.on('mousemove', e => this.handleMouseMove(e))
	}

	private cursorText?: D3Selection;

	public updateLayout() {
		if (this.rect.isEmpty) {
			return;
		}
		// area passed to plot is the area of canvas, meaning sarts at (0,0)
		const r = new Rect({ left: 0, top: 0, width: this.rect.width, height: this.rect.height });
		(this.plots || []).forEach(p => {
			p.updateLayout(r)
		});
	}
	public setHoverItem(item: IPlotItem): void {
		console.log(`set hover id-${item.id}`);
	}
	public clearHoverItem(item: IPlotItem): void {
		console.log(`clear hover id-${item.id}`);
	}

	protected _scale: Scale = new Scale();
	public setScale(scale: Scale): this {
		this._scale = scale;
		return this;
	}


	private hideCursor() {
		this.cursorText?.classed('hidden', true);
		// this.cursorIndicator.classed('hidden', true);
		// this.cursorIndicator.attr('transform', 'translate(-100, 0)');
	}
	private showCursor() {
		this.cursorText?.classed('hidden', false)
		// this.cursorIndicator.classed('hidden', false)
	}


	private currentMousePosition(anyEvent: any): [number, number] {
		const elm = this.root!;
		const coordinates = d3.pointer(anyEvent, elm.node())
		return coordinates;
	}
	private zoomHandleWheel = (e: d3.D3ZoomEvent<any, any>) => {
		// https://d3js.org/d3-zoom#zoomTransform
		// console.log(this.xScale.domain())
		console.log('handleZoom', e.sourceEvent)
		const tr = e.transform;
		// const newScale = tr.k;

		if (e.sourceEvent.type === 'mousemove' && e.sourceEvent.deltaY === undefined) {
			this.handleMouseMove(e)
			return
		}
		if (e.sourceEvent.deltaY !== undefined) {
			// const direction = e.sourceEvent.deltaY > 0 ? -1 : 1
			// let start = this.xScale.domain()[0];
			// let end = this.xScale.domain()[1];
			// const coordinates = this.currentMousePosition(e);
			// const mouseXPos = this.xScale.invert(coordinates[0])
			// let scale = 1;
			// if (direction > 0) {
			// 	scale = 0.9
			// }
			// if (direction < 0) {
			// 	scale = 1.1
			// }
			// // update range based on scale
			// let diff = (mouseXPos - start) * scale;
			// start = mouseXPos - diff;
			// // from mouse to end
			// diff = (end - mouseXPos) * scale;
			// end = mouseXPos + diff;
			// this.zoomUpdateDomain(start, end)
		}
	}


	private handleMouseMove(e: any) {
		const elm = this.root;
		const txt = this.cursorText;
		if (!txt) {
			return;
		}
		const coordinates = this.currentMousePosition(e)
		const xPos = coordinates[0];
		const yPos = coordinates[1];
		const xValue = this._scale.xScale.invert(xPos)
		const yValue = this._scale.yScale.invert(yPos)
		txt
			.attr('x', xPos)
			.attr('y', yPos - 2)
			.text(d => `(${xValue.toFixed(0)}, ${yValue.toFixed()}}`)
		// this.cursorIndicator
		// 	.attr('transform', `translate(${xPos}, 0)`);
		// this.updateTooltipPosition(e)
	}



	private zoomHandleWheelPan = (e: WheelEvent) => {
		const direction = e.deltaY > 0 ? -1 : 1

		console.log(`zoomHandleWheelPan(${direction})`)

		// let start = this.xScale.domain()[0];
		// let end = this.xScale.domain()[1];
		// const diff = end - start;
		// const offset = diff * 0.05; // pan 5% on scroll
		// if (e.deltaX < 0) {
		// 	// pan left 
		// 	start -= offset;
		// 	end -= offset
		// }
		// if (e.deltaX > 0) {
		// 	// pan right 
		// 	start += offset;
		// 	end += offset
		// }
		// this.zoomUpdateDomain(start, end)
	}

	private zoomUpdateDomain(start: number, end: number) {
		// clamp to min max domain
		console.log(`zoomUpdateDomain(${start}, ${end})`)
		// const minmaxDomain = this.defaultDomain;
		// if (start < minmaxDomain[0]) {
		// 	const diff = minmaxDomain[0] - start;
		// 	start = minmaxDomain[0];
		// 	end += diff;
		// }
		// if (end > minmaxDomain[1]) {
		// 	const diff = end - minmaxDomain[1];
		// 	end = minmaxDomain[1];
		// 	start -= diff;
		// }
		// if (end - start < this.maxZoomDiffValue) {
		// 	// do not zoom in further
		// 	return;
		// }
		// start = Math.max(start, minmaxDomain[0])
		// end = Math.min(end, minmaxDomain[1])
		// this.xScale.domain([start, end])
		// this.updateSizeAndRender()
	}

	private d3zoom = d3.zoom()
		// .filter(event => {
		// 	if (event instanceof WheelEvent && event.shiftKey) {
		// 		// shift wheel is not propagated through zoom
		// 		// call it directly from here to pan
		// 		this.zoomHandleWheelPan(event)
		// 		return false;
		// 	}
		// 	// https://d3js.org/d3-zoom#zoom_filter
		// 	return (!event.ctrlKey || event.type === 'wheel') && !event.button;
		// })
		.on('zoom', this.zoomHandleWheel)


		// private setHover(e: any, elm: SVGElement/*, data: CompactedWorkloadNode*/) {
		//     // console.log('set hover')
		//     d3.select(elm).transition()
		//         .duration(50)
		//         .attr('opacity', '.70');
		//     // if (!this.tooltip) {
		//     //     this.tooltip = this.root.append('div')
		//     //         .classed('tooltip', true)
		//     // }
	
		//     // this.tooltip.style('opacity', 1)
		//     // this.tooltip.text(`Duration: ${data.durationMicros} us`)
		//     // this.updateTooltipPosition(e)
		// }
		// private clearHover(elm: SVGElement) {
		//     // console.log('clear hover')
		//     d3.select(elm).transition()
		//         .duration(50)
		//         .attr('opacity', '1');
		//     // this.tooltip?.style('opacity', 0)
	
		//     // this.tooltip = null;
		//     // this.root.select('.tooltip').remove()
		// }
}
