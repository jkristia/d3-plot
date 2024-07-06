import { Component, ElementRef } from '@angular/core';
import { PlotBaseV1Component } from '../../../plot/v1/plot-component/plot.component';
import { PlotV1 } from '../../../plot';
import { Frame } from '../../../plot';


@Component({
	selector: 'plot-area-demo',
	standalone: true,
	imports: [
		PlotBaseV1Component
	],
	templateUrl: './plot-area.component.html',
	styleUrl: './plot-area.component.scss'
})
export class PlotAreaComponent {
	public plot: PlotV1
	constructor(
		private _elm: ElementRef
	) {

		this.plot = new PlotV1(null, {
			areas: {
				topHeight: 20,
				bottomHeight: 30,
				leftWidth: 30,
				rightWidth: 40,
			},
			plots: [
				// test frame for label area
				new Frame({ cssClasses: ['top-label'] })
					.text('top area').area(() => this.plot?.topArea.inflate(-2)),

				new Frame({ cssClasses: ['bottom-label'] })
					.text('bottom area').area(() => this.plot?.bottomArea.inflate(-2)),

				new Frame({ cssClasses: ['left-label'] })
					.text('left area', { rotate: -90 }).area(() => this.plot?.leftArea.inflate(-2)),

				new Frame({ cssClasses: ['right-label'] })
					.text('right area', { rotate: 90 }).area(() => this.plot?.rightArea.inflate(-2)),

				new Frame({ cssClasses: ['plot-area'] })
					.text('plot area').area(() => this.plot?.plotArea.inflate(-2)),
			]
		})
	}
}
