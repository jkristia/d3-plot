import { Routes } from '@angular/router';
import { CHART_TABS, DEFAULT_CHART_TAB_ID } from './chart-tabs';

const chartRoutes: Routes = CHART_TABS.map((tab) => ({
	path: tab.id,
	component: tab.component,
	title: tab.label,
}));

export const routes: Routes = [
	{ path: '', redirectTo: DEFAULT_CHART_TAB_ID, pathMatch: 'full' },
	...chartRoutes,
	{ path: '**', redirectTo: DEFAULT_CHART_TAB_ID },
];
