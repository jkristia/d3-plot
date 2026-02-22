import { Type } from '@angular/core';
import { Demo1PlotComponent } from '../components/v2/demo-1/demo-1.component';
import { TransitionLineComponent } from '../components/v1/transition-line/transition-line.component';
import { PlotAreaComponent } from '../components/v1/plot-area/plot-area.component';
import { LineComponent } from '../components/v1/line/line.component';

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
];

export const DEFAULT_CHART_TAB_ID = CHART_TABS[0].id;
