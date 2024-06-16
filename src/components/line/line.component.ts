import * as d3 from 'd3';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Plot } from '../../plot/plot';
import { Frame, ILineData, Line } from '../../plot/plot-types';
import { PlotBaseComponent } from '../../plot/plot-component/plot.component';
import { Subject } from 'rxjs';
import { Util } from '../../plot/util';
import { LinePoint } from '../../plot';

class Data implements ILineData {
	points = [
		{ x: 0, y: 0 },
		{ x: 100, y: 100 },
		{ x: 110, y: 90 },
		{ x: 120, y: 190 },
		null,
		{ x: 140, y: 190 },
		{ x: 210, y: 10 },
		{ x: 250, y: 50 },
		{ x: 290, y: 5 },
		{ x: 300, y: 0 },
	]
	get max(): number {
		return d3.max(this.points, d => d?.x) || 0
	}
}

type SET = LinePoint[];
class JitterData implements ILineData {
    dataChanged = new Subject<void>;
	private _sets: SET[] = []
	points: (LinePoint | null)[] = []

	constructor() {
		for (let setno of Util.range(2)) {
			const set: LinePoint[] = []
			this._sets.push(set);
			for (let x of Util.range(50, 250, 2)) {
				set.push({
					x,
					y: 0
				})
			}
		}
		this.points = [];
		this._sets.forEach( s => {
			s.forEach(p => this.points.push(p))
			this.points.push(null)
		})
		this.pretendJitter()
	}
	private pretendJitter() {
		const randomY = d3.randomInt(0, 20);
		this._sets.forEach( (s,i) => {
			s.forEach( sample => {
				sample.y = 110 + (i * 40) + randomY()
			})
		})
		setTimeout(() => {
			this.dataChanged.next();
			this.pretendJitter();
		}, 30);
	}
}

class ManyLinesAndPoints implements ILineData {
	points: (LinePoint | null)[] = []
	constructor() {

		const randomY = d3.randomInt(0, 40);
		const randomStartY = d3.randomInt(20, 300);
		// const noOfLines = 200;
		// const noOfSamples = 100;
		const noOfLines = 300;
		const noOfSamples = 200;
		for (let _ of Util.range(noOfLines)) {
			const y = randomStartY();
			for (let x of Util.range(0, noOfSamples)) {
				this.points.push({
					x,
					y: y + randomY()
				})
			}
			this.points.push(null)
		}
	}
}


@Component({
	selector: 'line-demo',
	standalone: true,
	imports: [
		PlotBaseComponent
	],
	templateUrl: './line.component.html',
	styleUrl: './line.component.scss'
})
export class LineComponent {
	public plot: Plot
	_data = new Data();
	_data2 = new JitterData();
	_data3 = new ManyLinesAndPoints();
	constructor(
		private _elm: ElementRef
	) {

		this.plot = new Plot(null, {
			plots: [
				new Frame(),
				new Line(this._data3, { cssClasses: ['line-3'], showPoint: false }),
				// keep the 2 lines at the same x-scale
				new Line(this._data),
				new Line(this._data2, {
					cssClasses: ['line-2'],
					showPoint: false,
				}).getDomain(() => [0, this._data.max]),
			]
		})
	}
}
