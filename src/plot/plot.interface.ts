import * as d3 from 'd3';
import { PlotTypeBase } from './plot-types/plottype';
import { Rect } from './util';

export type D3Selection<T = any> = d3.Selection<any, T, null, undefined>;

export interface IPlotOptions {
    width?: number;
    height?: number;
    plots?: PlotTypeBase[]
}

export interface IPlot {
    readonly plotArea: Rect;
}

export interface IPlotTypeOptions {
    cssClasses?: string[];
    showPoint?: boolean;
}

export type ValueFunc<T> = () => T;
export type LinePoint = { x: number, y: number };
