import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Plot } from '../plot';

@Component({
	selector: 'plot-base',
	standalone: true,
	imports: [],
	templateUrl: './plot.component.html',
	styleUrls: ['./plot.component.scss', '../plot-style.scss']
})
export class PlotBaseComponent implements OnInit, OnDestroy {

	@Input() plot: Plot | null = null;

	protected _plotAnchorElm!: HTMLElement;

	constructor(
		private _elm: ElementRef
	) { }

	private onResize = (e: any) => {
		const size = this._plotAnchorElm.getBoundingClientRect();
		this.plot?.size({
			width: size.width,
			height: size.height,
		})
		console.log(this.plot?.plot())

	}
	ngOnInit(): void {
		const elm = this._elm.nativeElement as HTMLElement;
		this._plotAnchorElm = elm.querySelector('.d3-container') as HTMLElement
		if (this.plot) {
			this.plot.attach(this._plotAnchorElm)
		}
		window.addEventListener('resize', this.onResize);
		this.onResize(null)
	}
	ngOnDestroy(): void {
		window.removeEventListener('resize', this.onResize);
	}
}
