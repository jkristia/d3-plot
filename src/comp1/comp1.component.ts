import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Plot } from '../plot/plot';
import { Frame, TransitionLineDemo } from '../plot/plot-types';
import { PlotBaseComponent } from '../plot/plot-component/plot.component';

@Component({
	selector: 'comp1',
	standalone: true,
	imports: [
		PlotBaseComponent		
	],
	templateUrl: './comp1.component.html',
	styleUrl: './comp1.component.scss'
})
export class Comp1Component {
	public plot: Plot
	constructor(
		private _elm: ElementRef
	) {
		this.plot = new Plot(null, {
			plots: [
				new Frame(),
				new TransitionLineDemo({ cssClasses: ['custom-a'] }),
			]
		})
	}
}
