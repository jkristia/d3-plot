import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Frame, Plot } from './plot';

@Component({
	selector: 'comp1',
	standalone: true,
	imports: [],
	templateUrl: './comp1.component.html',
	styleUrl: './comp1.component.scss'
})
export class Comp1Component implements OnInit, OnDestroy {
	private _plot!: Plot
	private _plotAnchorElm!: HTMLElement;
	constructor(
		private _elm: ElementRef
	) { }

	private onResize = (e: any) => {
		const size = this._plotAnchorElm.getBoundingClientRect();
		this._plot.size({
			width: size.width,
			height: size.height,
		})
		console.log(this._plot.plot())

	}
	ngOnInit(): void {
		const elm = this._elm.nativeElement as HTMLElement;
		this._plotAnchorElm = elm.querySelector('.d3-container') as HTMLElement
		this._plot = new Plot(this._plotAnchorElm, {
			plots: [
				new Frame({ cssClasses: ['custom-b'] })
					.area(() => { return { left: 0, top: 0, width: 100, height: 100 } })
				,
			]
		})
		window.addEventListener('resize', this.onResize);
		this.onResize(null)
	}
	ngOnDestroy(): void {
		window.removeEventListener('resize', this.onResize);
	}
}
