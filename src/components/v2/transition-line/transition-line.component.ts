import * as d3 from 'd3';
import { Component, OnDestroy, signal } from '@angular/core';
import { LinearScale, LineSeries, PlotBaseComponent, PlotV2 } from '../../../plot';
import { Subject } from 'rxjs';
import { Point, Util } from '../../../plot/util';

class TransitionLineData {
	readonly dataChanged = new Subject<void>();
	readonly points: Point[] = [];
	private timerId?: ReturnType<typeof setTimeout>;
	private readonly delay = 1000;

	constructor() {
		this.fillData();
		this.tick();
	}

	public stop() {
		if (this.timerId) {
			clearTimeout(this.timerId);
			this.timerId = undefined;
		}
	}

	private fillData() {
		const randomX = d3.randomInt(0, 100);
		const randomY = d3.randomInt(0, 100);
		for (const _ of Util.range(20)) {
			this.points.push({
				x: randomX(),
				y: randomY(),
			});
		}
	}

	private tick() {
		this.timerId = setTimeout(() => {
			const randomX = d3.randomInt(0, 100);
			const randomY = d3.randomInt(0, 100);
			this.points.forEach((point) => {
				point.x = randomX();
				point.y = randomY();
			});

			this.points[0].x = 0;
			this.points[0].y = 0;
			this.points[1].x = 100;
			this.points[1].y = 100;
			this.points[2].x = 100;
			this.points[2].y = 0;
			this.points[3].x = 0;
			this.points[3].y = 100;

			this.dataChanged.next();
			this.tick();
		}, this.delay);
	}
}

@Component({
	selector: 'transition-line-demo',
	standalone: true,
	imports: [
		PlotBaseComponent
	],
	templateUrl: './transition-line.component.html',
	styleUrl: './transition-line.component.scss'
})
export class TransitionLineComponent implements OnDestroy {
	readonly plot = signal<PlotV2 | null>(null);
	private readonly data = new TransitionLineData();

	constructor() {
		const xyScale = new LinearScale();
		xyScale.margin = { top: 5, left: 5, right: 5, bottom: 5 };
		xyScale.xDomain(() => ({ min: 0, max: 100 }));
		xyScale.yDomain(() => ({ min: 0, max: 100 }));

		const plot = new PlotV2({
			cssClass: 'transition-line-v2',
			scales: [xyScale],
			plots: [
				new LineSeries(this.data, {
					cssClasses: ['custom-transition'],
					showPointMarkers: 'always',
					transitionDurationMs: 1000,
				}),
			],
		});
		plot.center.setScale(xyScale);
		this.plot.set(plot);
	}

	ngOnDestroy(): void {
		this.data.stop();
	}
}
