import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { PlotBaseV1Component } from '../../../plot/v1/plot-component/plot.component';
import { TransitionLineDemo } from './transition-line-demo';
import { PlotV1, Frame } from '../../../plot';



@Component({
	selector: 'transition-line-demo',
	standalone: true,
	imports: [
		PlotBaseV1Component		
	],
  templateUrl: './transition-line.component.html',
  styleUrl: './transition-line.component.scss'
})
export class TransitionLineComponent {
	public plot: PlotV1
	constructor(
		private _elm: ElementRef
	) {
		this.plot = new PlotV1(null, {
			margin: { left: 5, top: 5, right: 5, bottom: 5},
			plots: [
				new Frame(),
				new TransitionLineDemo({ cssClasses: ['custom-a'] }),
			]
		})
	}
}
