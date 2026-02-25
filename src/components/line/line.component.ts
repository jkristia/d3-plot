import * as d3 from 'd3';
import { Component, OnDestroy, signal } from '@angular/core';
import { ILineData, LineSeries, LinearScale, PlotBaseComponent, Plot } from '../../plot';
import { Subject } from 'rxjs';
import { Point, Util } from '../../plot/util';

class Data implements ILineData {
	public readonly points: (Point | null)[] = [
		{ x: 0, y: 0 },
		{ x: 10, y: 0 },
		{ x: 20, y: 2 },
		{ x: 30, y: 5 },
		{ x: 100, y: 100 },
		{ x: 110, y: 100 },
		{ x: 115, y: 90 },
		{ x: 115, y: 140 },
		{ x: 120, y: 190 },
		null, // break line, null = gap
		{ x: 140, y: 190 },
		{ x: 210, y: 10 },
		{ x: 250, y: 50 },
		{ x: 290, y: 5 },
		{ x: 300, y: 0 },
	];

	public get max(): number {
		return d3.max(this.points, (d) => d?.x) || 0;
	}
}

type SetPoints = Point[];
class JitterData implements ILineData {
	public readonly dataChanged = new Subject<void>();
	public readonly points: (Point | null)[] = [];
	private readonly sets: SetPoints[] = [];
	private timerId?: ReturnType<typeof setTimeout>;

	public constructor() {
		for (const _ of Util.range(2)) {
			const set: Point[] = [];
			this.sets.push(set);
			for (const x of Util.range(50, 250, 2)) {
				const point = { x, y: 0 };
				set.push(point);
				this.points.push(point);
			}
			this.points.push(null);
		}
		this.tick();
	}

	public stop() {
		if (this.timerId) {
			clearTimeout(this.timerId);
			this.timerId = undefined;
		}
	}

	private tick() {
		const randomY = d3.randomInt(0, 20);
		this.sets.forEach((set, i) => {
			set.forEach((sample) => {
				sample.y = 110 + i * 40 + randomY();
			});
		});

		this.dataChanged.next();
		this.timerId = setTimeout(() => this.tick(), 30);
	}
}

class SinusData implements ILineData {
	public readonly dataChanged = new Subject<void>();
	public readonly points: Point[] = [];
	public startAngle = 5;
	public stepAngle = (Math.PI / 180) * 5;
	public noOfSamples = 500;
	public yOffset = 250;
	public amplitude = 50;
	public random = d3.randomInt(0, 10);
	private timerId?: ReturnType<typeof setTimeout>;

	public constructor() {
		this.tick();
	}

	public stop() {
		if (this.timerId) {
			clearTimeout(this.timerId);
			this.timerId = undefined;
		}
	}

	private tick() {
		if (this.points.length >= this.noOfSamples) {
			this.startAngle += 0.2;
		}

		let angle = this.startAngle;
		const toAdd = 20;
		if (this.points.length < this.noOfSamples) {
			const x = this.points.length;
			for (let i = 0; i < toAdd; i++) {
				this.points.push({ x: x + i, y: 0 });
			}
		}

		this.points.forEach((point) => {
			const noise = this.random();
			point.y = this.yOffset + Math.sin(angle) * this.amplitude + noise;
			angle += this.stepAngle;
		});

		this.dataChanged.next();
		this.timerId = setTimeout(() => this.tick(), 30);
	}
}

@Component({
	selector: 'line-demo',
	standalone: true,
	imports: [
		PlotBaseComponent,
	],
	templateUrl: './line.component.html',
	styleUrls: ['./line.component.scss'],
})
export class LineComponent implements OnDestroy {
	public readonly plot = signal<Plot | null>(null);
	private readonly lineData = new Data();
	private readonly jitterData = new JitterData();
	private readonly sinusData = new SinusData();

	public constructor() {
		const lineScale = new LinearScale();
		lineScale.margin = { top: 5, left: 5, right: 5, bottom: 5 };
		lineScale.xDomain(() => ({ min: 0, max: this.lineData.max }));
		lineScale.yDomain(() => ({ min: 0, max: 320 }));

		const sinusScale = new LinearScale();
		sinusScale.margin = { top: 5, left: 5, right: 5, bottom: 5 };
		sinusScale.xDomain(() => ({ min: 0, max: this.sinusData.noOfSamples }));
		sinusScale.yDomain(() => ({ min: 0, max: 320 }));

		const plot = new Plot({
			cssClass: 'line-demo',
			title: 'Multiple Lines',
			scales: [lineScale, sinusScale],
			plots: [
				new LineSeries(this.lineData).setScale(lineScale),
				new LineSeries(this.jitterData, {
					cssClasses: ['line-2'],
				}).setScale(lineScale),
				new LineSeries(this.sinusData, {
					cssClasses: ['line-4'],
				}).setScale(sinusScale),
			],
		});
		this.plot.set(plot);
	}

	public ngOnDestroy(): void {
		this.jitterData.stop();
		this.sinusData.stop();
		this.plot()?.destroy();
		this.plot.set(null);
	}
}
