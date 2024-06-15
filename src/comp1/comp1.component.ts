import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Plot } from './plot';

@Component({
	selector: 'comp1',
	standalone: true,
	imports: [],
	templateUrl: './comp1.component.html',
	styleUrl: './comp1.component.scss'
})
export class Comp1Component implements OnInit, OnDestroy {
	private _plot: Plot
	constructor(
		private _elm: ElementRef
	) {
		const elm = this._elm.nativeElement as HTMLElement;
		this._plot = new Plot(elm)
	}

	private onResize = (e: any) => {
		const elm = this._elm.nativeElement as HTMLElement;
		const size = elm.getBoundingClientRect();
		this._plot.size({
			width: size.width,
			height: size.height
		})
		console.log(this._plot.plot())

	}
	ngOnInit(): void {
		window.addEventListener('resize', this.onResize);
		this.onResize(null)
	}
	ngOnDestroy(): void {
		window.removeEventListener('resize', this.onResize);
	}
}
