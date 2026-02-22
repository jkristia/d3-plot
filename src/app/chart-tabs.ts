import { Type } from '@angular/core';
import { Demo1PlotComponent } from '../components/demo-1/demo-1.component';
import { BarChartComponent } from '../components/bar-chart/bar-chart.component';
import { TransitionLineComponent } from '../components/transition-line/transition-line.component';
import { LineComponent } from '../components/line/line.component';
import { PlotAreaComponent } from '../components/plot-area/plot-area.component';

export interface ChartTab {
	id: string;
	label: string;
	component: Type<unknown>;
}

export const CHART_TABS: ChartTab[] = [
	{
		id: 'transition-line',
		label: 'Transition Line',
		component: TransitionLineComponent,
	},
	{
		id: 'plot-area',
		label: 'Plot Area',
		component: PlotAreaComponent,
	},
	{
		id: 'line',
		label: 'Line',
		component: LineComponent,
	},
	{
		id: 'demo-1',
		label: 'Demo 1',
		component: Demo1PlotComponent,
	},
	{
		id: 'bar-chart',
		label: 'Bar Chart',
		component: BarChartComponent,
	},
];

export const DEFAULT_CHART_TAB_ID = CHART_TABS[0].id;
