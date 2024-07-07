import { Component, ElementRef } from '@angular/core';
import { PlotBaseComponent, PlotV2 } from '../../../plot';


@Component({
	selector: 'plot-area-v2',
	standalone: true,
	imports: [
		PlotBaseComponent
	],
	templateUrl: './plot-area.component.html',
	styleUrl: './plot-area.component.scss'
})
export class PlotAreaV2Component {
	public plot: PlotV2
	constructor() {
		this.plot = new PlotV2({
			titleArea: { height: 20, plots: [] },
			leftArea: { width: 100, plots: [] },
			rightArea: { width: 20, plots: [] },
			footerArea: { height: 20, plots: [] },
			// plots: [
			// 	// test frame for label area
			// 	new Frame({ cssClasses: ['top-label'] })
			// 		.text('top area').area(() => this.plot?.topArea.inflate(-2)),

			// 	new Frame({ cssClasses: ['bottom-label'] })
			// 		.text('bottom area').area(() => this.plot?.bottomArea.inflate(-2)),

			// 	new Frame({ cssClasses: ['left-label'] })
			// 		.text('left area', { rotate: -90 }).area(() => this.plot?.leftArea.inflate(-2)),

			// 	new Frame({ cssClasses: ['right-label'] })
			// 		.text('right area', { rotate: 90 }).area(() => this.plot?.rightArea.inflate(-2)),

			// 	new Frame({ cssClasses: ['plot-area'] })
			// 		.text('plot area').area(() => this.plot?.plotArea.inflate(-2)),
			// ]
		})
	}
}
