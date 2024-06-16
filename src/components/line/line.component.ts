import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Plot } from '../../plot/plot';
import { Frame, ILineData, Line } from '../../plot/plot-types';
import { PlotBaseComponent } from '../../plot/plot-component/plot.component';

class Data implements ILineData{
	points = [
		{ x: 0, y: 0},
		{ x: 100, y: 100},
		{ x: 110, y: 90},
		{ x: 120, y: 190},
		null,
		{ x: 140, y: 190},
		{ x: 210, y: 10},
		{ x: 250, y: 50},
		{ x: 290, y: 5},
		{ x: 300, y: 0},
	]
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
	constructor(
		private _elm: ElementRef
	) {

		this.plot = new Plot(null, {
			plots: [
				new Frame(),
				new Line(this._data),
			]
		})
	}
}
