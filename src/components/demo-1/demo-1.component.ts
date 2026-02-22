import { Component, signal } from '@angular/core';
import { LinearScale, PlotAreaSelection, PlotBaseComponent, Plot } from '../../plot';
import { DataSeries, dataCluster, dataCnstl, dataMmp, dataSmp } from './demo-data';
import { AxisAndGrid } from '../../plot/elements/axis-and-grid';
import { Point } from '../../plot/util';
import { PlotMouseHandler } from '../../plot/plot.mousehandler';
import { CrossCursor } from '../../plot/plot.cross-cursor';

@Component({
	selector: 'demo-1',
	standalone: true,
	imports: [
		PlotBaseComponent
	],
	templateUrl: './demo-1.component.html',
	styleUrls: ['./demo-1.component.scss', './demo-1.plot-styles.scss']
})
export class Demo1PlotComponent {
	public readonly plot = signal<Plot | null>(null);
	public constructor() {
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

		const plot = new Plot({
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
		plot.center.setScale(xyScale).setMouseHandler(mouseHandler);
		this.plot.set(plot);
	}
}
