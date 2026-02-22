import { Component, ElementRef, OnDestroy, OnInit, input } from '@angular/core';
import { Plot } from '../plot';

/*
*	PlotBaseComponent is used for attached d3 plot to angular component and enable resizing of d3 plot
*/
@Component({
	selector: 'plot-base',
	standalone: true,
	imports: [],
	templateUrl: './plot.component.html',
	styleUrls: ['./plot.component.scss']
})
export class PlotBaseComponent implements OnInit, OnDestroy {

	public plot = input<Plot | null>(null);

	protected _plotAnchorElm!: HTMLElement;

	public constructor(
		private _elm: ElementRef
	) { }
	public ngOnInit(): void {
		const elm = this._elm.nativeElement as HTMLElement;
		this._plotAnchorElm = elm.querySelector('.plot-d3-container') as HTMLElement
		if (this.plot()) {
			this.plot()!.attach(this._plotAnchorElm);
		}
		window.addEventListener('resize', this.onResize);
		this.onResize(null)
		setTimeout(() => {
			this.onResize(null)
		});
	}
	public ngOnDestroy(): void {
		window.removeEventListener('resize', this.onResize);
	}
	private onResize = (e: any) => {
		const size = this._plotAnchorElm.getBoundingClientRect();
		this.plot()?.size({
			width: size.width,
			height: size.height,
		})
	}
}
