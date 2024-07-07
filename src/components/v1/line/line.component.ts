import * as d3 from 'd3';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Frame, ILineDataV1, LineV1, Text } from '../../../plot/v1/plot-types';
import { PlotBaseV1Component } from '../../../plot/v1/plot-component/plot.component';
import { Subject } from 'rxjs';
import { PlotV1 } from '../../../plot';
import { Point, Util } from '../../../plot/util';

class Data implements ILineDataV1 {
	points = [
		{ x: 0, y: 0 },
		{ x: 10, y: 0 },
		{ x: 20, y: 2 },
		{ x: 30, y: 5 },
		{ x: 100, y: 100 },
		{ x: 110, y: 100 },
		{ x: 115, y: 90 },
		{ x: 115, y: 140 },
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

type SET = Point[];
class JitterData implements ILineDataV1 {
    dataChanged = new Subject<void>;
	private _sets: SET[] = []
	points: (Point | null)[] = []

	constructor() {
		for (let setno of Util.range(2)) {
			const set: Point[] = []
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

class ManyLinesAndPoints implements ILineDataV1 {
	points: (Point | null)[] = []
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

class SinusData implements ILineDataV1 {
    dataChanged = new Subject<void>;

	points: (Point | null)[] = []
	startAngle = 5;
	stepAngle = (Math.PI / 180) * 5;
	noOfSamples = 500;
	yOffset = 250;
	amplitude = 50;
	random = d3.randomInt(0, 10)
	constructor() {
			// let angle = this.startAngle;
			// for (let x of Util.range(0, this.noOfSamples)) {
			// 	this.points.push({
			// 		x,
			// 		y: Math.sin(angle)
			// 	})
			// 	angle += this.stepAngle;
			// }
			// this.points.push(null)
			this.pretendJitter()
		}
	private pretendJitter() {
		if (this.points.length >= this.noOfSamples) {
			// start 'scrolling' once all samples have been added
			this.startAngle += 0.2;
		}
		let angle = this.startAngle;
		const notoadd = 20;
		// grow the line until max samples are added
		if (this.points.length < this.noOfSamples) {
			const x = this.points.length;
			for (let i = 0; i < notoadd; i++) {
				this.points.push({
					x: x + i,
					y: 0
				})
			}
		}
		this.points.forEach(p => {
			if (!p) {
				return;
			}
			const noise = this.random() * 1;
			p.y = this.yOffset + Math.sin(angle) * this.amplitude + noise
			angle += this.stepAngle;
		})
		this.dataChanged.next();
		setTimeout(() => {
			this.pretendJitter();
		}, 30);
	}


}

@Component({
	selector: 'line-demo',
	standalone: true,
	imports: [
		PlotBaseV1Component
	],
	templateUrl: './line.component.html',
	styleUrl: './line.component.scss'
})
export class LineComponent {
	public plot: PlotV1
	_lineData = new Data();
	_jitterData = new JitterData();
	_manyLinesData = new ManyLinesAndPoints();
	_sinusData = new SinusData();
	constructor(
		private _elm: ElementRef
	) {
		this.plot = new PlotV1(null, {
			areas: {
				topHeight: 20,
				leftWidth: 30,
				rightWidth: 5,
				bottomHeight: 15,
			},
			plots: [
				// title
				new Text({ text: 'Multiple Lines', cssClasses: ['title'] }).area(() => this.plot?.topArea),
				// left label
				new Text({ text: 'Random Noise', rotate: -90, cssClasses: ['left-label'] }).area(() => this.plot?.leftArea),
				// bottom label
				new Text({
					text: '**footnote',
					position: 'right',
					offset: { x: -10, y: 4},
					cssClasses: ['footnote']
				}).area(() => this.plot?.bottomArea),

				// plots
				new Frame().area(() => this.plot?.plotArea),
				// render many lines set in the background, first layer
				// new Line(this._manyLinesData, { cssClasses: ['line-3'], showPoint: false }),
				// render discontinuous line jitter line at the same scale (using same domain)
				new LineV1(this._lineData),
				new LineV1(this._jitterData, {
					cssClasses: ['line-2'],
					showPoint: false,
				})
				.getDomain(() => [0, this._lineData.max]) // keep the 2 lines at the same x-scale
				,
				// render a noisy sinus slowly moving across the plot area
				new LineV1(this._sinusData, {
					cssClasses: ['line-4'],
					showPoint: false,
				})
				.getDomain(() => [0, this._sinusData.noOfSamples]) // set domain to full width
			]
		})
	}
}
