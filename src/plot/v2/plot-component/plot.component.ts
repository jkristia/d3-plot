import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { PlotV2 } from '../plot';

/*
*	PlotBaseComponent is used for attached d3 plot to angular component and enable resizing of d3 plot
*/
@Component({
	selector: 'plot-v2-base',
	standalone: true,
	imports: [],
	templateUrl: './plot.component.html',
	styleUrls: ['./plot.component.scss', '../plot-styles.scss']
})
export class PlotBaseComponent implements OnInit, OnDestroy {

	@Input() plot: PlotV2 | null = null;

	protected _plotAnchorElm!: HTMLElement;

	constructor(
		private _elm: ElementRef
	) { }
	ngOnInit(): void {
		const elm = this._elm.nativeElement as HTMLElement;
		this._plotAnchorElm = elm.querySelector('.d3-container') as HTMLElement
		if (this.plot) {
			this.plot.attach(this._plotAnchorElm);
		}
		window.addEventListener('resize', this.onResize);
		this.onResize(null)
		setTimeout(() => {
			this.onResize(null)
		});
	}
	ngOnDestroy(): void {
		window.removeEventListener('resize', this.onResize);
	}
	private onResize = (e: any) => {
		const size = this._plotAnchorElm.getBoundingClientRect();
		this.plot?.size({
			width: size.width,
			height: size.height,
		})
	}
}
