import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Plot } from '../../plot/plot';
import { Frame } from '../../plot/plot-types';
import { PlotBaseComponent } from '../../plot/plot-component/plot.component';
import { TransitionLineDemo } from './transition-line-demo';



@Component({
	selector: 'transition-line-demo',
	standalone: true,
	imports: [
		PlotBaseComponent		
	],
  templateUrl: './transition-line.component.html',
  styleUrl: './transition-line.component.scss'
})
export class TransitionLineComponent {
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
