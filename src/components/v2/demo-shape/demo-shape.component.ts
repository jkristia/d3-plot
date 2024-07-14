import { Component } from '@angular/core';
import { GroupShape, LinearScale, LineSeries, LineShape, PlotBaseComponent, PlotV2, ShapePlot } from '../../../plot';
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
		const scale = new LinearScale();
		scale.margin = { top: 5, left: 5, right: 5, bottom: 5 };

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
			title: 'Shape Demo',

			scales: [
				scale,
			],
			plots: [
				new LineSeries({ points: tmp }, { cssClasses: ['smp'], showPointMarkers: 'always' }),
				new ShapePlot([
					new GroupShape([
						new LineShape(
							[{ x: 100, y: 100 }, { x: 200, y: 100 }, { x: 150, y: 50 },],
							{ id: 'l1', cssClasses: ['red-line'] }
						),
						new LineShape(
							[{ x: 150, y: 50 }, { x: 150, y: 110 },],
							{ id: 'l2', cssClasses: ['blue-line'] }
						),
						new LineShape(
							[
								{ x: 50, y: 200 },
								{ x: 80, y: 200 },
								{ x: 100, y: 180 },
								{ x: 100, y: 100 },
							],
							{ id: 'l1', cssClasses: ['green-line'] }
						),
						
					], {
						id: 'g1', cssClasses: ['a-group', 'foo']
					})
				]),
			]
		})
		this.plot.center.setScale(scale)
		// this.plot.center.setScale(xyScale).setMouseHandler(mouseHandler);
	}
}
