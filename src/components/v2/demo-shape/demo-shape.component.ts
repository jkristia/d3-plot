import { Component } from '@angular/core';
import { LinearScale, LineSeries, PlotBaseComponent, PlotV2 } from '../../../plot';
import { PlotMouseHandler } from '../../../plot/v2/plot.mousehandler';
import { CrossCursor } from '../../../plot/v2/plot.cross-cursor';
import { Point } from '../../../plot/util';

@Component({
	selector: 'demo-shape',
	standalone: true,
	imports: [
		PlotBaseComponent
	],
	templateUrl: './demo-shape.component.html',
	styleUrl: './demo-shape.component.scss'
})
export class DemoShapePlotComponent {
	public plot: PlotV2
	constructor() {
		// goal is to duplicate this chart
		// https://js.devexpress.com/Angular/Demos/WidgetsGallery/Demo/Charts/Spline/MaterialPurpleDark/

		const scale = new LinearScale();
		// scale.margin = { top: 5, left: 5, right: 5, bottom: 5 };
		// scale.xDomain(d => { return { min: d.left, max: d.right } })
		// scale.yDomain(d => { return { min: d.top, max: d.bottom } })
		// xyScale.xDomain(d => { return { min: 0, max: 10 } })
		// xyScale.yDomain(d => { return { min: 0, max: 5 } })

		const tmp: Point[] = [
			{ x: 0, y: 0 },
			{ x: 0, y: 100 },
			{ x: 100, y: 100 },
			{ x: 100, y: 0 },
			{ x: 0, y: 0 },
		]
		// const mouseHandler = new PlotMouseHandler().setCursor(new CrossCursor());

		this.plot = new PlotV2({
			cssClass: 'custom-2',
			// title: 'Shape Demo',

			scales: [
				scale,
			],
			plots: [
				new LineSeries({ points: tmp }, { cssClasses: ['smp'], showPointMarkers: 'always' }).setScale(scale),
			]
		})
		// this.plot.center.setScale(xyScale).setMouseHandler(mouseHandler);
	}
}
