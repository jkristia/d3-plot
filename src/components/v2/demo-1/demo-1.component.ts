import { Component } from '@angular/core';
import { LinearScale, PlotAreaSelection, PlotBaseComponent, PlotV2 } from '../../../plot';
import { DataSeries, dataCluster, dataCnstl, dataMmp, dataSmp } from './demo-data';
import { AxisAndGrid } from '../../../plot/v2/elements/axis-and-grid';
import { Point } from '../../../plot/util';
import { PlotMouseHandler } from '../../../plot/v2/plot.mousehandler';
import { CrossCursor } from '../../../plot/v2/plot.cross-cursor';

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
		// xyScale.xDomain(d => { return { min: 0, max: 10 } })
		// xyScale.yDomain(d => { return { min: 0, max: 5 } })

		// const tmp: Point[] = [
		// 	{ x: 0, y: 0 },
		// 	{ x: 0, y: 5 },
		// 	{ x: 10, y: 5 },
		// 	{ x: 10, y: 0 },
		// 	{ x: 0, y: 0 },
		// ]
		const mouseHandler = new PlotMouseHandler().setCursor(new CrossCursor());

		this.plot = new PlotV2({
			cssClass: 'custom-1',
			title: 'Architecture Share Over Time (Count)',

			scales: [
				xyScale,
			],
			plots: [
				new AxisAndGrid(),
				new PlotAreaSelection(),
				// new DataSeries({ points: tmp }, { cssClasses: ['smp'], showPointMarkers: true }).setScale(xyScale),
				new DataSeries({ points: dataSmp() }, { cssClasses: ['smp'], id: '#1', showPointMarkers: 'always', curveType: 'smooth' }),
				new DataSeries({ points: dataMmp() }, { cssClasses: ['mmp'], id: '#2', showPointMarkers: 'onhover', curveType: 'smooth' }),
				new DataSeries({ points: dataCnstl() }, { cssClasses: ['cnstl'], id: '#3', showPointMarkers: 'onhover', curveType: 'smooth' }),
				new DataSeries({ points: dataCluster() }, { cssClasses: ['cluster'], id: '#4', curveType: 'smooth' }),
			]
		})
		this.plot.center.setScale(xyScale).setMouseHandler(mouseHandler);
	}
}
