import { Component, ElementRef } from '@angular/core';
import { Plot } from '../../plot/plot';
import { Frame } from '../../plot/plot-types';
import { PlotBaseComponent } from '../../plot/plot-component/plot.component';


@Component({
	selector: 'plot-area-demo',
	standalone: true,
	imports: [
		PlotBaseComponent
	],
	templateUrl: './plot-area.component.html',
	styleUrl: './plot-area.component.scss'
})
export class PlotAreaComponent {
	public plot: Plot
	constructor(
		private _elm: ElementRef
	) {

		this.plot = new Plot(null, {
			areas: {
				topHeight: 20,
				bottomHeight: 30,
				leftWidth: 30,
				rightWidth: 40,
			},
			plots: [
				// test frame for label area
				new Frame({ cssClasses: ['top-label'] })
					.text('top area').area(() => this.plot?.topArea.inflate(-1.5)),

				new Frame({ cssClasses: ['bottom-label'] })
					.text('bottom area').area(() => this.plot?.bottomArea.inflate(-1.5)),

				new Frame({ cssClasses: ['left-label'] })
					.text('left area', { rotate: -90 }).area(() => this.plot?.leftArea.inflate(-1.5)),

				new Frame({ cssClasses: ['right-label'] })
					.text('right area', { rotate: 90 }).area(() => this.plot?.rightArea.inflate(-1.5)),

				new Frame({ cssClasses: ['plot-area'] })
					.text('plot area').area(() => this.plot?.plotArea.inflate(-1.5)),
			]
		})
	}
}
