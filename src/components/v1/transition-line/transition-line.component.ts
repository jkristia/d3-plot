import { Component, signal } from '@angular/core';
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
	readonly plot = signal<PlotV1 | null>(null);
	constructor() {
		this.plot.set(new PlotV1(null, {
			margin: { left: 5, top: 5, right: 5, bottom: 5},
			plots: [
				new Frame(),
				new TransitionLineDemo({ cssClasses: ['custom-a'] }),
			]
		}))
	}
}
