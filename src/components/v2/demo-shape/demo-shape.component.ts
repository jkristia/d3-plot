import { Component } from '@angular/core';
import { CircleShape, GroupShape, LinearScale, LineSeries, LineShape, PlotBaseComponent, PlotV2, RectShape, ShapePlot, TextShape } from '../../../plot';
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

					], { id: 'g1', cssClasses: ['a-group', 'foo'] }),
					new GroupShape([
						new LineShape([
							{ x: 10, y: 10 },
							{ x: 180, y: 180 },
							{ x: 220, y: 180 },
							{ x: 200, y: 200 },
						], { id: 'l1', cssClasses: ['green-line'] }),
						new CircleShape([
							{ pos: { x: 10, y: 10 }, radius: 10 },
							{ pos: { x: 180, y: 180 }, radius: 6 },
							{ pos: { x: 200, y: 200 }, radius: 6 },
							{ pos: { x: 220, y: 180 }, radius: 6 },
						], { cssClasses: ['small-circle '] }),
						new TextShape([
							{ pos: { x: 10, y: 10 }, text: 'text-1', alignment: 'center' },
							{ pos: { x: 180, y: 180 }, text: 'text-2', alignment: 'center' },
							{ pos: { x: 200, y: 200 }, text: '(200, 200)', alignment: 'center' },
						], { cssClasses: ['small-text '], offset: { x: 0, y: 10 } }),

						new LineShape([
							{ x: 10, y: 10 },
							{ x: 180, y: 180 },
							{ x: 220, y: 180 },
							{ x: 200, y: 200 },
						], { cssClasses: ['blue-line'], offset: { x: 300, y: 0 } }),
						new CircleShape([
							{ pos: { x: 10, y: 10 }, radius: 10 },
							{ pos: { x: 180, y: 180 }, radius: 6 },
							{ pos: { x: 200, y: 200 }, radius: 6 },
							{ pos: { x: 220, y: 180 }, radius: 6 },
						], { cssClasses: ['small-circle blue '], offset: { x: 300, y: 0 } }),
						new TextShape([
							{ pos: { x: 10, y: 10 }, text: 'text-1', alignment: 'center' },
							{ pos: { x: 180, y: 180 }, text: 'text-2', alignment: 'center' },
							{ pos: { x: 200, y: 200 }, text: '(200, 200)', alignment: 'center' },
						], { cssClasses: ['small-text blue'], offset: { x: 300, y: 15 } })
					], { id: 'g2', cssClasses: ['a-circle-group'], offset: { x: 300, y: 0 } }),
					new GroupShape([
						new CircleShape([
							{ pos: { x: 100, y: 100 }, radius: 4 },
							// { pos: { x: 200, y: 180 }, radius: 4 },
							// { pos: { x: 100, y: 180 }, radius: 4 },
							// { pos: { x: 200, y: 100 }, radius: 4 },
						], { cssClasses: ['circle '] }),
						new RectShape([
							{ x: 100, y: 100, width: 100, height: 80, rx: 5 },
							{ x: 110, y: 110, width: 100, height: 80, rx: 5 },
							{ x: 120, y: 120, width: 100, height: 80, rx: 5 },
						], { cssClasses: ['rect'] }),
					], { id: 'g3', cssClasses: ['a-rect-group'], offset: { x: 50, y: 50 } }),
				]),
			]
		})
		this.plot.center.setScale(scale)
		// const mouseHandler = new PlotMouseHandler().setCursor(new CrossCursor());
		// this.plot.center.setScale(scale).setMouseHandler(mouseHandler);
	}
}
