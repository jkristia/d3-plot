import { Component } from '@angular/core';
import { LinearScale, PlotBaseComponent, PlotV2 } from '../../../plot';
import { DataSeries, dataCluster, dataCnstl, dataMmp, dataSmp } from './demo-data';
import { AxisAndGrid } from '../../../plot/v2/elements/axis-and-grid';

@Component({
	selector: 'demo-1',
	standalone: true,
	imports: [
		PlotBaseComponent
	],
	templateUrl: './demo-1.component.html',
	styleUrl: './demo-1.component.scss'
})
export class Demo1PlotComponent {
	public plot: PlotV2
	constructor() {
		// goal is to duplicate this chart
		// https://js.devexpress.com/Angular/Demos/WidgetsGallery/Demo/Charts/Spline/MaterialPurpleDark/

		const xyScale = new LinearScale();
		xyScale.margin = { top: 10, left: 40, right: 5, bottom: 30 };
		xyScale.xDomain(d => { return { min: 1996.9, max: 2007.1 } })
		xyScale.yDomain(d => { return { min: 0, max: 500 } })

		this.plot = new PlotV2({
			cssClass: 'custom-1',
			title: 'Architecture Share Over Time (Count)',

			scales: [
				xyScale,
			],
			plots: [
				new AxisAndGrid().setScale(xyScale),
				new DataSeries({ points: dataSmp() }, { cssClasses: ['smp'], showPointMarkers: true }).setScale(xyScale),
				new DataSeries({ points: dataMmp() }, { cssClasses: ['mmp'], showPointMarkers: true }).setScale(xyScale),
				new DataSeries({ points: dataCnstl() }, { cssClasses: ['cnstl'], showPointMarkers: true }).setScale(xyScale),
				new DataSeries({ points: dataCluster() }, { cssClasses: ['cluster'], showPointMarkers: true }).setScale(xyScale),
			]
		})
	}
}
