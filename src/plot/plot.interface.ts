import * as d3 from 'd3';
import { PlotTypeBase } from './plot-types/plottype';
import { Rect } from "./rect";

export type D3Selection<T = any> = d3.Selection<any, T, null, undefined>;

export interface IPlotOptions {
    width?: number;
    height?: number;
    margin?: Margin;
    areas?: Areas;
    plots?: PlotTypeBase[]
}

export interface IPlot {
    readonly fullArea: Rect;
    readonly topArea: Rect;
    readonly bottomArea: Rect;
    readonly leftArea: Rect;
    readonly rightArea: Rect;
    readonly plotArea: Rect;
}

export interface IPlotTypeOptions {
    cssClasses?: string[];
    showPoint?: boolean;
}

export type ValueFunc<T> = () => T;
export type ValueOrFunc = number | ValueFunc<number>;
export type LinePoint = { x: number, y: number };

export interface Areas {
    topHeight?: ValueOrFunc;
    leftWidth?: ValueOrFunc;
    rightWidth?: ValueOrFunc;
    bottomHeight?: ValueOrFunc;
}
export interface Margin {
    left: number;
    top: number;
    right: number;
    bottom: number;
}