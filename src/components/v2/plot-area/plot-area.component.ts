import { Component } from '@angular/core';
import { PlotBaseComponent, PlotV2 } from '../../../plot';
import { DataSeries, dataCluster, dataCnstl, dataMmp, dataSmp } from './demo-data';

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
		// goal is to duplicate this chart
		// https://js.devexpress.com/Angular/Demos/WidgetsGallery/Demo/Charts/Spline/MaterialPurpleDark/

		this.plot = new PlotV2({
			cssClass: 'custom-1',
			title: 'Architecture Share Over Time (Count)',

			plots: [
				new DataSeries({ points: dataSmp() }, { cssClasses: ['smp'], showPointMarkers: true }),
				new DataSeries({ points: dataMmp() }, { cssClasses: ['mmp'], showPointMarkers: true }),
				new DataSeries({ points: dataCnstl() }, { cssClasses: ['cnstl'], showPointMarkers: true }),
				new DataSeries({ points: dataCluster() }, { cssClasses: ['cluster'], showPointMarkers: true }),
			]
		})
	}
}
